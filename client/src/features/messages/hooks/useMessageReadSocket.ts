import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "../../../lib/socket";
import { SOCKETS_EVENTS } from "../../../lib/socketEvent";

export function useMessageReadSocket(isAuthenticated: boolean,){
    const queryClient = useQueryClient();

    useEffect(() => {
        if(!isAuthenticated){
            return;
        };

        const handleMessageRead = ({
            friendId,
        } : { friendId: string; }) => {

            queryClient.invalidateQueries({
                queryKey: ["conversation", friendId],
            });

            queryClient.invalidateQueries({
                queryKey: ["conversations"],
            });
        };

        socket.on(
            SOCKETS_EVENTS.MESSAGE_READ,
            handleMessageRead
        );

        return () => {
            socket.off(
                SOCKETS_EVENTS.MESSAGE_READ,
                handleMessageRead
            );
        };
    }, [isAuthenticated, queryClient]);
}