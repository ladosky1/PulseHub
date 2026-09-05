import { Request, Response } from "express";
import { 
    registerUser,
    verifyUserEmail,
    loginUser,
    resendVerificationCode,
    forgotPasswordService,
    resetPasswordService,
    changePasswordService,
    deleteAccountService, } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
    await registerUser(req.body);

    res.status(201).json({
        message: "Registration Successful, Check your email for the verifcation code"
    })
});

export const verifyEmail = asyncHandler(async(req: Request, res: Response) => {
    await verifyUserEmail(req.body);

    res.json({
        message: "Email verified successfully"
    });
});

export const resendVerification = asyncHandler(async(req: Request, res: Response) => {
    await resendVerificationCode(req.body.email);

    res.json({
        message: "Verification code sent"
    })
})

export const login = asyncHandler(async(req: Request, res: Response) => {
    const user = await loginUser(req.body);

    req.session.userId = user.id;

    res.status(200).json({
        message: "Login Successful",
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});

export const logout = asyncHandler(async(req: Request, res: Response) => {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({
                message: "Logout Failed",
            })
        }

        res.clearCookie("pulsehub.sid");

        return res.json({
            message: "Logged out successfully"
        });
    }); 
});

export const forgotPassword = asyncHandler(async(req: Request, res: Response) => {
    await forgotPasswordService(req.body.email);

    res.json({
        message: "Password reset code sent"
    });
});

export const resetPassword = asyncHandler(async(req: Request, res: Response) => {
    await resetPasswordService(req.body);

    res.json({
        message: "Password reset successfully"
    })
});

export const changePassword = asyncHandler(async(req: Request, res: Response) => {
    await changePasswordService(req.session.userId!, req.body);

    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({
                message: "Password changed, but failed to log out"
            });
        }

        res.clearCookie("pulsehub.sid");

        res.json({
            message: "Password changed successfully, please log in again"
        });
    })
});

export const me = asyncHandler(async(req: Request, res: Response) => {
    res.json({
        user: req.user,
    });
});

export const deleteAccount = asyncHandler(async(req, res, next) => {
    const userId = req.session.userId!;

    await deleteAccountService(userId);

    req.session.destroy((error) => {
        if(error){
            return next(error);
        };

        res.clearCookie("pulsehub.sid");

        res.json({
            message: "Account deleted successfully",
        })
    })
})