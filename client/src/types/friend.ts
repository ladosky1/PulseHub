import type { PublicUser } from "./user";

export type Friend = PublicUser;

export interface FriendRequest {
    id: string;
    sender: Friend;
    receiver: string;
    pairKey: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    updatedAt: string;
}