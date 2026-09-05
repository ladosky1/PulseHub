import { 
    useMutation,
    useQueryClient, 
} from "@tanstack/react-query";
import { markNotificationAsRead } from "../services/notificationService";

import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useMarkNotificationAsRead(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: string) => 
            markNotificationAsRead(notificationId),

        onSuccess: (_, notificationId) => {
            queryClient.setQueryData(
                ["notifications"],
                (old: any[] | undefined) => 
                    old?.map((notification) => 
                        notification.id === notificationId
                            ? {
                                ...notification,
                                isRead: true,
                            }
                            : notification
                    )
            )

            queryClient.setQueryData<number>(
                ["notifications", "unread-count"],
                (old = 0) => Math.max(0, old - 1)
            );
        },

        onError: (error)  => {
            notifications.show({
                color: "red",
                title: "Action Failed",
                message: getErrorMessage(error),
            })
        }
    })
}