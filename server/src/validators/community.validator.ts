import {z} from "zod";
import { objectIdSchema } from "./friend.validator.js";
import { COMMUNITY_CATEGORIES } from "../constants/community.js";

export const createCommunitySchema = z.object({
    name: z
        .string()
        .trim()
        .min(3)
        .max(50),
    description: z
        .string()
        .trim()
        .max(500)
        .optional(),
    avatar: z
        .string()
        .url()
        .optional(),
    category: z
        .enum(COMMUNITY_CATEGORIES),
    isPrivate: z
        .boolean()
        .optional(),
});

export const communitySchema = z.object({
    communityId: objectIdSchema,
});

export const getCommunitiesQuerySchema = z.object({
    category: z
        .enum(COMMUNITY_CATEGORIES)
        .optional(),
    
    search: z
        .string()
        .trim()
        .min(1)
        .max(50)
        .optional()
});