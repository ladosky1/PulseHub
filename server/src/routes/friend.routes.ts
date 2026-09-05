import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { 
    sendFriendRequestSchema,
    acceptFriendRequestSchema,
    friendIdParamSchema,
} from "../validators/friend.validator.js";
import { 
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    getFriends,
    rejectFriendRequest,
    removeFriend,
} from "../controller/friend.controller.js";

const router = Router();

router.post(
    "/requests",
    authenticate,
    validate(sendFriendRequestSchema),
    sendFriendRequest
);

router.get(
    "/requests",
    authenticate,
    getFriendRequests
);

router.patch(
    "/requests/accept",
    authenticate,
    validate(acceptFriendRequestSchema),
    acceptFriendRequest
);

router.patch(
    "/requests/reject",
    authenticate,
    validate(acceptFriendRequestSchema),
    rejectFriendRequest
)

router.get(
    "/",
    authenticate,
    getFriends
);

router.delete(
    "/:friendId",
    authenticate,
    validate(friendIdParamSchema, "params"),
    removeFriend
)

export default router;