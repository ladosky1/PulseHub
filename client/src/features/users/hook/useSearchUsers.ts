import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "../services/searchUsers";

export function useSearchUsers(username: string){
    return useQuery({
        queryKey: ["user-search", username],
        queryFn: () => searchUsers(username),
        enabled: username.trim().length >= 2,
    });
}