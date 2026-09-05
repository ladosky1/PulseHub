import { api } from "../../../lib/api";
import type { Friend } from "../../../types";

interface FriendsDto {
    _id: string;
    username: string;
    avatar: string | null;
}

interface GetFriendResponse{
    friends: FriendsDto[];
}

export async function getFriends(){
    const {data} = await api.get<GetFriendResponse>("/friends");

    return data.friends.map<Friend>((friend) => ({
        id: friend._id,
        username: friend.username,
        avatar: friend.avatar
    }));
}