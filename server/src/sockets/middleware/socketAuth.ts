import { User } from "../../model/user.model.js";
import { sessionMiddleware } from "../../config/session.js";

export function socketAuthMiddleware(
    socket: any,
    next: (error?: Error) => void
){
    sessionMiddleware(
        socket.request,
        {} as any,
        async () => {
            const userId = socket.request.session.userId;

            if(!userId){
                return next(new Error("Unauthorized"));
            }

            const user = await User.findById(
                userId
            ).select("_id username avatar");

            if(!user){
                return next(new Error("User not found"));
            }

            socket.data.user = user;

            next();
        }
    );
}