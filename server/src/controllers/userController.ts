import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { createAndSendToken } from '../utils/createToken';
import { uploadImage } from '../utils/cloudinary';
import { AuthRequest } from '../middlewares/authMiddleware';
import { forgetPasswordEmailTemplate } from '../utils/emailTemplate';
import sendEmail from '../utils/sendEmail';
import crypto from 'crypto';

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error: any = new Error('Email already in use');
        error.statusCode = 400;
        return next(error);
    }

    const newUser = await User.create({
        name,
        email,
        password,
        role
    });

    createAndSendToken(newUser._id.toString(), res);

    res.status(201).json({
        status: 'success',
        data: {
            user: {
                id: newUser._id
            }
        }
    });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1. Check if email and password exist in request
    if (!email || !password) {
        const error: any = new Error('Please provide email and password');
        error.statusCode = 400;
        return next(error);
    }

    // 2. Find user & select password (hidden by default in model)
    const user = await User.findOne({ email }).select('+password');

    // 3. Check if user exists AND password is correct
    if (!user || !(await user.comparePassword(password))) {
        const error: any = new Error('Incorrect email or password');
        error.statusCode = 401;
        return next(error);
    }

    // 4. If everything is OK, send token
    createAndSendToken(user._id.toString(), res);

    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: user._id,
                name: user.name
            }
        }
    });
});

export const logout = catchAsync(async (req: Request, res: Response,) => {

    res.cookie('token', '', {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({ status: 'success' });
});

export const updateAvatar = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {


    if (!req.file) {
        const error: any = new Error('No file uploaded');
        error.statusCode = 400;
        return next(error);
    }

    // Pass the path provided by Multer to your Cloudinary util
    const result = await uploadImage(req.file.path, 'avatars');

    if (!result) {
        const error: any = new Error('Cloudinary upload failed');
        error.statusCode = 500;
        return next(error);
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { avatar: result },
        { new: true }
    );

    res.status(200).json({ status: 'success', data: { user } });
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {

    const user = await User.findById(req.user?._id);

    if (!user) {
        const error: any = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }

    // 2. Send response matching your register style
    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        }
    });
});

export const updateEmail = catchAsync(async (req: AuthRequest, res: Response) => {
    const { email } = req.body;

    // 1. Check if another user is already using this email
    const existingUser = await User.findOne({ email, _id: { $ne: req?.user?._id } });

    if (existingUser) {
        throw new Error('This email is already in use by another account');
    }

    // 2. Update the user document
    const updatedUser = await User.findByIdAndUpdate(
        req?.user?._id,
        { email },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});


export const updateName = catchAsync(async (req: AuthRequest, res: Response) => {
    const { name } = req.body;

    // Update name only
    const updatedUser = await User.findByIdAndUpdate(
        req?.user?._id,
        { name },
        {
            new: true,           // Return the modified document
            runValidators: true  // Ensure Mongoose schema rules are still followed
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

export const updatePassword = catchAsync(async (req: AuthRequest, res: Response) => {
    const { current_password, new_password } = req.body;

    const user = await User.findById(req?.user?._id).select('+password');

    if (!user || !(await user.comparePassword(current_password))) {
        throw new Error('The current password you entered is incorrect');
    }

    user.password = new_password;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully'
    });
});

export const forgetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists
    if (!user) {
        // We use return next() to stop execution and pass to global error handler
        return next(new Error('There is no user with that email address.'));
    }

    // 3. Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 4. Send it to user's email
    const frontendURL = process.env.CORS_ORIGIN;
    const resetURL = `${frontendURL}/reset-password/${resetToken}`;
    const htmlBody = forgetPasswordEmailTemplate(resetURL);

    try {
        await sendEmail(
            user.email,
            'Your Password Reset Link (Valid for 10 min)',
            htmlBody
        );

        res.status(200).json({
            status: 'success',
            message: 'Password reset link sent to your email!',
        });

    } catch (err) {
        // Reset fields if email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpired = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new Error('There was an error sending the email. Try again later.'));
    }
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get token from params and password from body
    const { token } = req.params;
    const { password } = req.body;

    // 2. Hash the URL token to compare with the one in the DB
    const hashedToken = crypto
        .createHash('sha256')
        .update(token as string)
        .digest('hex');

    // 3. Find user with matching token that hasn't expired
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpired: { $gt: Date.now() },
    });

    // 4. If user doesn't exist or token is expired
    if (!user) {
        return next(new Error('Token is invalid or has expired. Please try again.'));
    }

    // 5. Update password (pre-save hook will hash this via bcrypt)
    user.password = password;
    
    // 6. Delete reset fields so token cannot be used again
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpired = undefined;

    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Your password has been reset successfully!',
    });
});