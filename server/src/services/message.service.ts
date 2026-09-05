import { AppError } from "../errors/AppError.js";
import { User } from "../model/user.model.js";
import { Message } from "../model/message.model.js";
import { 
    emitMessageRead, 
    emitMessageReceived, 
} from "../sockets/emitters/message.emitter.js";
import { resourceLimits } from "node:worker_threads";

export async function sendMessageService(
    senderId: string,
    receiverId: string,
    content: string,
){
    if(senderId === receiverId){
        throw new AppError("You cannot message yourself", 400);
    };

    const sender = await User.findById(senderId);

    if(!sender){
        throw new AppError("Sender does not exist", 404);
    };

    const receiver = await User.findById(receiverId);

    if(!receiver){
        throw new AppError("Receiver does not exist", 404);
    };

    const areFriends = sender.friends.some(
        friend => friend.toString() === receiverId
    );

    if(!areFriends){
        throw new AppError("You can only message your friends", 403);
    };

    const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
    });

    emitMessageReceived(receiverId, {
        id: message.id,
        sender: {
            id: sender.id,
            username: sender.username,
            avatar: sender.avatar,
        },
        receiver: receiverId,
        content: message.content,
        type: message.type,
        isRead: message.isRead,
        createdAt: message.createdAt
    });

    return message;
};

export async function getConversationService(
    userId: string,
    friendId: string,
){
    const user = await User.findById(userId);

    if(!user){
        throw new AppError("User not found.", 404);
    };

    const areFriends = user.friends.some(
        friend => friend.toString() === friendId
    );

    if(!areFriends){
        throw new AppError(
            "You can only view conversations with your friends",
            403
        );
    }

    return Message.find({
        $or: [
            {
                sender: userId,
                receiver: friendId,
            },
            {
                sender: friendId,
                receiver: userId,
            },
        ]
    }).sort({ createdAt: 1 });
};

export async function markMessageAsReadService(
    userId: string,
    friendId: string,
){
    const result = await Message.updateMany(
        {
            sender: friendId,
            receiver: userId,
            isRead: false,
        },
        {
            $set: {
                isRead: true,
            }
        }
    );

    if(result.modifiedCount > 0){
        emitMessageRead(friendId, {
            friendId: userId,
        });
    }
};

export async function getUnreadMessageService(
    userId: string
){
    return Message.countDocuments({
        receiver: userId,
        isRead: false,
    });
};

export async function getConversationListService(
    userId: string
){
    const user = await User.findById(userId);

    if(!user){
        throw new AppError("user not found", 404)
    };
    
    return await Message.aggregate([
        {
            $match: {
                $or: [
                    { sender: user._id },
                    { receiver: user._id },
                ]
            },
        },
        {
            $addFields: {
                friend: {
                    $cond: [
                        { $eq: ["$sender", user._id] },
                        "$receiver",
                        "$sender"
                    ],
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $group: {
                _id: "$friend",

                lastMessage: {
                    $first: "$$ROOT",
                },

                unreadCount: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    {
                                        $eq: ["$receiver", user._id],
                                    },
                                    {
                                        $eq: ["$isRead", false],
                                    }
                                ]
                            },
                            1,
                            0,
                        ]
                    }
                }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "friend"
            }
        },
        {
            $unwind: "$friend",
        },
        {
            $project: {
                _id: 0,
                friend: {
                    _id: "$friend._id",
                    username: "$friend.username",
                    avatar: "$friend.avatar",
                },

                lastMessage: "$lastMessage.content",
                lastMessageAt: "$lastMessage.createdAt",
                unreadCount: 1,
            }
        },
        {
            $sort: {
                lastMessageAt: -1, 
            }
        }
    ])
};

/*Will come back to this in V2*/

/*export async function deleteConversationService(
    userId: string,
    friendId: string,
){
    const user = await User.findById(userId);

    if(!user){
        throw new AppError(
            "User not found",
            404
        );
    };

    const areFriends = user.friends.some(
        friend => friend.toString() === friendId
    )

    if(!areFriends){
        throw new AppError(
            "You can only delete conversations with your friends",
            403
        );
    }
    
    return Message.deleteMany({
        $or: [
            {
                sender: userId,
                receiver: friendId,
            },
            {
                sender: friendId,
                receiver: userId,
            }
        ]
    })
};*/

export async function deleteMessageService(
    userId: string,
    messageId: string,
){
    const message = await Message.findById(messageId);

    if(!message){
        throw new AppError("Message not find", 404);
    };

    if(message.sender.toString() !== userId){
        throw new AppError(
            "You can only delete your own messages",
            403
        );
    };

    await message.deleteOne();

    return {
        messageId: message.id,
    };
}