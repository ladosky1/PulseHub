import { Socket } from "socket.io";
import { Community } from "../../model/community.model.js";
import { getCommunityRoom } from "../communityRooms.js";

type CommunityPayload = {
    communityId: string;
};

export async function joinCommunityHandler(
    { communityId } : CommunityPayload,
    socket: Socket
){
    const community = await Community.findById(communityId);

    if(!community){
        return;
    };

    const isMember = community.members.some(
        member => member.toString() === socket.data.user.id
    );

    if(!isMember){
        return;
    }

    socket.join(getCommunityRoom(communityId));

}

export async function leaveCommunityHandler(
    { communityId } : CommunityPayload,
    socket: Socket
){
    socket.leave(getCommunityRoom(communityId));
}