import { CommunityCategory } from "../constants/community.js";
import { AppError } from "../errors/AppError.js";
import { Community } from "../model/community.model.js";
import { User } from "../model/user.model.js";
import { Types } from "mongoose";
import { CommunityMessage } from "../model/communityMessage.model.js";
import mongoose from "mongoose";

export async function createCommunityService(
    adminId: string,
    data: {
        name: string;
        description: string;
        avatar?: string;
        category: CommunityCategory;
    }
){
    const admin = await User.findById(adminId);

    if(!admin){
        throw new AppError("Admin not found", 404)
    };

    const existingCommunity = await Community.findOne({
        name: data.name
    });

    if(existingCommunity){
        throw new AppError("Community name already exists", 400);
    }

    const community = await Community.create({
        name: data.name,
        description: data.description,
        avatar: data.avatar,
        category: data.category,

        admin: adminId,

        moderators: [],

        members: [adminId],
    });

    return community;
};

export async function joinCommunityService(
    userId: string,
    communityId: string
){
    const community = await Community.findById(communityId);

    if(!community){
        throw new AppError("community not found", 404);
    };

    const isMember = community.members.some(
        member => member.toString() === userId
    );

    if(isMember){
        throw new AppError(
            "You are already a member of this community",
            400
        )
    };

    await Community.updateOne(
        { _id: communityId },
        {
            $addToSet: {
                members: userId
            }
        }
    );

    return await Community.findById(communityId);
};

export async function leaveCommunityService(
    userId: string,
    communityId: string
){
    const community = await Community.findById(communityId);

    if(!community){
        throw new AppError("Community not found", 404);
    };

    const isMember = community.members.some(
        member => member.toString() === userId
    );

    if(!isMember){
        throw new AppError(
            "You are not a member of this community",
            400
        )
    }

    if(community.admin.toString() === userId){
        throw new AppError(
            "Admin cannot leave the community",
            400
        );
    };

    await Community.updateOne(
        { _id: communityId },
        {
            $pull: {
                members: userId,
                moderators: userId,
            }
        }
    );

    return;
};

export async function getCommunitiesService(
    query: {
        category?: CommunityCategory;
        search?: string;
    },
    userId?: string
){
    const filter: Record<string, unknown> ={};

    if(query.category){
        filter.category = query.category;
    };

    if(query.search){
        filter.$or = [
            {
                name: {
                    $regex: query.search,
                    $options: "i",
                }
            },
            {
                description: {
                    $regex: query.search,
                    $options: "i"
                }
            }
        ];
    }

    return Community.aggregate([
        {
            $match: filter,
        },
        {
            $lookup: {
                from: "users",
                localField: "admin",
                foreignField: "_id",
                as: "admin",
            },
        },
        {
            $unwind: "$admin",
        },
        {
            $addFields: {
                isJoined: userId
                    ? { $in: [
                        { $toObjectId: userId}, 
                        "$members"
                    ] }
                    : false,
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                category: 1,
                avatar: 1,
                admin: {
                    _id: "$admin._id",
                    username: "$admin.username",
                    avatar: "$admin.avatar",
                },
                memberCount: {
                    $size: "$members",
                },

                isJoined: 1,
                
                createdAt: 1,
            },
        },
        {
            $sort: {
                createdAt: -1,
            }
        }
    ])
};

export async function getCommunityService(
    communityId: string,
    userId?: string
){
    const community = await Community.findById(communityId)
        .populate("admin", "username avatar")
        .populate("moderators", "username avatar")
        .populate("members", "username avatar");

    if(!community){
        throw new AppError(
            "community not found",
            404
        );
    };

    const isMember = userId
        ? community.members.some(
        member => member._id.toString() === userId
    ) : false;

    return {
        id: community.id,
        name: community.name,
        description: community.description,
        avatar: community.avatar,
        category: community.category,
        admin: community.admin,
        moderators: community.moderators,
        memberCount: community.members.length,
        createdAt: community.createdAt,
        isMember,
    };
}

export async function getCommunityMembersService(
    communityId: string,
    userId: string, 
){
    const community = await getCommunityService(
        communityId,
        userId,
    );

    if(!community.isMember){
        throw new AppError(
            "You must be a member of this community",
            403
        );
    }

    const populatedCommunity = await Community.findById(communityId)
        .populate<{
            members: {
                _id: Types.ObjectId;
                username: string;
                avatar: string | null;
            }[];
        }>("members", "username avatar");

    if(!populatedCommunity){
        throw new AppError(
            "Community not found",
            404
        );
    }

    return populatedCommunity.members.map((member) => ({
        id: member._id.toString(),
        username: member.username,
        avatar: member.avatar,
    }));
}

export async function deleteCommunityService(
    communityId: string,
    userId: string,
){
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const community = await Community.findById(
            communityId
        ).session(session);

        if(!community){
            throw new AppError(
                "Community not found",
                404
            );
        };

        if(community.admin.toString() !== userId){
            throw new AppError(
                "Only the community admin can delete this community",
                403
            );
        }

        await CommunityMessage.deleteMany(
            {
                community: communityId,
            }, {session}
        );

        await Community.deleteOne(
            {
                _id: communityId,
            }, {session}
        );

        await session.commitTransaction();

        return{
            communityId: community.id
        };
    } catch(error){
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}