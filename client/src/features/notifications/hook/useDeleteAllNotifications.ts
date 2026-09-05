import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAllNotifications } from "../services/notificationService";

export function useDeleteAllNotifications(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAllNotifications,

        onSuccess: () => {
            queryClient.setQueryData(
                ["notifications"],
                []
            );

            queryClient.setQueryData(
                ["notifications", "unread-count"],
                0
            );
        }
    })
};