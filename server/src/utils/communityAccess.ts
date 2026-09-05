import { AppError } from "../errors/AppError.js";
import { Community } from "../model/community.model.js";

export async function getCommunityForMember(
    communityId: string,
    userId: string
){
    const community = await Community.findById(communityId);

    if(!community){
        throw new AppError(
            "community not found",
            404
        );
    };

    const isMember = community.members.some(
        member => member.toString() === userId
    );

    if(!isMember){
        throw new AppError(
            "You are not a member of this community",
            401
        )
    }
}