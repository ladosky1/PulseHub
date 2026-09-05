import { api } from "../../../lib/api";

export async function sendFriendRequest(receiverId: string){
    const {data} = await api.post(
        "/friends/requests",
        {
            receiverId
        }
    );

    return data;
}