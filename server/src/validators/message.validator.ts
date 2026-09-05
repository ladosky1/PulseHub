import {z} from "zod";
import { objectIdSchema } from "./friend.validator.js";

export const sendMessageSchema = z.object({
    receiverId: objectIdSchema,
    content: z
        .string()
        .trim()
        .min(1)
        .max(2000),
});

export const conversationParamSchema = z.object({
    friendId: objectIdSchema,
});

export const markMessageAsReadSChema = z.object({
    friendId: objectIdSchema,
});

export const messageIdParamSchema = z.object({
    messageId: objectIdSchema,
})