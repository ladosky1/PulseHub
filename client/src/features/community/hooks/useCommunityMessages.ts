import { useQuery } from "@tanstack/react-query";
import { getCommunityMessages } from "../services/getCommunityMessageService";

export function useCommunityMessages(
    communityId: string,
    isAuthenticated: boolean,
){
    return useQuery({
        queryKey: ["community-messages", communityId],
        queryFn: () => getCommunityMessages(communityId),
        enabled: Boolean(communityId) && isAuthenticated,
    })
}