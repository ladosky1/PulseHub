import { api } from "../../../lib/api";

export interface UserSearchResult {
    id: string;
    username: string;
    avatar: string | null;
};

interface SearchUsersResponse {
    users: {
        _id: string;
        username: string;
        avatar: string | null;
    }[];
};

export async function searchUsers(username: string){
    const {data} = await api.get<SearchUsersResponse>(
        "/users/search",
        {
            params: { username },
        }
    );

    return data.users.map<UserSearchResult>((user) => ({
        id: user._id,
        username: user.username,
        avatar: user.avatar,
    }))
}