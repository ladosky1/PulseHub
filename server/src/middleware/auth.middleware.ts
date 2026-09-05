import { NextFunction, Request, Response } from "express";
import { User } from "../model/user.model.js";
import { AppError } from "../errors/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const userId = req.session.userId;

        if(!userId){
            throw new AppError("Unauthorized", 401);
        };

        const user = await User.findById(userId);

        if(!user){
            throw new AppError("Unauthorized", 401);
        }

        req.user = user;

        next();
    }
)