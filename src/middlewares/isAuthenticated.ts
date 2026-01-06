import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";

export const isAuthenticated = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer") ? authHeader.split(' ')[1] : null
    if (!token) {
      throw new ApiError(401, "User is not authenticated!");
    }

    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, "JWT secret not configured");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayload;

    if (!decoded?.userId) {
      throw new ApiError(401, "Invalid token");
    }

    req.userId = decoded.userId;

    next();
  }
);
