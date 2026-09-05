export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
}

export interface PublicUser {
    id: string;
    username: string;
    avatar: string | null;
}

export type UserRelationship = 
    | "self"
    | "friends"
    | "request_sent"
    | "request_received"
    | "none";

export interface UserProfile {
    id: string;
    username: string;
    avatar: string | null;
    friendCount: number;
    createdAt: string;
    relationship: UserRelationship;
}