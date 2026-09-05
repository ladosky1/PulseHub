import { asyncHandler } from "../utils/asyncHandler.js";
import { 
    getUserProfileService,
    searchUsersService, 
} from "../services/user.service.js";

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await getUserProfileService(
        req.params.userId as string,
        req.session.userId!,
    );

    res.json({
        user,
    });
});

export const searchUsers = asyncHandler(async(req, res) => {
    const users = await searchUsersService(
        req.query.username as string
    );

    res.json({
        users,
    });
})