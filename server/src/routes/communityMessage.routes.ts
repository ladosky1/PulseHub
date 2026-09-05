import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { 
    sendCommunityMessageSchema,
    getCommunityMessageSchema, 
} from "../validators/communityMessage.validator.js";
import { 
    sendCommunityMessage,
    getCommunityMessage, 
} from "../controller/communityMessage.controller.js";

const router = Router();

router.post(
    "/:communityId/messages",
    authenticate,
    validate(sendCommunityMessageSchema),
    sendCommunityMessage
);

router.get(
    "/:communityId/messages",
    authenticate,
    validate(getCommunityMessageSchema, "params"),
    getCommunityMessage
);

export default router;