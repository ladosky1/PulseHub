import { useQuery } from "@tanstack/react-query";
import { getFriendRequest } from "../services/getFriendRequests";

export function useFriendRequests(){
    return useQuery({
        queryKey: ["friend-requests"],
        queryFn: getFriendRequest,
    });
}