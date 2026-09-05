import { Badge } from "@mantine/core";
import { useNotifications } from "../hook/useNotification";

export function NotificationBadge(){
    const {
        data: notifications = [],
    } = useNotifications();

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    if(unreadCount === 0){
        return;
    }

    return(
        <Badge
            size="sm"
            circle>
            {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
    )
}