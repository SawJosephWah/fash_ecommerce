import { Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Generates a JWT and attaches it to the response via a cookie.
 * Does not send the response to the client.
 */
export const createAndSendToken = (userId: string, res: Response, expiresIn: number = 60 * 60): void => {
    // 1. Create Token
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET as string,
        { expiresIn }
    );


    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "nonoe" : "lax",
        maxAge: expiresIn * 1000, // convert seconds to milliseconds
    };


    res.cookie('token', token, cookieOptions as object);

};