import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { 
    sendMessageSchema,
    conversationParamSchema,
    markMessageAsReadSChema,
    messageIdParamSchema, 
} from "../validators/message.validator.js";
import { 
    sendMessage,
    getConversation,
    markMessageAsRead,
    getUnreadMessageCount,
    getConversationList,
    //deleteConversation,
    deleteMessage, 
} from "../controller/message.controller.js";

const router = Router();

router.get(
    "/conversations",
    authenticate,
    getConversationList
);

router.get(
    "/unread-count",
    authenticate,
    getUnreadMessageCount
);

router.get(
    "/conversations/:friendId",
    authenticate,
    validate(conversationParamSchema, "params"),
    getConversation
);

router.post(
    "/",
    authenticate,
    validate(sendMessageSchema),
    sendMessage
);

router.patch(
    "/conversations/:friendId/read",
    authenticate,
    validate(markMessageAsReadSChema, "params"),
    markMessageAsRead
);

/*router.delete(
    "/conversations/:friendId",
    authenticate,
    validate(conversationParamSchema, "params"),
    deleteConversation
);*/

router.delete(
    "/:messageId",
    authenticate,
    validate(messageIdParamSchema, "params"),
    deleteMessage,
)

export default router;