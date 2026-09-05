import { api } from "../../../lib/api";

export async function leaveCommunity(communityId: string){
    const {data} = await api.delete(
        `/communities/${communityId}/leave`
    );

    return data;
}