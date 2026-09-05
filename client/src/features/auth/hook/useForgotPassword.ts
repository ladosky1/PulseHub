import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../service/forgotPassword";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import type { forgotPasswordFormData } from "../schema/auth.schema";

export function useForgotPassword(){

    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: forgotPasswordFormData) => 
            forgotPassword(data),

        onSuccess: (_, variables) => {
            notifications.show({
                color: "green",
                title: "Email Sent",
                message: "Password reset code sent successfully"
            });

            navigate(`/reset-password?email=${encodeURIComponent(
                variables.email
            )}`
            );
        },

        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Request Failed",
                message: getErrorMessage(error),
            });
        }
    })
}