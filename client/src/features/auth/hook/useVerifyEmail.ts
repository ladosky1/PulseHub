import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "../service/verifyEmail";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import type { VerifyEmailFormData } from "../schema/auth.schema";

export function useVerifyEmail(){

    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: VerifyEmailFormData) => verifyEmail(data),

        onSuccess: () => {
            notifications.show({
                color: "green",
                title: "Email verified",
                message: "Your account has been verified successfully"
            });

            navigate("/login");
        },

        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Verification Failed",
                message: getErrorMessage(error),
            });
        }
    })
}