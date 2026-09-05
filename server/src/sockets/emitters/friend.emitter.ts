import { getIO } from "../index.js";
import { SOCKETS_EVENTS } from "../events.js";
import { getUserRoom } from "../userRoom.js";

type FriendPayload = {
    id: string;
    username: string;
    avatar?: string | null;
}
type FriendRequestReceivedPayload = {
    requestId: string;
    sender: FriendPayload;
}

type FriendRequestAcceptedPayload = {
    friend: FriendPayload;
};

type FriendRequestRejectedPayload = {
    requestId: string;
}

type FriendRemovedPayload = {
    friendId: string;
}

export function emitFriendRequestReceived(
    receiverId: string,
    payload: FriendRequestReceivedPayload,
){
    getIO().to(getUserRoom(receiverId)).emit(
        SOCKETS_EVENTS.FRIEND_REQUEST_RECEIVED,
        payload
    )
};

export function emitFriendRequestAccepted(
    senderId: string,
    payload: FriendRequestAcceptedPayload,
){
    getIO().to(getUserRoom(senderId)).emit(
        SOCKETS_EVENTS.FRIEND_REQUEST_ACCEPTED,
        payload
    )
};

export function emitFriendRequestRejected(
    senderId: string,
    payload: FriendRequestRejectedPayload,
){
    getIO().to(getUserRoom(senderId)).emit(
        SOCKETS_EVENTS.FRIEND_REQUEST_REJECTED,
        payload
    )
};

export function emitFriendRemoved(
    userId: string,
    payload: FriendRemovedPayload,
){
    getIO().to(getUserRoom(userId)).emit(
        SOCKETS_EVENTS.FRIEND_REMOVED,
        payload
    )
};

