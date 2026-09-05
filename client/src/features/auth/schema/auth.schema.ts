import {z} from "zod";

export const loginSchema = z.object({
    email: z.email("Please enter a valid email address."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot exceed 20 characters"),
    
    email: z.email("Please enter a valid email address."),

    password: z
        .string()
        .min(8, "Password must be at leats 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter.")
        .regex(/[a-z]/, "Must contain a lowercase letter.")
        .regex(/[0-9]/, "Must contain a number.")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character."),
    
    confirmPassword: z.string(),

}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match.",
    path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
    email: z.email("Please enter a avlid email address"),

    code: z
        .string()
        .length(8, "verification code must be 8 digit")
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
    email: z.email("Please enter a valid email address"),
});

export type forgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({    
    email: z.email("Please enter a valid email address."),

    code: z
        .string()
        .length(8, "Reset code must be 8 digits."),

    password: z
        .string()
        .min(8, "Password must be at leats 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter.")
        .regex(/[a-z]/, "Must contain a lowercase letter.")
        .regex(/[0-9]/, "Must contain a number.")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character."),
    
    confirmPassword: z.string(),

}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match.",
    path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current Password is required"),
    newPassword: z
        .string()
        .min(8, "Password must be at leats 8 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter.")
        .regex(/[a-z]/, "Must contain a lowercase letter.")
        .regex(/[0-9]/, "Must contain a number.")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character."),
    confirmNewPassword: z
        .string()
        .min(1, "Please confirm your new password"),
})
.refine(
    (data) => data.newPassword === data.confirmNewPassword,
    {
        message: "Password do not match",
        path:["confirmPassword"],
    }
);

export type ChangePasswordFormData = z.infer<
    typeof changePasswordSchema
>;