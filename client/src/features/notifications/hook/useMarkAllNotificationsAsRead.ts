import { 
    useMutation,
    useQueryClient, 
} from "@tanstack/react-query";
import { markAllNotificationAsRead } from "../services/notificationService";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import type { Notification } from "../../../types";

export function useMarkAllNotificationsAsRead(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllNotificationAsRead,

        onSuccess: () => {
            queryClient.setQueryData<Notification[]>(
                ["notifications"],
                (old: any[] | undefined) => 
                    old?.map((notification) => ({
                        ...notification,
                        isRead: true,
                    }))
            );

            queryClient.invalidateQueries({
                queryKey: ["notifications", "unread-count"],
            });
        },

        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Action Failed",
                message: getErrorMessage(error),
            })
        }
    })
}