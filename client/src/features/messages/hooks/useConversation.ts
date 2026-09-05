import { useQuery } from "@tanstack/react-query";
import { getConversation } from "../services/messageService";

export function useConversation(friendId: string){
    return useQuery({
        queryKey: ["conversation", friendId],
        queryFn: () => getConversation(friendId),
        enabled: Boolean(friendId),
    });
}