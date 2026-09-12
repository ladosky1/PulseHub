import { resend } from "../config/mail.js";
import { env } from "../config/env.js";
import { buildPulseHubEmail } from "../emails/emailTemplate.js";

export async function sendVerificationEmail(
    email: string,
    code: string,
) {
    const html = buildPulseHubEmail({
        title: "Verify your account",
        description: "Welcome to PulseHub — use the code below to verify your email address.",
        code,
        expiryText: "This code expires in 10 minutes",
        supportingText: "If you didn't create a PulseHub account, you can safely ignore this email.",
        preheader: `Your PulseHub verification code is ${code}`,
    });

    const { data, error } = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: email,
        subject: "Verify your PulseHUB account",
        html,
    });

    if (error) {
        throw new Error(`Verification email failed: ${error.message}`);
    }

    return data;
}

export async function sendResetPasswordEmail(
    email: string,
    code: string,
) {
    const html = buildPulseHubEmail({
        title: "Reset your password",
        description: "Use the code below to reset your PulseHub password.",
        code,
        expiryText: "This code expires in 10 minutes",
        supportingText: "If you didn't request a password reset, you can safely ignore this email — your password will not change.",
        preheader: `Your PulseHub password reset code is ${code}`,
    });

    const { data, error } = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: email,
        subject: "Reset your PulseHUB account password",
        html,
    });

    if (error) {
        throw new Error(`Password reset email failed: ${error.message}`);
    }

    return data;
}