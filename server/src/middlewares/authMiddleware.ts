import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync';
import User, { IUser } from '../models/userModel';

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
    user?: IUser;
}

export const protect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    const error: any = new Error('You are not logged in. Please log in to get access.');
    error.statusCode = 401;
    return next(error);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    const error: any = new Error('The user belonging to this token no longer exists.');
    error.statusCode = 401;
    return next(error);
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Check if user exists on request (added by protect middleware)
    if (!req.user) {
      const error: any = new Error('User not found in request context');
      error.statusCode = 500;
      return next(error);
    }

    // 2. Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      const error: any = new Error('You do not have permission to perform this action');
      error.statusCode = 403; // 403 Forbidden
      return next(error);
    }

    // 3. If role matches, move to the next middleware/controller
    next();
  };
};

