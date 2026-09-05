import { api } from "../../../lib/api";
import type {
    Message,
    SendMessagePayload
} from "../../../types";

interface ConversationListResponse {
    conversations: {
        friend: {
            _id: string;
            username: string;
            avatar: string | null;
        };
        lastMessage: string;
        lastMessageAt: string;
        unreadCount: number;
    }[];
}

interface ConversationResponse {
    conversation: {
        _id: string;
        sender: string;
        receiver: string;
        content: string;
        type: string;
        isRead: boolean;
        createdAt: string;
    }[];
}

interface SendMessageResponse {
    message: string;
    data: {
        _id: string;
        sender: string;
        receiver: string;
        content: string;
        type: string;
        isRead: boolean;
        createdAt: string;
    };
}

interface UnreadMessageResponse {
    unreadCount: number;
}

export async function getConversations(){
    const { data } =
        await api.get<ConversationListResponse>(
            "/messages/conversations"
        );

    return data.conversations.map((conversation) => ({
        friend: {
            id: conversation.friend._id,
            username: conversation.friend.username,
            avatar: conversation.friend.avatar,
        },
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCount: conversation.unreadCount,
    }));
}

export async function getConversation(friendId: string){
    const {data} = await api.get<ConversationResponse>(
        `/messages/conversations/${friendId}`
    );

    return data.conversation.map<Message>((message) => ({
        id: message._id,
        senderId: message.sender,
        receiverId: message.receiver,
        content: message.content,
        type: message.type,
        isRead: message.isRead,
        createdAt: message.createdAt,
    }));
};

export async function sendMessage(payload: SendMessagePayload){
    const {data} = await api.post<SendMessageResponse>(
        "/messages",
        payload
    );

    const message = data.data;

    return {
        id: message._id,
        senderId: message.sender,
        receiverId: message.receiver,
        content: message.content,
        type: message.type,
        isRead: message.isRead,
        createdAt: message.createdAt
    } satisfies Message;
}

export async function markConversationAsRead(friendId: string){
    const {data} = await api.patch(
        `/messages/conversations/${friendId}/read`
    );

    return data;
};

export async function getUnreadMessageCount(){
    const {data} = await api.get<UnreadMessageResponse>(
        "/messages/unread-count"
    );

    return data.unreadCount;
};

export async function deleteMessage(messageId: string){
    const {data} = await api.delete(
        `/messages/${messageId}`
    );

    return data;
}