import { 
    Anchor,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { PrimaryButton } from "../components/buttons";
import { 
    forgotPasswordSchema,
    type forgotPasswordFormData
} from "../features/auth/schema/auth.schema";
import { useForgotPassword } from "../features/auth/hook/useForgotPassword";
import classes from "../styles/authstyles/ForgotPasswordPage.module.css"

export function ForgotPasswordPage(){
    const {
        register, 
        handleSubmit,
        formState: { errors },
    } = useForm<forgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const { mutate, isPending } = useForgotPassword();

    const onSubmit = (data: forgotPasswordFormData) => {
        mutate(data);
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.header}>
                <Title order={2} className={classes.title}>
                    Forgot your password?
                </Title>
                <Text className={classes.subtitle}>
                    Enter your email address and we will send you a reset code.
                </Text>
            </div>

            <div className={classes.fields}>
                <TextInput
                    label="Email Address"
                    placeholder="Enter your email"
                    error={errors.email?.message}
                    {...register("email")}
                    classNames={{ label: classes.label, input: classes.inputField }}
                />
            </div>
                
            <div className={classes.button}>
                <PrimaryButton
                    type="submit"
                    fullWidth
                    loading={isPending}
                    size="md">
                    Send Reset Code
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