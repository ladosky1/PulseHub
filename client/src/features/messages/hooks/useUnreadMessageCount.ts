import { useQuery } from "@tanstack/react-query";
import { getUnreadMessageCount } from "../services/messageService";

export function useUnreadMessageCount(){
    return useQuery({
        queryKey: ["messages", "unread-count"],
        queryFn: getUnreadMessageCount,
    });
}