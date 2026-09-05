import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../service/resetPassword";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import type { ResetPasswordFormData } from "../schema/auth.schema";

export function useResetPassword(){

    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: ResetPasswordFormData) => 
            resetPassword(data),

        onSuccess: () => {
            notifications.show({
                color: "green",
                title: "Password Updated",
                message: "You can now sign in with your new password."
            });

            navigate("/login");
        },

        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Reset Failed",
                message: getErrorMessage(error),
            });
        }
    })
}