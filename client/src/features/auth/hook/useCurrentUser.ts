import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../service/getCurrentUser";

export function useCurrentUser() {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
}