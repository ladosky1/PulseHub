import { useMutation } from "@tanstack/react-query";
import { register } from "../service/register";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import type { RegisterFormData } from "../schema/auth.schema";

export function useRegister(){

    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: RegisterFormData) => register(data),

        onSuccess: (_, variables) => {
            notifications.show({
                color: "green",
                title: "Success",
                message: "Verify your email"
            });

            navigate(
                `/verify-email?email=${encodeURIComponent(
                    variables.email
                )}`
            );
        },

        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Registration Failed",
                message: getErrorMessage(error),
            });
        }
    })
}