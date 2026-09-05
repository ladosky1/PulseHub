import { useQuery } from "@tanstack/react-query";
import { getConversations } from "../services/messageService";

export function useConversations(){
    return useQuery({
        queryKey: ["conversations"],
        queryFn: getConversations,
    });
}