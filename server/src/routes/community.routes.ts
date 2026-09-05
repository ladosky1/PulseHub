import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { 
    createCommunitySchema,
    communitySchema,
    getCommunitiesQuerySchema
} from "../validators/community.validator.js";
import { 
    createCommunity,
    getCommunities,
    joinCommunity,
    leaveCommunity,
    getCommunity,
    getCommunityMembers,
    deleteCommunity, 
} from "../controller/community.controller.js";

const router = Router();

router.get(
    "/",
    validate(getCommunitiesQuerySchema, "query"),
    getCommunities
);

router.get(
    "/:communityId/members",
    validate(communitySchema, "params"),
    getCommunityMembers
);

router.get(
    "/:communityId",
    validate(communitySchema, "params"),
    getCommunity
);

router.post(
    "/",
    authenticate,
    validate(createCommunitySchema),
    createCommunity
);

router.post(
    "/:communityId/join",
    authenticate,
    validate(communitySchema, "params"),
    joinCommunity
);

router.delete(
    "/:communityId/leave",
    authenticate,
    validate(communitySchema, "params"),
    leaveCommunity
);

router.delete(
    "/:communityId",
    authenticate,
    validate(communitySchema, "params"),
    deleteCommunity
);

export default router;