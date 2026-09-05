import { asyncHandler } from "../utils/asyncHandler.js";
import { 
    getNotificationService,
    markNotificationAsReadService,
    markAllNotificationAsReadService,
    deleteNotificationService,
    deleteAllNotificationsService, 
} from "../services/notifications.service.js";

export const getNotifications = asyncHandler(async(req,res) => {
    const notifications = await getNotificationService(
        req.session.userId!
    );

    res.json({
        notifications
    })
});

export const markNotificationAsRead = asyncHandler(async(req, res) => {
    const notification = await markNotificationAsReadService(
        req.session.userId!,
        req.params.notificationId as string
    );

    res.json({
        message: "Notification marked as read",
        notification,
    })
});

export const markAllNotificationsAsRead = asyncHandler(async(req, res) => {
    const result = await markAllNotificationAsReadService(
        req.session.userId!
    );

    res.json({
        message: "All notifications marked as read",
        ...result,
    })
});

export const deleteNotification = asyncHandler(async(req, res) => {
    const result = await deleteNotificationService(
        req.session.userId!,
        req.params.notificationId as string
    );

    res.json({
        message: "Notification deleted successfuly",
        ...result,
    });
});

export const deleteAllNotification = asyncHandler(async(req, res) => {
    const deletedCount = await deleteAllNotificationsService(
        req.session.userId!,
    );

    res.json({
        message: "All notifications deleted",
        deletedCount,
    })
})