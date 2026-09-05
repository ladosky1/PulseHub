import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { 
    userIdParamSchema,
    searchUserSchema 
} from "../validators/user.validator.js";
import { 
    getUserProfile,
    searchUsers, 
} from "../controller/user.controller.js";

const router = Router();

router.get(
    "/search",
    authenticate,
    validate(searchUserSchema, "query"),
    searchUsers
);

router.get(
    "/:userId",
    authenticate,
    validate(userIdParamSchema, "params"),
    getUserProfile
);

export default router;