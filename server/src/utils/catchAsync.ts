import { Request, Response, NextFunction } from 'express';

// Define a type for our controller functions
type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const catchAsync = (fn: AsyncController) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Resolve the promise and catch any errors, passing them to next()
    fn(req, res, next).catch(next);
  };
};