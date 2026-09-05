import express from 'express';
import cors from 'cors'
import { corsOptions } from './config/cors.js';
import { errorHandler } from './middleware/error.middleware.js';
import healthRoute from "./routes/health.routes.js";
import authRoute from "./routes/auth.routes.js";
import usersRoute from "./routes/user.routes.js"
import friendRoute from "./routes/friend.routes.js";
import messageRoute from "./routes/message.routes.js";
import communityRoute from "./routes/community.routes.js";
import communityMessageRoute from "./routes/communityMessage.routes.js";
import notificationRoute from "./routes/notifications.route.js";
import {sessionMiddleware} from './config/session.js';
import { env } from './config/env.js';

const app = express();

if(env.NODE_ENV === "production"){
    app.set("trust proxy", 1);
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(sessionMiddleware);

app.use("/api", healthRoute);

app.use("/api/auth", authRoute);

app.use("/api/users", usersRoute);

app.use("/api/friends", friendRoute);

app.use("/api/messages", messageRoute);

app.use("/api/communities", communityRoute);

app.use("/api/communities", communityMessageRoute);

app.use("/api/notifications", notificationRoute);

app.use(errorHandler);

export default app;