import { api } from "../../../lib/api";
import type { UserProfile } from "../../../types";

interface GetUserProfileResponse {
    user: UserProfile;
}

export async function getUserProfile(userId: string){
    const {data} = await api.get<GetUserProfileResponse>(
        `/users/${userId}`
    );

    return data.user;
}