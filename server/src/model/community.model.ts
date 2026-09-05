import { Schema, model, Types } from "mongoose";
import { COMMUNITY_CATEGORIES } from "../constants/community.js";

const communitySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            maxlength: 50,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },
        category: {
            type: String,
            enum: COMMUNITY_CATEGORIES,
            required: true
        },
        avatar: {
            type: String,
            default: null,
        },
        admin: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        moderators: [
            {
                type: Types.ObjectId,
                ref: "User"
            }
        ],
        members: [
            {
                type: Types.ObjectId,
                ref: "User",
            }
        ],
        
        isPrivate: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Community = model(
    "Community",
    communitySchema
);