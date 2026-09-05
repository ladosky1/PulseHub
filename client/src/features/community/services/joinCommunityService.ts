import { api } from "../../../lib/api";

export async function joinCommunity(communityId: string){
    const {data} = await api.post(
        `/communities/${communityId}/join`
    );

    return data;
}