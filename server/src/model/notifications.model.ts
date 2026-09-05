import { Schema, model, Types, InferSchemaType } from "mongoose";
import { NOTIFICATION_TYPES } from "../constants/notification.js";

const notificationSchema = new Schema(
    {
        recipient: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        actor: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        type:  {
            type: String,
            enum: NOTIFICATION_TYPES,
            required: true,
        },
        entityId: {
            type: Types.ObjectId,
            required: true,
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

notificationSchema.index({
    recipient: 1,
    createdAt: -1,
});

notificationSchema.index({
    recipient: 1,
    isRead: 1,
});

notificationSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 2592000 }
);

export type NotificationDocument = 
    InferSchemaType<typeof notificationSchema> & {
        id: string;
    };

export const Notification = model<NotificationDocument>(
    "Notification",
    notificationSchema
);
