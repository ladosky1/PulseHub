import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../service/logout";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

export function useLogout(){

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logout,

        onSuccess: () => {
            queryClient.setQueryData(
                ["current-user"],
                null
            );

            navigate("/");

            notifications.show({
                color: "green",
                title: "Logged Out",
                message: "See you again soon."
            });
        },

        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Logout Failed",
                message: getErrorMessage(error),
            });
        }
    })
}