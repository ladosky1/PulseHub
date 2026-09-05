import { api } from "../../../lib/api";
import type { FriendRequest } from "../../../types";

interface requestDto{
    _id: string;
    sender: {
        _id: string;
        username: string;
        avatar: string | null;
    };
    receiver: string;
    pairKey: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    updatedAt: string;
}

interface GetFriendRequestResponse {
    friendRequests: requestDto[];
}

export async function getFriendRequest(){
    const {data} = await api.get<GetFriendRequestResponse>(
        "/friends/requests",
    );

    return data.friendRequests.map<FriendRequest>((request) => ({
        id: request._id,
        sender: {
            id: request.sender._id,
            username: request.sender.username,
            avatar: request.sender.avatar,
        },
        receiver: request.receiver,
        pairKey: request.pairKey,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
    }));
}