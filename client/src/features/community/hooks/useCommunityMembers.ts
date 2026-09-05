import { useQuery } from "@tanstack/react-query";
import { getCommunityMembers } from "../services/getCommunityMembers";

export function useCommunityMembers(
    communityId: string,
    isAuthenticated: boolean,
){
    return useQuery({
        queryKey: ["community-members", communityId],
        queryFn: () => getCommunityMembers(communityId),
        enabled: Boolean(communityId) && isAuthenticated,
    })
}