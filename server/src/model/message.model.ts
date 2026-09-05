import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
    {
        sender: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        type: {
            type: String,
            enum: ["text"],
            default: "text"
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({
    sender: 1,
    receiver: 1,
    createdAt: -1,
});

export const Message = model("Message", messageSchema);