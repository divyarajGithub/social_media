import { Response } from "express";
import { ApiError } from "./ApiError";

export const sendResponse = (
    res: Response,
    statusCode: number,
    message: string,
    data?: any,
    error?: ApiError
) => {
    return res.status(statusCode).json({
        success: statusCode < 400,
        statusCode: statusCode,
        message,
        data,
        ...(process.env.NODE_ENV === "development" &&
            error && { stack: error.stack }),
    });
};
