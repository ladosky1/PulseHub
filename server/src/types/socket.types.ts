import { Types } from "mongoose";
import { NotificationType } from "../constants/notification.js";

export type PopulateSender = {
    _id: Types.ObjectId;
    username: string;
    avatar?: string;
}

export type SocketUserPayload = {
    id: string;
    username: string;
    avatar?: string | null;
};

export type MessageReceivedPayload = {
    id: string;
    sender: SocketUserPayload;
    receiver: string;
    content: string;
    type: "text";
    isRead: boolean;
    createdAt: Date;
};

export type CommunityMessagePayload = {
    id: string;
    sender: SocketUserPayload;
    community: string;
    content: string;
    createdAt: Date;
}

export type NotificationPayload = {
    id: string;
    type: NotificationType;
    entityId: string;
    actor: {
        id: string;
        username: string;
        avatar?: string | null;
    };
    isRead: boolean;
    createdAt: Date;
}
