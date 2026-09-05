import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "../../../lib/socket";
import { SOCKETS_EVENTS } from "../../../lib/socketEvent";

import type { Notification } from "../../../types";

export function useNotificationSocket(
    isAuthenticated: boolean
){
    const queryClient = useQueryClient();

    useEffect(() => {
        if(!isAuthenticated){
            return;
        }

        const handleNotification = (notification: Notification) => {
            
            queryClient.setQueryData<Notification[]>(
                ["notifications"],
                (oldNotifications = []) => {
                    const exists = oldNotifications.some(
                        (oldNotification) => 
                            oldNotification.id ===
                        notification.id
                    );

                    if(exists){
                        return oldNotifications;
                    };

                    return [
                        notification,
                        ...oldNotifications,
                    ];
                }
            );

            queryClient.setQueryData<number>(
                ["notifications", "unread-count"],
                (oldCount = 0) => oldCount + 1
            );

            if(notification.type === "friend:request-received"){
                queryClient.invalidateQueries({
                    queryKey: ["friend-requests"]
                })
            }
        };

        socket.on(
            SOCKETS_EVENTS.NOTIFICATION_RECEIVED,
            handleNotification
        );

        return () => {
            socket.off(
                SOCKETS_EVENTS.NOTIFICATION_RECEIVED,
                handleNotification
            );
        };
    }, [isAuthenticated, queryClient]);
}