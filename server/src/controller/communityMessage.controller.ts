import { asyncHandler } from "../utils/asyncHandler.js";
import { 
    sendCommunityMessageService,
    getCommunityMessageService 
} from "../services/communityMessage.service.js";

export const sendCommunityMessage = asyncHandler(async(req, res) => {
    const communityMessage = await sendCommunityMessageService(
        req.session.userId!,
        req.params.communityId as string,
        req.body.content
    );

    res.json({
        message: "Message sent",
        data: communityMessage
    });
});

export const getCommunityMessage = asyncHandler(async(req, res) => {
    const messages = await getCommunityMessageService(
        req.session.userId!,
        req.params.communityId as string
    );

    res.json({
        messages,
    });
});