import { api } from "../../../lib/api";
import type { CommunityMessage } from "../../../types/communityMessage";

interface GetCommunityMessageResponse {
    messages: CommunityMessage[];
};

export async function getCommunityMessages(
    communityId: string
){
    const {data} = await api.get<GetCommunityMessageResponse>(
        `/communities/${communityId}/messages`
    );

    return data.messages;
}