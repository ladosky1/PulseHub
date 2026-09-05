import { getIO } from "../index.js";
import { SOCKETS_EVENTS } from "../events.js";
import { getUserRoom } from "../userRoom.js";
import { MessageReceivedPayload } from "../../types/socket.types.js";

type MessageReadPayload = {
    friendId: string;
};

type TypingPayload = {
    senderId: string;
}

export function emitMessageReceived(
    receiverId: string,
    payload: MessageReceivedPayload
){
    getIO().to(getUserRoom(receiverId)).emit(
        SOCKETS_EVENTS.MESSAGE_RECEIVED,
        payload
    )
};

export function emitMessageRead(
    userId: string,
    payload: MessageReadPayload
){
    getIO().to(getUserRoom(userId)).emit(
        SOCKETS_EVENTS.MESSAGE_READ,
        payload
    );
};

export function emitTypingStart(
    receiverId: string,
    payload: TypingPayload
){
    getIO().to(getUserRoom(receiverId)).emit(
        SOCKETS_EVENTS.TYPING_START,
        payload,
    );
};

export function emitTypingStop(
    receiverId: string,
    payload: TypingPayload
){
    getIO().to(getUserRoom(receiverId)).emit(
        SOCKETS_EVENTS.TYPING_STOP,
        payload,
    );
}