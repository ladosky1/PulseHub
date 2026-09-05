import { api } from "../../../lib/api";

export async function rejectFriendRequest(requestId: string){
    const {data} = await api.patch(
        "/friends/requests/reject",
        {
            requestId
        }
    );

    return data;
}