import { getCommunityForMember } from "../utils/communityAccess.js";
import { CommunityMessage } from "../model/communityMessage.model.js";
import { emitCommunityMessage } from "../sockets/emitters/communityMessage.emitter.js";
import { CommunityMessagePayload, PopulateSender } from "../types/socket.types.js";

export async function sendCommunityMessageService(
    userId: string,
    communityId: string,
    content: string, 
){
    await getCommunityForMember(
        communityId,
        userId
    );
    
    const communityMessage = await CommunityMessage.create({
        sender: userId,
        community: communityId,
        content,
    });

    const populatedMessage = await communityMessage.populate<{
        sender: PopulateSender
    }>(
        "sender",
        "username avatar"
    );

    const payload: CommunityMessagePayload = {
        id: populatedMessage._id.toString(),
        sender: {
            id: populatedMessage.sender._id.toString(),
            username: populatedMessage.sender.username,
            avatar: populatedMessage.sender.avatar,
        },
        community: populatedMessage.community.toString(),
        content: populatedMessage.content,
        createdAt: populatedMessage.createdAt,
    };

    emitCommunityMessage(
        communityId,
        payload
    );

    return populatedMessage;
};

export async function getCommunityMessageService(
    userId: string,
    communityId: string
){
    await getCommunityForMember(
        communityId,
        userId
    );

    return CommunityMessage.find({
        community: communityId,
    })
    .populate("sender", "username avatar")
    .sort({ createdAt: 1 });
};