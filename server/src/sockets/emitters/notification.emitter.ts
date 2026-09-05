import { getIO } from "../index.js";
import { SOCKETS_EVENTS } from "../events.js";
import { getUserRoom } from "../userRoom.js";
import { NotificationPayload } from "../../types/socket.types.js";

export function emitNotification(
    recipientId: string,
    payload: NotificationPayload,
){
    getIO()
        .to(getUserRoom(recipientId))
        .emit(
            SOCKETS_EVENTS.NOTIFICATION_RECEIVED,
            payload
        )
}