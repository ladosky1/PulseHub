import { asyncHandler } from "../utils/asyncHandler.js";
import { 
    sendMessageService,
    getConversationService,
    markMessageAsReadService,
    getUnreadMessageService,
    getConversationListService,
    //deleteConversationService,
    deleteMessageService, 
} from "../services/message.service.js";

export const sendMessage = asyncHandler(async (req, res) => {
    const message = await sendMessageService(
        req.session.userId!,
        req.body.receiverId,
        req.body.content
    );

    res.json({
        message: "message sent",
        data: message,
    })
});

export const getConversation = asyncHandler(async (req, res) => {
    const conversation = await getConversationService(
        req.session.userId!,
        req.params.friendId as string
    );

    res.json({
        conversation,
    })
});

export const markMessageAsRead = asyncHandler(async(req,res) => {
    await markMessageAsReadService(
        req.session.userId!,
        req.params.friendId as string
    );

    res.json({
        message: "Messages marked as read"
    });
});

export const getUnreadMessageCount = asyncHandler(async(req, res) => {
    const count = await getUnreadMessageService(
        req.session.userId!
    );

    res.json({
        unreadCount: count,
    });
});

export const getConversationList = asyncHandler(async(req,res) => {
    const conversations = await getConversationListService(
        req.session.userId!,
    );

    res.json({
        conversations,
    })
});

/*export const deleteConversation = asyncHandler(async(req,res) => {
    await deleteConversationService(
        req.session.userId!,
        req.params.friendId as string
    );

    res.json({
        message: "conversation deleted successfully"
    });
});*/

export const deleteMessage = asyncHandler(async(req, res) => {
    const result = await deleteMessageService(
        req.session.userId!,
        req.params.messageId as string,
    );

    res.json({
        message: "Message deleted successfully",
        ...result,
    })
})

