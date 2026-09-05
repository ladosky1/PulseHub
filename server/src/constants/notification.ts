export const NOTIFICATION_TYPES = [
    "friend:request-received",
    "friend:request-accepted",
    "friend:request-rejected",
    "friend:removed"
] as const;

export type NotificationType = typeof NOTIFICATION_TYPES[number];