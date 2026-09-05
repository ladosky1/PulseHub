import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "../../../lib/socket";
import { SOCKETS_EVENTS } from "../../../lib/socketEvent";

import type { Message, MessageReceivedPayload } from "../../../types";

interface TypingPayload {
    senderId: string;
}

export function useMessageSocket(
    isAuthenticated: boolean,
){
    const queryClient = useQueryClient();

    useEffect(() => {
        if(!isAuthenticated){
            return;
        }

        const handleMessage = (payload: MessageReceivedPayload) => {
            const message: Message = {
                id: payload.id,
                senderId: payload.sender.id,
                receiverId: payload.receiver,
                content: payload.content,
                type: payload.type,
                isRead: payload.isRead,
                createdAt: payload.createdAt,
            };

            queryClient.setQueryData<Message[]>(
                ["conversation", payload.sender.id],
                (oldMessages = []) => {
                    const exists = oldMessages.some(
                        (oldMessage) => oldMessage.id === message.id
                    );

                    if(exists){
                        return oldMessages;
                    }

                    return [
                        ...oldMessages,
                        message
                    ];
                }
            );

            queryClient.setQueryData<number>(
                ["messages", "unread-count"],
                (oldCount = 0) => oldCount + 1
            );

            queryClient.invalidateQueries({
                queryKey: ["conversations"],
            });
        };

        const handleTypingStart = (payload: TypingPayload) => {
            queryClient.setQueryData(
                ["typing", payload.senderId],
                true
            );
        };

        const handleTypingStop = (payload: TypingPayload) => {
            queryClient.setQueryData(
                ["typing", payload.senderId],
                false
            );
        };

        socket.on(
            SOCKETS_EVENTS.MESSAGE_RECEIVED,
            handleMessage
        );

        socket.on(
            SOCKETS_EVENTS.TYPING_START,
            handleTypingStart
        );

        socket.on(
            SOCKETS_EVENTS.TYPING_STOP,
            handleTypingStop
        );

        return () => {
            socket.off(
                SOCKETS_EVENTS.MESSAGE_RECEIVED,
                handleMessage
            );

            socket.off(
                SOCKETS_EVENTS.TYPING_START,
                handleTypingStart
            );

            socket.off(
                SOCKETS_EVENTS.TYPING_STOP,
                handleTypingStop
            );
        };
    }, [isAuthenticated, queryClient]);
}