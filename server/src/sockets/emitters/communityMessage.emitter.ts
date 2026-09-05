import { getIO } from "../index.js";
import { SOCKETS_EVENTS } from "../events.js";
import { getCommunityRoom } from "../communityRooms.js";
import { CommunityMessagePayload } from "../../types/socket.types.js";


export function emitCommunityMessage(
    communityId: string,
    payload: CommunityMessagePayload
){
    getIO()
        .to(getCommunityRoom(communityId))
        .emit(
            SOCKETS_EVENTS.COMMUNITY_MESSAGE_RECEIVED,
            payload
        );
};