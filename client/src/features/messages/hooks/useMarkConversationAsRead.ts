import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markConversationAsRead } from "../services/messageService";
import type { Message } from "../../../types";

export function useMarkConversationAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (friendId: string) =>
            markConversationAsRead(friendId),

        onSuccess: (_, friendId) => {
            const conversations =
                queryClient.getQueryData<
                    {
                        friend: {
                            id: string;
                        };
                        unreadCount: number;
                    }[]>(["conversations"]);

            const unreadForFriend =
                conversations?.find(
                    (conversation) =>
                        conversation.friend.id === friendId
                )?.unreadCount ?? 0;

            queryClient.setQueryData<number>(
                ["messages", "unread-count"],
                (oldCount = 0) =>
                    Math.max(
                        0,
                        oldCount - unreadForFriend
                    )
            );

            queryClient.setQueryData(
                ["conversations"],
                (old: typeof conversations) =>
                    old?.map((conversation) =>
                        conversation.friend.id === friendId
                            ? {
                                ...conversation,
                                unreadCount: 0,
                            } : conversation
                    )
            );

            queryClient.setQueryData<Message[]>(
                ["conversation", friendId],
                (messages = []) => 
                    messages.map((message) => 
                        message.senderId === friendId
                            ? {
                                ...message,
                                isRead: true,
                            }
                            : message
                    )
            )
        },
    });
}
