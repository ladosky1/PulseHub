import { asyncHandler } from "../utils/asyncHandler.js";
import { 
    createCommunityService,
    joinCommunityService,
    leaveCommunityService,
    getCommunitiesService,
    getCommunityService, 
    getCommunityMembersService,
    deleteCommunityService
} from "../services/community.service.js";
import { CommunityCategory } from "../constants/community.js";

export const createCommunity = asyncHandler(async(req, res) => {
    const community = await createCommunityService(
        req.session.userId!,
        req.body
    );

    res.status(201).json({
        message: "community created successfully",
        community,
    });
});

export const joinCommunity = asyncHandler(async(req, res) => {
    const community = await joinCommunityService(
        req.session.userId!,
        req.params.communityId as string
    );

    res.json({
        message: "Joined community successfully",
        community,
    });
});

export const leaveCommunity = asyncHandler(async(req, res) => {
    await leaveCommunityService(
        req.session.userId!,
        req.params.communityId as string
    );

    res.json({
        message: "Left community bsuccessfully"
    });
});

export const getCommunities = asyncHandler(async(req, res) => {
    const communities = await getCommunitiesService({
        category: req.query.category as CommunityCategory | undefined,
        search: req.query.search as string | undefined,
    }, req.session.userId
    );

    res.json({
        communities,
    });
});

export const getCommunity = asyncHandler(async(req, res) => {
    const community = await getCommunityService(
        req.params.communityId as string,
        req.session.userId
    );

    res.json({community});
});

export const getCommunityMembers = asyncHandler(async(req, res) => {
    const members = await getCommunityMembersService(
        req.params.communityId as string,
        req.session.userId!
    );

    res.json({
        members,
    });
});

export const deleteCommunity = asyncHandler(async(req, res) => {
    const result = await deleteCommunityService(
        req.params.communityId as string,
        req.session.userId!
    );

    res.json({
        message: "Community deleted Successfully",
        communityId: result.communityId,
    })
})

