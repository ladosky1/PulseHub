import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "../../../lib/socket";
import { SOCKETS_EVENTS } from "../../../lib/socketEvent";

interface OnlineUsersPayload {
    userIds: string[];
}

interface PresencePayload {
    userId: string;
    username: string;
}

export function usePresenceSocket(
    isAuthenticated: boolean
) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const handleInitialPresence = (
            payload: OnlineUsersPayload
        ) => {
            queryClient.setQueryData<string[]>(
                ["presence", "online-users"],
                payload.userIds
            );
        };

        const handleOnline = (
            payload: PresencePayload
        ) => {
            queryClient.setQueryData<string[]>(
                ["presence", "online-users"],
                (oldUsers = []) => {
                    if (oldUsers.includes(payload.userId)) {
                        return oldUsers;
                    }

                    return [...oldUsers, payload.userId];
                }
            );
        };

        const handleOffline = (
            payload: PresencePayload
        ) => {
            queryClient.setQueryData<string[]>(
                ["presence", "online-users"],
                (oldUsers = []) =>
                    oldUsers.filter(
                        (userId) => userId !== payload.userId
                    )
            );
        };

        socket.on(
            SOCKETS_EVENTS.USER_ONLINE_USERS,
            handleInitialPresence
        );

        socket.on(
            SOCKETS_EVENTS.USER_ONLINE,
            handleOnline
        );

        socket.on(
            SOCKETS_EVENTS.USER_OFFLINE,
            handleOffline
        );

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.off(
                SOCKETS_EVENTS.USER_ONLINE_USERS,
                handleInitialPresence
            );

            socket.off(
                SOCKETS_EVENTS.USER_ONLINE,
                handleOnline
            );

            socket.off(
                SOCKETS_EVENTS.USER_OFFLINE,
                handleOffline
            );
        };
    }, [isAuthenticated, queryClient]);
}