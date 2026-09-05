import session from "express-session";
import MongoStore from "connect-mongo";
import { env } from "./env.js";

const isProduction = env.NODE_ENV === "production"

export const sessionMiddleware = session({
    secret: env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: env.MONGODB_URI
    }),

    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
});
