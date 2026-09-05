import { useMutation, useQueryClient } from "@tanstack/react-query";;
import { sendCommunityMessage } from "../services/sendCommunityMessageService";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { notifications } from "@mantine/notifications";
import type { CommunityMessage } from "../../../types/communityMessage";

interface SendCommunityMessageVariables{
    communityId: string;
    content: string;
    sender: {
        _id: string;
        username: string;
        avatar?: string | null;
    }
}

export function useSendCommunityMessage(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            communityId,
            content,
        } : SendCommunityMessageVariables) => sendCommunityMessage(
            communityId,
            content,
        ),

        onMutate: async ({
            communityId,
            content,
            sender,
        }) => {
            const queryKey = ["community-messages", communityId] as const;

            await queryClient.cancelQueries({
                queryKey,
            });

            const previousMessages = queryClient.getQueryData<CommunityMessage[]>(
                queryKey
            );

            const optimisticMessage: CommunityMessage = {
                _id: `temp-${crypto.randomUUID()}`,
                sender,
                community: communityId,
                content,
                createdAt: new Date().toISOString(),
                status: "sending"
            }

            queryClient.setQueryData<CommunityMessage[]>(
                queryKey,
                (oldMessages = []) => [
                    ...oldMessages,
                    optimisticMessage,
                ]
            );

            return {
                previousMessages,
                optimisticMessageId: optimisticMessage._id,
                queryKey,
            }
        },

        onSuccess: (serverMessage, _, context) => {
            if(!context){
                return;
            }

            queryClient.setQueryData<CommunityMessage[]>(
                context.queryKey,
                (messages = []) => {
                    const withoutOptimistic = messages.filter(
                        (message) => message._id !== context.optimisticMessageId
                    );

                    const alreadyReceivedFromSocket = 
                        withoutOptimistic.some(
                            (message) => message._id === serverMessage._id
                        );
                    
                    if(alreadyReceivedFromSocket){
                        return withoutOptimistic;
                    }

                    return [
                        ...withoutOptimistic,
                        {
                            ...serverMessage,
                            status: "sent",
                        }
                    ]
                }
            )
        },

        onError: (error, _, context) => {
            if(context){
                queryClient.setQueryData(
                    context.queryKey,
                    context.previousMessages
                );
            }
            
            notifications.show({
                color: "red",
                title: "Message Failed",
                message: getErrorMessage(error),
            })
        }
    })
}