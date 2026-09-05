export interface CommunityMessageSender {
    _id: string;
    username: string;
    avatar?: string | null;
};

export interface CommunityMessage {
    _id: string;
    sender: CommunityMessageSender;
    community: string;
    content: string;
    createdAt: string;
    status?: "sending" | "sent";
};

export interface CommunitySocketMessagePayload {
    id: string;
    sender: {
        id: string;
        username: string;
        avatar?: string | null;
    };
    community: string;
    content: string;
    createdAt: string;
}