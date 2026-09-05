import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessage } from "../services/messageService";
import type { Message } from "../../../types";

interface DeleteMessagePayload {
    messageId: string;
    friendId: string;
}

export function useDeleteMessage(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ messageId }: DeleteMessagePayload) => 
            deleteMessage(messageId),
        
        onSuccess: (_, { messageId, friendId }) => {
            queryClient.setQueryData<Message[]>(
                ["conversation", friendId],
                (oldMessages = []) => 
                    oldMessages?.filter(
                        (message) => message.id !== messageId
                    )
            );

            queryClient.invalidateQueries({
                queryKey: ["conversations"],
            })
        }
    })
}