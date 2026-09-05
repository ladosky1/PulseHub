import {z} from "zod";
import { objectIdSchema } from "./friend.validator.js";

export const sendCommunityMessageSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1)
        .max(2000),
});

export const getCommunityMessageSchema = z.object({
    communityId: objectIdSchema,
});