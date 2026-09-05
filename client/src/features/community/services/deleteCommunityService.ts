import { api } from "../../../lib/api";

export async function deleteCommunity(communityId: string){
    const {data} = await api.delete(
        `/communities/${communityId}`
    );

    return data;
}