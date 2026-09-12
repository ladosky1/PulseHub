import dotenv from "dotenv";

dotenv.config();

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is missing");
}

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
}

if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing");
}

export const env = {
    PORT: process.env.PORT || 3000,

    MONGODB_URI: process.env.MONGODB_URI || "",

    SESSION_SECRET: process.env.SESSION_SECRET || "",

    RESEND_API_KEY: process.env.RESEND_API_KEY || "",

    EMAIL_FROM:
        process.env.EMAIL_FROM ||
        "PulseHub <noreply@pulsehub.com.ng>",

    NODE_ENV: process.env.NODE_ENV || "",
};