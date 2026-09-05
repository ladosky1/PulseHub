import {
    Anchor,
    PasswordInput,
    PinInput,
    Text,
    Title,
} from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
    Link,
    Navigate,
    useSearchParams,
} from "react-router-dom";
import { PrimaryButton } from "../components/buttons";
import {
    resetPasswordSchema,
    type ResetPasswordFormData
} from "../features/auth/schema/auth.schema";
import { useResetPassword } from "../features/auth/hook/useResetPassword";
import { maskEmail } from "../utils/maskEmail";
import classes from "../styles/authstyles/ResetPasswordPage.module.css"

export function ResetPasswordPage(){

    const [searchParams] = useSearchParams();
    const email = searchParams.get("email")?? "";

    if(!email){
        return <Navigate to="/forgot-password" replace/>
    }

    const {
        register,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email,
            code: "",
            password: "",
            confirmPassword: "",
        },
    });

    const { mutate, isPending } = useResetPassword();

    const onSubmit = (data: ResetPasswordFormData) => {
        mutate(data);
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.header}>
                <Title order={2} className={classes.title}>
                    Reset Password
                </Title>
                <Text className={classes.subtitle}>
                    Enter the 8-digit code sent to{" "}
                    <span className={classes.emailHighlight}>
                        {maskEmail(email)}
                    </span>
                </Text>
            </div>

            <div className={classes.pinSection}>
                <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                        <PinInput
                            {...field}
                            length={8}
                            oneTimeCode
                            autoFocus
                            classNames={{
                                root: classes.pinRoot,
                                input: classes.pinInput
                            }}
                        />
                    )}
                />
                {errors.code?.message && (
                    <Text className={classes.pinError}>
                        {errors.code.message}
                    </Text>
                )}
            </div>

            <div className={classes.fields}>
                <PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                    error={errors.password?.message}
                    {...register("password")}
                    classNames={{ label: classes.label, input: classes.inputField }}
                />
                <PasswordInput
                    label="Confirm Password"
                    placeholder="Confirm new password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                    classNames={{ label: classes.label, input: classes.inputField }}
                />
            </div>

            <div className={classes.button}>
                <PrimaryButton
                    type="submit"
                    fullWidth
                    loading={isPending}
                    size="md">
                    Reset Password
                </PrimaryButton>
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