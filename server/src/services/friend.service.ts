import mongoose from "mongoose";
import { FriendRequest } from "../model/friendRequest.model.js";
import { User } from "../model/user.model.js";
import { AppError } from "../errors/AppError.js";
import { 
    emitFriendRequestAccepted,
    emitFriendRequestReceived,
    emitFriendRequestRejected,
    emitFriendRemoved, 
} from "../sockets/emitters/friend.emitter.js";
import { createNotificationService } from "./notifications.service.js";
import { createPairKey } from "../utils/createPairKey.js";

export async function sendFriendRequestService(
    senderId: string,
    receiverId: string,
){
    if(senderId === receiverId){
        throw new AppError("You cannot send yourself a friend request", 400);
    }

    const sender = await User.findById(senderId);
    
    if(!sender){
        throw new AppError("Sender not found", 404);
    };

    const receiver = await User.findById(receiverId);

    if(!receiver){
        throw new AppError("Receiver not found", 404);
    }

    const areFriends = sender.friends.some(
        friend => friend.toString() === receiverId
    )

    if(areFriends){
        throw new AppError(`You are already friends with ${receiver.username}`, 400);
    };

    const pairKey = createPairKey(
        senderId,
        receiverId
    );

    const existingRequest = await FriendRequest.findOne({
        pairKey,
    });

    if(existingRequest){
        if(existingRequest. status === "pending"){
            throw new AppError(
                "A friend request already exists",
                400
            )
        };

        if(existingRequest.status === "accepted"){
            throw new AppError(
                `You are already friends with ${receiver.username}`,
                400
            )
        };

        existingRequest.sender = new mongoose.Types.ObjectId(senderId);

        existingRequest.receiver = new mongoose.Types.ObjectId(receiverId);

        existingRequest.status = "pending";

        await existingRequest.save();

        emitFriendRequestReceived(receiverId, {
            requestId: existingRequest.id,
            sender: {
                id: sender.id,
                username: sender.username,
                avatar: sender.avatar
            }
        });

        await createNotificationService(
            receiverId,
            {
                id: sender.id,
                username: sender.username,
                avatar: sender.avatar,
            },
            "friend:request-received",
            existingRequest.id,
        );

        return existingRequest;
    }

    const friendRequest = await FriendRequest.create({
        sender: senderId,
        receiver: receiverId,
        pairKey,
        status: "pending"
    });

    emitFriendRequestReceived(receiverId, {
        requestId: friendRequest.id,
        sender: {
            id: sender.id,
            username: sender.username,
            avatar: sender.avatar
        }
    });

    await createNotificationService(
        receiverId,
        {
            id: sender.id,
            username: sender.username,
            avatar: sender.avatar,
        },
        "friend:request-received",
        friendRequest.id,
    );

    return friendRequest;
}

export async function getFriendRequestService(userId: string){
    return FriendRequest.find({
        receiver: userId,
        status: "pending",
    })
    .populate("sender", "username avatar")
    .sort({ createdAt: -1 });
};

export async function acceptFriendRequestService(
    receiverId: string,
    requestId: string,
){
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const friendRequest = await FriendRequest
            .findById(requestId).session(session);

        if(!friendRequest){
            throw new AppError("Friend Request not found", 404);
        };

        if(friendRequest.status !== "pending"){
            throw new AppError("This friend request is not pending", 400)
        };

        if(friendRequest.receiver.toString() !== receiverId){
            throw new AppError("Unauthorized", 403);
        };

        const sender = await User.findById(friendRequest.sender).session(session);

        const receiver = await User.findById(receiverId).session(session);

        if(!sender || !receiver){
            throw new AppError("User not found", 404);
        }

        await User.updateOne(
            { _id: sender._id },
            { $addToSet: {friends: receiver._id} },
            { session }
        );

        await User.updateOne(
            { _id: receiver._id },
            { $addToSet: { friends: sender._id } },
            { session }
        );

        friendRequest.status = "accepted";

        await friendRequest.save({ session });

        await session.commitTransaction();

        emitFriendRequestAccepted(sender.id, {
            friend: {
                id: receiver.id,
                username: receiver.username,
                avatar: receiver.avatar,    
            }
        });

        await createNotificationService(
            sender.id,
            {
                id: receiver.id,
                username: receiver.username,
                avatar: receiver.avatar
            },
            "friend:request-accepted",
            friendRequest.id,
        )

        return friendRequest;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

export async function getFriendsService(userId: string){
    const user = await User
        .findById(userId)
        .populate("friends", "username avatar");

    if(!user){
        throw new AppError("User not found", 404);
    }

    return user.friends;
};

export async function rejectFriendRequestService(
    receiverId: string,
    requestId: string,
){
    const friendRequest = await FriendRequest.findById(requestId);

    if(!friendRequest){
        throw new AppError("Friend Request not found", 404);
    }

    if(friendRequest.receiver.toString() !== receiverId){
        throw new AppError("Unauthorized", 403);
    };

    if(friendRequest.status !== "pending"){
        throw new AppError("You are already friends with this user", 400);
    }

    const receiver = await User.findById(receiverId);

    if(!receiver){
        throw new AppError("User not found", 404);
    }

    friendRequest.status = "rejected";

    await friendRequest.save();

    emitFriendRequestRejected(
        friendRequest.sender.toString(),
        {
            requestId: friendRequest.id,
        }
    );

    await createNotificationService(
        friendRequest.sender.toString(),
        {
            id: receiver.id,
            username: receiver.username,
            avatar: receiver.avatar
        },
        "friend:request-rejected",
        friendRequest.id,
    );

    return friendRequest;
};

export async function removeFriendService(
    userId: string,
    friendId: string,
){
    const user = await User.findById(userId);

    if(!user){
        throw new AppError("User not found", 404);
    };

    const friend = await User.findById(friendId);

    if(!friend){
        throw new AppError(
            "Friend not found",
            404
        );
    }

    const areFriends = user.friends.some(
        friend => friend.toString() === friendId
    );

    if(!areFriends){
        throw new AppError(
            "You are not friends with this user",
            400
        );
    };

    await User.updateOne(
        { _id: userId },
        { 
            $pull: { 
                friends: friendId 
            }, 
        },
    );

    await User.updateOne(
        { _id: friendId },
        {
            $pull: {
                friends: userId
            },
        }
    );

    const pairKey = createPairKey(
        userId,
        friendId
    )

    await FriendRequest.updateOne(
        {
            pairKey,
            status: "accepted",
        },
        {
            $set: {
                status: "rejected",
            }
        }
    )

    emitFriendRemoved(userId, {
        friendId,
    });

    emitFriendRemoved(friendId, {
        friendId: userId,
    });

    await createNotificationService(
        friendId,
        {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
        },
        "friend:removed",
        user.id
    );

    await createNotificationService(
        userId,
        {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
        },
        "friend:removed",
        friend.id
    );
}