import { api } from "../../../lib/api";

export async function removeFriend(friendId: string){
    const {data} = await api.delete(
        `/friends/${friendId}`
    );

    return data;
}