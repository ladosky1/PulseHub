import { Schema, Types, model  } from "mongoose";

const communityMessageSchema = new Schema(
    {
        sender: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        community: {
            type: Types.ObjectId,
            ref: "Community",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxLength: 2000,
        },
    },
    {
        timestamps: true,
    }
);

communityMessageSchema.index({
    community: 1,
    createdAt: -1,
});

export const CommunityMessage = model(
    "CommunityMessage",
    communityMessageSchema
);

