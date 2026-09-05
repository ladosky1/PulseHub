import { api } from "../../../lib/api";

export async function acceptFriendRequest(requestId: string){
    const {data} = await api.patch(
        "/friends/requests/accept",
        {
            requestId
        }
    );

    return data;
}