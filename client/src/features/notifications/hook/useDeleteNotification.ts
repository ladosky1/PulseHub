import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification } from "../services/notificationService";
import type { Notification } from "../../../types";

export function useDeleteNotification(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: string) =>
            deleteNotification(notificationId),

        onSuccess: (_, notificationId) => {
            const notifications = queryClient.getQueryData<Notification[]>(
                ["notifications"]
            );

            const deleteNotification = notifications?.find(
                (notification) => notification.id !== notificationId
            )

            queryClient.setQueryData<Notification[]>(
                ["notifications"],
                (oldNotifications = []) => 
                    oldNotifications.filter(
                        (notification) => notification.id !== notificationId
                    )
            )

            if(deleteNotification?.isRead === false){
                queryClient.setQueryData<number>(
                    ["notifications", "unread-count"],
                    (oldCount = 0) => 
                        Math.max(0, oldCount - 1)
                );
            }
        }        
    })
}