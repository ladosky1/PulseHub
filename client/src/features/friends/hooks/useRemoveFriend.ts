import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { removeFriend } from "../services/removeFriend";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useRemoveFriend(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (friendId: string) => removeFriend(friendId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["friends"],
            });

            notifications.show({
                color: "green",
                title: "Friend removed",
                message: "Friend removed successfully",
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