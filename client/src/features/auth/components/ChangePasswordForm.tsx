import {
    PasswordInput,
    Stack,
} from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PrimaryButton } from "../../../components/buttons";
import {
    changePasswordSchema,
    type ChangePasswordFormData,
} from "../schema/auth.schema";
import { useChangePassword } from "../hook/useChangePassword";

interface ChangePasswordFormProps {
    onSuccess?: () => void;
}

export function ChangePasswordForm({
    onSuccess,
}: ChangePasswordFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const {
        mutate: changePassword,
        isPending,
    } = useChangePassword();

    const onSubmit = (
        data: ChangePasswordFormData
    ) => {
        changePassword(
            {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword,
            },
            {
                onSuccess,
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
                <PasswordInput
                    label="Current Password"
                    error={
                        errors.currentPassword?.message
                    }
                    {...register("currentPassword")}/>

                <PasswordInput
                    label="New Password"
                    error={
                        errors.newPassword?.message
                    }
                    {...register("newPassword")}/>

                <PasswordInput
                    label="Confirm Password"
                    error={
                        errors.confirmNewPassword?.message
                    }
                    {...register("confirmNewPassword")}/>

                <PrimaryButton
                    type="submit"
                    loading={isPending}
                    size="md"
                    fullWidth>
                    Change Password
                </PrimaryButton>
            </Stack>
        </form>
    );
}