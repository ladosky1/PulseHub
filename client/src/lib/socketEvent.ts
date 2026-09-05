export const SOCKETS_EVENTS = {
    USER_ONLINE: "user:online",
    USER_OFFLINE: "user:offline",
    USER_ONLINE_USERS: "user:online-users",

    FRIEND_REQUEST_RECEIVED: "friend:request-received",
    FRIEND_REQUEST_ACCEPTED: "friend:request-accepted",
    FRIEND_REQUEST_REJECTED: "friend:request-rejected",

    FRIEND_REMOVED: "friend:removed",

    MESSAGE_RECEIVED: "message:received",

    MESSAGE_READ: "message:read",

    TYPING_START: "typing:start",
    TYPING_STOP: "typing:stop",

    COMMUNITY_JOIN: "community:join",
    COMMUNITY_LEAVE: "community:leave",
    COMMUNITY_MESSAGE_RECEIVED: "community:message-received",

    NOTIFICATION_RECEIVED: "notification:received",
} as const;