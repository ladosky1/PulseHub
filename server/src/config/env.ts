import dotenv from "dotenv";

dotenv.config();

if(!process.env.SESSION_SECRET){
    throw new Error("SESSION_SECRET is missing");
}

if(!process.env.MONGODB_URI){
    throw new Error("MONGODB_URI is missing");
}

export const env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || "",
    SESSION_SECRET: process.env.SESSION_SECRET || "",
    EMAIL_USER: process.env.EMAIL_USER || "",
    EMAIL_PASS: process.env.EMAIL_PASS || "",
    NODE_ENV: process.env.NODE_ENV || "",
}