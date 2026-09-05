import { Socket } from "socket.io";
import { SOCKETS_EVENTS } from "../events.js";
import { getUserRoom } from "../userRoom.js";
import { 
    addOnlineUser,
    isUserOnline,
    removeOnlineUser,
    getOnlineUsers, 
} from "../onlineUsers.js";
import { 
    emitTypingStart, 
    emitTypingStop 
} from "../emitters/message.emitter.js";
import { 
    joinCommunityHandler, 
    leaveCommunityHandler 
} from "./community.handler.js";

export function handleConnection(
    socket: Socket
){
    const user = socket.data.user;

    socket.join(getUserRoom(user.id));

    const becameOnline = addOnlineUser(user.id, socket.id);

    socket.emit(
        SOCKETS_EVENTS.USER_ONLINE_USERS,
        {
            userIds: getOnlineUsers(),
        }
    );

    if(becameOnline){
        socket.broadcast.emit(
            SOCKETS_EVENTS.USER_ONLINE,
            {
                userId: user.id,
                username: user.username,
            }
        );
    }

    socket.on(
        SOCKETS_EVENTS.TYPING_START, 
        ({ receiverId }) => {
            emitTypingStart(receiverId, {
                senderId: user.id,
        });
    });

    socket.on(
        SOCKETS_EVENTS.TYPING_STOP, 
        ({ receiverId }) => {
            emitTypingStop(receiverId, {
                senderId: user.id,
        });
    });

    socket.on(
        SOCKETS_EVENTS.COMMUNITY_JOIN,
        payload => 
            joinCommunityHandler(
                payload,
                socket
            )
    );

    socket.on(
        SOCKETS_EVENTS.COMMUNITY_LEAVE,
        payload => 
            leaveCommunityHandler(
                payload,
                socket
            )
    );

    socket.on("disconnect", () => {
        removeOnlineUser(user.id, socket.id);

        if(!isUserOnline(user.id)){
            socket.broadcast.emit(
                SOCKETS_EVENTS.USER_OFFLINE,
                {
                    userId: user.id,
                    username: user.username,
                }
            );
        }
    });
};