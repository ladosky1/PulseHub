import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../services/messageService";
import type { 
    SendMessagePayload,
    Message, 
} from "../../../types";

export function useSendMessage(currentUserId: string){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SendMessagePayload) =>
            sendMessage(payload),

        onMutate: async(variables) => {
            const queryKey = ["conversation", variables.receiverId];

            await queryClient.cancelQueries({
                queryKey,
            });

            const previousMessages = queryClient.getQueryData<Message[]>(queryKey);

            const optimisticMessage: Message = {
                id: crypto.randomUUID(),
                senderId: currentUserId,
                receiverId: variables.receiverId,
                content: variables.content,
                type: "text",
                isRead: false,
                createdAt: new Date().toISOString(),
                status: "sending",
            }

            queryClient.setQueryData<Message[]>(
                queryKey,
                (oldMessages = []) => [
                    ...oldMessages,
                    optimisticMessage,
                ]
            );

            return {
                previousMessages,
                optimisticMessageId: optimisticMessage.id,
            };
        },

        onError: (_error, variables, context) => {
            queryClient.setQueryData<Message[]>(
                ["conversation", variables.receiverId],
                context?.previousMessages ?? []
            );
        },

        onSuccess: (message, variables, context) => {
            queryClient.setQueryData<Message[]>(
                ["conversation", variables.receiverId],
                (oldMessages = []) => 
                    oldMessages.map((oldMessage) => 
                        oldMessage.id === context?.optimisticMessageId
                            ? message
                            : oldMessage)
            );

            queryClient.invalidateQueries({
                queryKey: ["conversations"],
            })
        }
    })
}
