import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import { resendVerification } from "../service/resendVerification";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useResendVerification(){
    return useMutation({
        mutationFn: resendVerification,

        onSuccess: () => {
            notifications.show({
                color: "green",
                title: "Code Sent",
                message: "A new verification code has been sent..."
            });
        },

        onError:(error) => {
            notifications.show({
                color: "red",
                title: "Failed",
                message: getErrorMessage(error)
            })
        }
    })
}