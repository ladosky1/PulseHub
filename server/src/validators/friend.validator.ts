import {z} from "zod";

export const objectIdSchema = z.string().regex(
    /^[0-f\d]{24}$/i, "Invalid MongoDb ObjectId"
);

export const sendFriendRequestSchema = z.object({
    receiverId: objectIdSchema,
});

export const acceptFriendRequestSchema = z.object({
    requestId: objectIdSchema,
});

export const friendIdParamSchema = z.object({
    friendId: objectIdSchema,
});