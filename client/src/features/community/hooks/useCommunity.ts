import { useQuery } from "@tanstack/react-query";
import { getCommunity } from "../services/getCommunityService";

export function useCommunity(
    communityId: string
){
    return useQuery({
        queryKey: ["community", communityId],
        queryFn: () => getCommunity(communityId),
        enabled: !!communityId,
    })
}