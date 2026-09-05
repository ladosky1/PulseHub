import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema (
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        avatar: {
            type: String,
            default: null,
        },
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationCodeHash: {
            type: String,
            default: null,
            select: false,
        },
        verificationCodeExpiresAt: {
            type: Date,
            default: null,
        },
        resetPasswordTokenHash: {
            type: String,
            default: null,
            select: false,
        },
        resetPasswordExpiresAt: {
            type: Date,
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { id: string };

export const User = model<UserDocument>("User", userSchema);