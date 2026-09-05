import { asyncHandler } from "../utils/asyncHandler.js";
import { 
    sendFriendRequestService,
    getFriendRequestService,
    acceptFriendRequestService,
    getFriendsService,
    rejectFriendRequestService,
    removeFriendService,
} from "../services/friend.service.js";

export const sendFriendRequest = asyncHandler(async (req, res) => {
    await sendFriendRequestService(
        req.session.userId!,
        req.body.receiverId
    );

    res.json({
        message: "Friend request sent."
    })
});

export const getFriendRequests = asyncHandler(async (req, res) => {
    const friendRequests = await getFriendRequestService(req.session.userId!);

    res.json({
        friendRequests
    });
});

export const acceptFriendRequest = asyncHandler(async(req, res) => {
    await acceptFriendRequestService(
        req.session.userId!,
        req.body.requestId
    );

    res.json({
        message: "Friend request accepted."
    });
});

export const getFriends = asyncHandler(async(req, res) => {
    const friends = await getFriendsService(req.session.userId!);

    res.json({
        friends
    });
});

export const rejectFriendRequest = asyncHandler(async(req, res) => {
    await rejectFriendRequestService(
        req.session.userId!,
        req.body.requestId
    );

    res.json({
        message: "Friend request rejected."
    })
});


export const removeFriend = asyncHandler(async(req, res) => {

    await removeFriendService(
        req.session.userId!,
        req.params.friendId as string,
    );

    res.json({
        message: "Friend removed."
    });
})