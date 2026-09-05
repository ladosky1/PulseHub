import {z} from "zod";

export const registerSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3)
        .max(20),

    email: z.email(),

    password: z
        .string()
        .min(8)
        .regex(/[A-Z]/, "Must contain an uppercase letter.")
        .regex(/[a-z]/, "Must contain a lowercase letter.")
        .regex(/[0-9]/, "Must contain a number.")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character."),
    
    confirmPassword: z.string(),

}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match.",
    path: ["confirmPassword"],
});

export const verifyEmailSchema = z.object({
    email: z.email(),

    code: z.string().length(8)
});

export const loginSchema = z.object({
    email: z.email(),

    password: z
        .string()
        .min(8)
});

export const resendVerificationSchema = z.object({
    email: z.email(),
});

export const forgotPasswordSchema = z.object({
    email: z.email(),
});

export const resetPasswordSchema = z.object({
    email: z.email(),

    code: z.string().length(8),

    password: z
        .string()
        .min(8)
        .regex(/[A-Z]/, "Must contain an uppercase letter.")
        .regex(/[a-z]/, "Must contain a lowercase letter.")
        .regex(/[0-9]/, "Must contain a number.")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character."),
    
    confirmPassword: z.string(),

}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match.",
    path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
    currentPassword: z.string(),

    newPassword: z
        .string()
        .min(8)
        .regex(/[A-Z]/, "Must contain an uppercase letter.")
        .regex(/[a-z]/, "Must contain a lowercase letter.")
        .regex(/[0-9]/, "Must contain a number.")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character."),
        
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password do not match.",
    path: ["confirmPassword"],
});