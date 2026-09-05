import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../service/login";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { notifications } from "@mantine/notifications";
import type { LoginFormData } from "../schema/auth.schema";
import { useNavigate } from "react-router-dom";

export function useLogin(){

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: LoginFormData) => login(data),

        onSuccess: (data) => {
            queryClient.setQueryData(
                ["current-user"],
                data
            );

            navigate("/");

            notifications.show({
                color: "green",
                title: "Success",
                message: "Logged in successfully"
            });
        },

        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Login Failed",
                message: getErrorMessage(error),
            });
        }
    })
}