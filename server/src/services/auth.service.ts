import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";
import { AppError } from "../errors/AppError.js";
import { VERIFICATION_CODE_EXPIRY } from "../constants/auth.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { 
    sendVerificationEmail,
    sendResetPasswordEmail } from "./email.service.js";
import mongoose from "mongoose";
import { FriendRequest } from "../model/friendRequest.model.js";
import { Message } from "../model/message.model.js";
import { Notification } from "../model/notifications.model.js";
import { CommunityMessage } from "../model/communityMessage.model.js";
import { Community } from "../model/community.model.js";

export async function registerUser(data: {
    username: string;
    email: string;
    password: string;
}){
    
    const existingUser = await User.findOne({ email: data.email });

    if(existingUser){
        if(existingUser.isVerified){
            throw new AppError ("Email Already Exists", 409);
        }

        const code = generateVerificationCode();

        existingUser.verificationCodeHash = await bcrypt.hash(code, 12);
        existingUser.verificationCodeExpiresAt = new Date(
            Date.now() + VERIFICATION_CODE_EXPIRY
        );

        await existingUser.save();
        await sendVerificationEmail(existingUser.email, code);

        return;
    };

    const existingUsername = await User.findOne({ username: data.username});

    if(existingUsername){
        throw new AppError("Username Already Exists", 409);
    };

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const code = generateVerificationCode();

    const verificationCodeHash = await bcrypt.hash(code, 12);

    await User.create({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        verificationCodeHash,
        verificationCodeExpiresAt: new Date(
            Date.now() + VERIFICATION_CODE_EXPIRY
        )
    });

    await sendVerificationEmail(data.email, code);
}

export async function loginUser(data: {
    email: string;
    password: string;
}){
    const user = await User.findOne({
        email: data.email
    }).select("+password");
    
    if(!user){
        throw new AppError("Invalid username or password", 401);
    };

    const passwordMatches = await bcrypt.compare(
        data.password, user.password
    )

    if(!passwordMatches){
        throw new AppError("Invalid username or password", 401);
    };

    if(!user.isVerified){
        throw new AppError("Please verify your email before logging in.", 403);
    }

    return user;
}

export async function verifyUserEmail(data: {
    email: string;
    code: string;
}){
    const user = await User.findOne({ email: data.email }).select("+verificationCodeHash");

    if(!user){
        throw new AppError ("User not found", 404);
    };

    if(user.isVerified){
        throw new AppError ("Email already verified", 400);
    };

    if(
        !user.verificationCodeExpiresAt ||
        user.verificationCodeExpiresAt < new Date()
    ){
        throw new AppError("Verification code expired.", 400);
    };

    if(!user.verificationCodeHash){
        throw new AppError("Invalid verification code", 400)
    }

    const valid = await bcrypt.compare(
        data.code,
        user.verificationCodeHash!
    );

    if(!valid){
        throw new AppError ("Invalid verification code", 400)
    };

    user.isVerified = true;
    user.verificationCodeHash = null;
    user.verificationCodeExpiresAt = null;

    await user.save();
};

export async function resendVerificationCode(email: string){
    const user = await User.findOne({ email });

    if(!user  || user.isVerified){
        return;
    };

    if(user.isVerified){
        throw new AppError("Email already verified", 400);
    }

    const code = generateVerificationCode();

    user.verificationCodeHash = await bcrypt.hash(code, 12);
    user.verificationCodeExpiresAt = new Date(
        Date.now() + VERIFICATION_CODE_EXPIRY
    );

    await user.save();

    await sendVerificationEmail(user.email, code);
}

export async function forgotPasswordService(email: string){
    const user = await User.findOne({email});

    if(!user){
        return;
    }

    const code = generateVerificationCode();

    user.resetPasswordTokenHash = await bcrypt.hash(code, 12);
    user.resetPasswordExpiresAt = new Date(
        Date.now() + VERIFICATION_CODE_EXPIRY
    );

    await user.save();

    await sendResetPasswordEmail(user.email, code);
};

export async function resetPasswordService(data: {
    email: string,
    code: string,
    password: string,
}){
    const user = await User.findOne({
        email: data.email
    }).select("+password +resetPasswordTokenHash");

    if(!user){
        throw new AppError("User not found", 404);
    };

    if(
        !user.resetPasswordExpiresAt ||
        user.resetPasswordExpiresAt < new Date()
    ){
        throw new AppError("Reset Code expired", 400);
    };

    if(!user.resetPasswordTokenHash){
        throw new AppError("Invalid verification code", 400)
    }

    const valid = await bcrypt.compare(
        data.code,
        user.resetPasswordTokenHash!
    );

    if(!valid){
        throw new AppError("Invalid reset code", 400)
    };

    user.password = await bcrypt.hash(data.password, 12);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpiresAt = null;

    await user.save();
}

export async function changePasswordService(
    userId: string,
    data: {
        currentPassword: string;
        newPassword: string;
    }
){
    const user = await User.findById(userId).select("+password");

    if(!user){
        throw new AppError("user not found", 404);
    };

    const matches = await bcrypt.compare(
        data.currentPassword,
        user.password
    );

    if(!matches){
        throw new AppError("Current password is incorrect.", 401);
    };

    const samePassword = await bcrypt.compare(
        data.newPassword,
        user.password
    );

    if(samePassword){
        throw new AppError("New Password must be different from the current password", 400);
    }

    user.password = await bcrypt.hash(data.newPassword, 12);

    await user.save();
};

export async function deleteAccountService(userId: string){
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const user = await User.findById(userId).session(session);

        if(!user){
            throw new AppError(
                "user not found",
                404
            );
        };

        const adminCommunity = await Community.findOne({
            admin: userId
        }).session(session);

        if(adminCommunity){
            throw new AppError(
                "You must transfer or delete your communities before deleting your account",
                409
            );
        }

        await User.updateMany(
            {
                friends: userId,
            },
            {
                $pull: {
                    friends: userId,
                },
            }, {session}
        );

        await FriendRequest.deleteMany(
            {
                $or: [
                    { sender: userId },
                    { receiver: userId },
                ],
            }, {session}
        );

        await Notification.deleteMany(
            {
                $or: [
                    { recipient: userId },
                    { actor: userId },
                ]
            }, {session}
        );

        await Message.deleteMany(
            {
                $or: [
                    { sender: userId },
                    { receiver: userId },
                ],
            }, {session}
        );

        await Message.deleteMany(
            {
                $or: [
                    { sender: userId },
                    { receiver: userId },
                ],
            }, {session}
        );

        await CommunityMessage.deleteMany(
            {
                sender: userId,
            }, {session}
        );

        await Community.updateMany(
            {
                members: userId,
            },
            {
                $pull: {
                    members: userId
                },
            }, {session}
        );

        await Community.updateMany(
            {
                members: userId,
            },
            {
                $pull: {
                    moderators: userId
                },
            }, {session}
        );

        await User.deleteOne(
            {
                _id: userId,
            }, {session}
        );

        await session.commitTransaction();
    } catch(error){
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}
