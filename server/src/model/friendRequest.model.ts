import { Schema, model } from "mongoose";

const friendRequestSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        pairKey: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        }
    },
    {
        timestamps: true,
    }
);

export const FriendRequest = model(
    "FriendRequest",
    friendRequestSchema
);