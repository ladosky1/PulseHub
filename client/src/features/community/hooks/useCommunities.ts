import { useQuery } from "@tanstack/react-query";

import { getCommunities } from "../services/communityService";

interface UseCommunitiesOptions {
    search?: string;
    category?: string;
}

export function useCommunities({
    search,
    category
} : UseCommunitiesOptions){
    return useQuery({
        queryKey: ["communities", search, category],
        queryFn: () => 
            getCommunities({
                search,
                category
            }),
        placeholderData: (previousData) => previousData,
    });
}