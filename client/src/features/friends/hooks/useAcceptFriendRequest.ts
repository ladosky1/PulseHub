import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { acceptFriendRequest } from "../services/acceptFriendRequest";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useAcceptFriendRequest(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: acceptFriendRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["friend-requests"],
            });

            queryClient.invalidateQueries({
                queryKey: ["friends"],
            });

            queryClient.invalidateQueries({
                queryKey: ["user-profile"]
            })

            notifications.show({
                color: "green",
                title: "Friend Request Accepted",
                message: "You are now friends.",
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