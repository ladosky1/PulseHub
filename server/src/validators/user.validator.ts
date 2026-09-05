import {z} from "zod";
import { objectIdSchema } from "./friend.validator.js";

export const userIdParamSchema = z.object({
    userId: objectIdSchema,
});

export const searchUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1)
        .max(30),
});

export const notificationIdParamSchema = z.object({
    notificationId: objectIdSchema,
});