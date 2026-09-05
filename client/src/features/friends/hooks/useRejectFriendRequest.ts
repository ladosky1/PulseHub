import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { rejectFriendRequest } from "../services/rejectFriendRequest";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useRejectFriendRequest(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectFriendRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["friend-requests"],
            });

            queryClient.invalidateQueries({
                queryKey: ["user-profile"],
            })

            notifications.show({
                color: "green",
                title: "Request Rejected",
                message: "Friend request rejected",
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