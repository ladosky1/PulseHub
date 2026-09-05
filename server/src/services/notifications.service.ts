import { Notification } from "../model/notifications.model.js";
import { NotificationType } from "../constants/notification.js";
import { emitNotification } from "../sockets/emitters/notification.emitter.js";
import { AppError } from "../errors/AppError.js";
import { Types } from "mongoose";

export async function createNotificationService(
    recipientId: string,
    actor: {
        id: string;
        username: string;
        avatar: string | null | undefined;
    },
    type: NotificationType,
    entityId: string,
){
    const notification = await Notification.create({
        recipient: recipientId,
        actor: actor.id,
        type,
        entityId
    });

    const payload = {
        id: notification.id,
        type: notification.type,
        entityId: notification.entityId.toString(),
        actor,
        isRead: notification.isRead,
        createdAt: notification.createdAt
    };

    emitNotification(
        recipientId,
        payload
    );

    return notification;
}

export async function getNotificationService(
    userId: string
){
    const notifications = await Notification.find({
        recipient: userId
    }).populate<{
        actor: {
            _id: Types.ObjectId;
            username: string;
            avatar: string | null;
        };
    }>(
        "actor",
        "username avatar"
    ).sort({ createdAt: -1 });

    return notifications.map((notification) => ({
        id: notification.id,
        type: notification.type,
        entityId: notification.entityId.toString(),
        actor: {
            id: notification.actor._id.toString(),
            username: notification.actor.username,
            avatar: notification.actor.avatar,
        },
        isRead: notification.isRead,
        createdAt: notification.createdAt,
    }))
};

export async function markNotificationAsReadService(
    userId: string,
    notificationId: string,
){
    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            recipient: userId,
            isRead: false,
        },
        {
            $set: {
                isRead: true
            },
        },
        {
            returnDocument: "after",
        }
    );

    if(!notification){
        throw new AppError(
            "Notification not found",
            404
        );
    }

    return notification;
}

export async function markAllNotificationAsReadService(
    userId: string
){
    const result = await Notification.updateMany(
        {
            recipient: userId,
            isRead: false,
        },
        {
            $set: {
                isRead: true,
            },
        }
    );

    return {
        modifiedCount: result.modifiedCount,
    }
}

export async function deleteNotificationService(
    userId: string,
    notificationId: string,
){
    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId,
    });

    if(!notification){
        throw new AppError("Notification not found", 404);
    }

    await notification.deleteOne();

    return {
        notificationId: notification.id,
    }
};

export async function deleteAllNotificationsService(
    userId: string,
){
    const result = await Notification.deleteMany({
        recipient: userId,
    });

    return result.deletedCount;
}