import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { sendFriendRequest } from "../services/sendFriendRequest";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useSendFriendRequest(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            receiverId,
        }: {
            receiverId: string
        }) => sendFriendRequest(receiverId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["user-profile", variables.receiverId]
            });
            
            queryClient.invalidateQueries({
                queryKey: ["friend-requests"],
            });

            notifications.show({
                color: "green",
                title: "Friend Request Sent",
                message: "Your friend request Was sent successfully",
            });
        },

        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Action Failed",
                message: getErrorMessage(error),
            });
        }
    })
}