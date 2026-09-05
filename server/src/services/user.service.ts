import { AppError } from "../errors/AppError.js";
import { User } from "../model/user.model.js";
import { createPairKey } from "../utils/createPairKey.js";
import { FriendRequest } from "../model/friendRequest.model.js";

type UserRelationship = 
    | "self"
    | "friends"
    | "request_sent"
    | "request_received"
    | "none";

export async function getUserProfileService(
    profileUserId: string,
    viewerId: string,
){
    const user = await User.findById(profileUserId)
        .select("username avatar createdAt friends");

    if(!user){
        throw new AppError(
            "User not found",
            404
        );
    }

    let relationship: UserRelationship = "none";

    if(profileUserId === viewerId){
        relationship = "self";
    } else {
        const areFriends = user.friends.some(
            friend => friend.toString() === viewerId
        );

        if(areFriends){
            relationship = "friends";
        } else {
            const pairKey = createPairKey(
                viewerId,
                profileUserId
            );

            const friendRequest = await FriendRequest.findOne({
                pairKey,
                status: "pending",
            });

            if(friendRequest){
                relationship = 
                    friendRequest.sender.toString() === viewerId
                        ? "request_sent"
                        : "request_received"
            }
        }
    }

    return {
        id: user._id.toString(),
        username: user.username,
        avatar: user.avatar,
        friendCount: user.friends.length,
        createdAt: user.createdAt,
        relationship,
    };
};

export async function searchUsersService(
    username: string,
){
    return User.find({
        username: {
            $regex: username,
            $options: "i",
        },
    })
    .select("username avatar")
    .sort({ username: 1 })
    .limit(20);
}