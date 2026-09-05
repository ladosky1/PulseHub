import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../service/changePassword";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useChangePassword(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: changePassword,

        onSuccess: () => {
            queryClient.setQueryData(
                ["current-user"], null
            );

            notifications.show({
                color: "green",
                title: "Password Changed",
                message: "Please log in again."
            });

            navigate("/login", {
                replace: true,
            });
        },

        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Password Change Failed",
                message: getErrorMessage(error),
            })
        }
    })
}
