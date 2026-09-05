import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { 
    authRateLimiter,
    sensitiveAuthRateLimiter 
} from "../middleware/rateLimit.middleware.js";
import { 
    registerSchema,
    verifyEmailSchema, 
    loginSchema,
    resendVerificationSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema } from "../validators/auth.validator.js";
import { 
    register, 
    login,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    me, 
    logout,
    deleteAccount
} from "../controller/auth.controller.js";

const router = Router();

router.post(
    "/register",
    validate(registerSchema), 
    register
);

router.post(
    "/verify-email",
    sensitiveAuthRateLimiter,
    validate(verifyEmailSchema),
    verifyEmail
)

router.post(
    "/login",
    authRateLimiter,
    validate(loginSchema),
    login
);

router.post(
    "/resend-verification-code",
    validate(resendVerificationSchema),
    resendVerification
);

router.post(
    "/forgot-password",
    sensitiveAuthRateLimiter,
    validate(forgotPasswordSchema),
    forgotPassword
);

router.post(
    "/reset-password",
    sensitiveAuthRateLimiter,
    validate(resetPasswordSchema),
    resetPassword
);

router.get(
    "/me", 
    authenticate,
    me
);

router.post(
    "/change-password",
    authenticate,
    validate(changePasswordSchema),
    changePassword
);

router.delete(
    "/account",
    authenticate,
    deleteAccount
);

router.post("/logout", authenticate, logout)

export default router;