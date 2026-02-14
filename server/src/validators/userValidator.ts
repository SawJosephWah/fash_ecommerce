import { body } from "express-validator";

import { Request, Response, NextFunction } from 'express';

// Rules for File Upload (instead of URL)
export const updateAvatarRules = (req: Request, res: Response, next: NextFunction) => {
    // Multer attaches the file to req.file
    if (!req.file) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please upload an image file'
        });
    }

    // Check file type (optional but recommended)
    if (!req.file.mimetype.startsWith('image')) {
        return res.status(400).json({
            status: 'fail',
            message: 'Only image files are allowed'
        });
    }

    next();
};


export const updateEmailValidator = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
];

export const updateNameValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
];

export const updatePasswordValidator = [
    body('current_password')
        .notEmpty()
        .withMessage('Current password is required'),
    body('new_password')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/\d/)
        .withMessage('New password must contain a number')
];

export const forgetPasswordValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
];


export const resetPasswordValidator = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];