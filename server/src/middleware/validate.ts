import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

type ValidateTarget = "body" | "params" | "query";

export function validate(
    schema: ZodType,
    target: ValidateTarget = "body"
){
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[target]);

        if(!result.success) {
            return next(result.error);
        }

        if(target === "query"){
            Object.defineProperty(req, "query", {
                value: result.data,
                writable: true,
                enumerable: true,
                configurable: true,
            })
        }else{
            req[target] = result.data;
        }

        next();
    };
}