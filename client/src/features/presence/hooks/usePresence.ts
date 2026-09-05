import { useQuery } from "@tanstack/react-query";

const PRESENCE_QUERY_KEY = ["presence", "online-users"];

export function usePresence() {
    const { data: onlineUsers = [] } = useQuery<string[]>({
        queryKey: PRESENCE_QUERY_KEY,
        queryFn: async () => [],
        enabled: false,
    });

    const isOnline = (userId: string) => {
        return onlineUsers.includes(userId);
    };

    return {
        onlineUsers,
        isOnline,
    };
}