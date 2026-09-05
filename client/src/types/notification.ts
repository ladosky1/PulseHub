export type NotificationType =
    | "friend:request-received"
    | "friend:request-accepted"
    | "friend:request-rejected"
    | "friend:removed"

export interface NotificationActor{
    id: string;
    username: string;
    avatar: string | null | undefined;
}

export interface Notification {
    id: string;
    type: NotificationType;
    entityId: string;
    actor: NotificationActor;
    isRead: boolean;
    createdAt: string;
}