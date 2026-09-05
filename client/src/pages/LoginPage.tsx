import {
    PasswordInput, 
    TextInput,
    Anchor,
    Text, 
    Title 
} from "@mantine/core";
import { PrimaryButton } from "../components/buttons";
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    loginSchema,
    type LoginFormData
} from "../features/auth/schema/auth.schema";
import { useLogin } from "../features/auth/hook/useLogin";
import { Link } from "react-router-dom";
import classes from "../styles/authstyles/LoginPage.module.css";

export function LoginPage(){

    const { 
        register, 
        handleSubmit, 
        formState: {errors} 
    } = useForm<LoginFormData>({resolver: zodResolver(loginSchema),});

    const { mutate, isPending } = useLogin();

    const onSubmit = (data: LoginFormData) => {
        mutate(data);
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.header}>
                <Title order={2} className={classes.title}>
                    Welcome Back
                </Title>
                <Text className={classes.subtitle}>
                    Sign in to continue your conversations
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

                <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register("password")}
                    classNames={{ label: classes.label, input: classes.inputField }}
                />

                <div className={classes.forgotRow}>
                    <Anchor
                        component={Link}
                        to="/forgot-password"
                        className={classes.forgotLink}>
                        Forgot password?
                    </Anchor>
                </div>
            </div>

            <div className={classes.button}>
                <PrimaryButton 
                    type="submit" 
                    fullWidth
                    loading={isPending}
                    size="md">
                    Login
                </PrimaryButton>
            </div>

            <div className={classes.footer}>
                <Text className={classes.footerText}>
                    Don't have an account?
                </Text>
                <Anchor component={Link} to="/register" className={classes.footerLink}>
                    Create an account
                </Anchor>
            </div>
        </form>
    )
}