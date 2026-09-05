import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { ZodError } from "zod";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    if(err instanceof ZodError){
        return res.status(400).json({
            message: "validation failed!",
            errors: err.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        })
    }

    console.error(err);

    return res.status(500).json({
        message: "Internal Server Error",
    })
}