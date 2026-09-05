import { useQuery } from "@tanstack/react-query";

export function useTypingStatus(userId: string){
    return useQuery({
        queryKey: ["typing", userId],
        queryFn: () => false,
        enabled: Boolean(userId),
        initialData: false,
        staleTime: Infinity,
    })
}