import { useEffect } from "react";
import { socket } from "../../../lib/socket";
import { SOCKETS_EVENTS } from "../../../lib/socketEvent";
import type { 
    CommunityMessage,
    CommunitySocketMessagePayload,
} from "../../../types/communityMessage";
import { useQueryClient } from "@tanstack/react-query";

export function useCommunitySocket(
    communityId: string,
    isJoined: boolean
){
    const queryClient = useQueryClient();

    useEffect(() => {
        if(!isJoined){
            return;
        }

        const handleConnect = () => {
            socket.emit(
                SOCKETS_EVENTS.COMMUNITY_JOIN,
                {communityId}
            );
        };

        const handleMessage = (message: CommunitySocketMessagePayload) => {
            queryClient.setQueryData<CommunityMessage[]>(
                ["community-messages", communityId],
                (oldMessages = []) => {
                    const exists = oldMessages.some(
                        (oldMessage) => 
                            oldMessage._id === message.id
                    );

                    if(exists){
                        return oldMessages;
                    }

                    return [
                        ...oldMessages,
                        {
                            _id: message.id,
                            sender: {
                                _id: message.sender.id,
                                username: message.sender.username,
                                avatar: message.sender.avatar,
                            },
                            community: message.community,
                            content: message.content,
                            createdAt: message.createdAt.toString(),
                        },
                    ];
                }
            )
        }

        socket.on("connect", handleConnect);
        
        socket.on(
            SOCKETS_EVENTS.COMMUNITY_MESSAGE_RECEIVED,
            handleMessage
        );

        if(!socket.connected){
            socket.connect();
        } else {
            handleConnect();
        }

        return () => {
            socket.off("connect", handleConnect);
            
            socket.off(
                SOCKETS_EVENTS.COMMUNITY_MESSAGE_RECEIVED,
                handleMessage
            );
            
            socket.emit(
                SOCKETS_EVENTS.COMMUNITY_LEAVE,
                { communityId }
            );
        };
    }, [communityId, isJoined, queryClient]);
}