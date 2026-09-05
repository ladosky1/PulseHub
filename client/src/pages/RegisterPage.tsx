import {
    PasswordInput, 
    TextInput,
    Anchor,
    Text, 
    Title,
    SimpleGrid,
} from "@mantine/core";
import { PrimaryButton } from "../components/buttons";
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    registerSchema,
    type RegisterFormData
} from "../features/auth/schema/auth.schema";
import { useRegister } from "../features/auth/hook/useRegister";
import { Link } from "react-router-dom";
import classes from "../styles/authstyles/RegisterPage.module.css"

export function RegisterPage(){

    const { 
        register, 
        handleSubmit, 
        formState: {errors} 
    } = useForm<RegisterFormData>({resolver: zodResolver(registerSchema),});

    const { mutate, isPending } = useRegister();

    const onSubmit = (data: RegisterFormData) => {
        mutate(data);
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.header}>
                <Title order={2} className={classes.title}>
                    Create your account
                </Title>
                <Text className={classes.subtitle}>
                    Join PulseHub and connect with communities you love.
                </Text>
            </div>

            <div className={classes.fields}>
                <SimpleGrid cols={{ base: 2, sm: 2 }} spacing={12} className={classes.grid}>
                    <TextInput
                        label="Username"
                        placeholder="Enter your username"
                        error={errors.username?.message}
                        {...register("username")}
                        classNames={{ label: classes.label, input: classes.inputField }}
                    />
                    <TextInput
                        label="Email Address"
                        placeholder="Enter your email"
                        error={errors.email?.message}
                        {...register("email")}
                        classNames={{ label: classes.label, input: classes.inputField }}
                    />
                </SimpleGrid>

                <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register("password")}
                    classNames={{ label: classes.label, input: classes.inputField }}
                />

                <PasswordInput
                    label="Confirm Password"
                    placeholder="Enter your password"
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
                    Create Account
                </PrimaryButton>
            </div>

            <div className={classes.footer}>
                <Text className={classes.footerText}>
                    Already have an account?
                </Text>
                <Anchor component={Link} to="/login" className={classes.footerLink}>
                    Sign in
                </Anchor>
            </div>
        </form>
    )
}