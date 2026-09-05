import {
    PinInput,
    Anchor,
    Text,
    Title
} from "@mantine/core";
import { PrimaryButton } from "../components/buttons";
import { useState, useEffect } from "react";
import { useForm, Controller } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    verifyEmailSchema,
    type VerifyEmailFormData
} from "../features/auth/schema/auth.schema";
import { useVerifyEmail } from "../features/auth/hook/useVerifyEmail";
import { Link, useSearchParams } from "react-router-dom";
import { maskEmail } from "../utils/maskEmail";
import { Navigate } from "react-router-dom";
import { useResendVerification } from "../features/auth/hook/useVerification";
import classes from "../styles/authstyles/VerifyEmailPage.module.css"

export function VerifyEmailPage(){

    const [countdown, setCountdown] = useState(60);
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email")?? "";

    useEffect(() => {
        if(countdown === 0) return;
        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1)
        }, 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const {
        control,
        handleSubmit,
    } = useForm<VerifyEmailFormData>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: { email, code: "" },
    });

    const { mutate, isPending } = useVerifyEmail();
    const { mutate: resendCode, isPending: isResending } = useResendVerification();

    const onSubmit = (data: VerifyEmailFormData) => {
        mutate(data);
    }

    if(!email){
        return <Navigate to="/register" replace/>
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.header}>
                <Title order={2} className={classes.title}>
                    Verify your email
                </Title>
                <Text className={classes.subtitle}>
                    We have sent an 8-digit verification code to{" "}
                    <span className={classes.emailHighlight}>
                        {maskEmail(email)}
                    </span>
                </Text>
            </div>

            <div className={classes.pinWrapper}>
                <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                        <PinInput
                            {...field}
                            length={8}
                            oneTimeCode
                            classNames={{
                                root: classes.pinRoot,
                                input: classes.pinInput
                            }}
                        />
                    )}
                />
            </div>

            <div className={classes.button}>
                <PrimaryButton
                    type="submit"
                    fullWidth
                    loading={isPending}
                    size="md">
                    Verify Email
                </PrimaryButton>
            </div>

            <div className={classes.secondary}>
                <Text className={classes.secondaryText}>
                    Didn't receive the code?
                </Text>
                <Anchor
                    component="button"
                    disabled={countdown > 0 || isResending}
                    onClick={() => {
                        resendCode(email);
                        setCountdown(60)
                    }}
                    className={classes.resendLink}>
                    {countdown > 0
                       ? `Resend in ${countdown}s`
                        : "Resend Code"}
                </Anchor>
            </div>

            <div className={classes.footer}>
                <Anchor
                    component={Link}
                    to="/login"
                    className={classes.footerLink}>
                    Sign in
                </Anchor>
            </div>
        </form>
    )
}