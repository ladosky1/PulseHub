import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

import { deleteAccount } from "../service/deleteAccount";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useDeleteAccount(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: deleteAccount,

        onSuccess: () => {
            queryClient.clear();

            notifications.show({
                color: "green",
                title: "Account Deleted",
                message: "Your PulseHub account has been deleted."
            });

            navigate("/login", {
                replace: true
            });
        },

        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Delete Failed",
                message: getErrorMessage(error),
            })
        }
    })
}