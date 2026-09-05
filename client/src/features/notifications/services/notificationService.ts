import { api } from "../../../lib/api";
import type { Notification } from "../../../types";

interface GetNotificationResponse {
    notifications: Notification[];
}

export async function getNotifications(){
    const {data} = await api.get<GetNotificationResponse>(
        "/notifications"
    );

    return data.notifications;
}

export async function markNotificationAsRead(notificationId: string){
    const {data} = await api.patch(
        `/notifications/${notificationId}/read`
    );

    return data;
}

export async function markAllNotificationAsRead(){
    const {data} = await api.patch(
        "/notifications/read-all"
    );

    return data;
}

export async function deleteNotification(notificationId: string){
    const {data} = await api.delete(
        `/notifications/${notificationId}`
    );

    return data;
};

export async function deleteAllNotifications(){
    const {data} = await api.delete(
        "/notifications"
    );

    return data;
}