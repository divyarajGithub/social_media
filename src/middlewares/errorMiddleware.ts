import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { sendResponse } from "../utils/sendResponse";

export const globalErrorHanlder = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof ApiError) {
        (statusCode = err.statusCode), (message = err.message);
    }

    sendResponse(res, statusCode, message, err);
};
