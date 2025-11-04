import { ApiError } from "../utils/ApiError";
import { NextFunction, Request, Response } from "express";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode: number = err instanceof ApiError ? err.statusCode : 500
    const message: string = err.message || "Internal Server Error"

    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined

    })
}

export default errorHandler