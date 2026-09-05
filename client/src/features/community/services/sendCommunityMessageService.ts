import { api } from "../../../lib/api";
import type { CommunityMessage } from "../../../types/communityMessage";

interface SendCommunityMessageResponse {
    message: string;
    data: CommunityMessage;
};

export async function sendCommunityMessage(
    communityId: string,
    content: string,
){
    const {data} = await api.post<SendCommunityMessageResponse>(
        `/communities/${communityId}/messages`,
        {
            content,
        }
    );

    return data.data;
}