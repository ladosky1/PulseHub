export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    type: string;
    createdAt: string;
    isRead: boolean;
    status?: "sending";
}

export interface Conversation {
    friend: {
        id: string;
        username: string;
        avatar: string | null;
    },
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
}

export interface SendMessagePayload {
    receiverId: string;
    content: string;
};

export interface MessageReceivedPayload {
    id: string;
    sender: {
        id: string;
        username: string;
        avatar: string | null;
    };
    receiver: string;
    content: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}