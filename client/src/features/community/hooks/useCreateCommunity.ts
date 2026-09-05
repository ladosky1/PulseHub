import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { createCommunity } from "../services/createCommunityService";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useCreateCommunity(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCommunity,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["communities"],
            });

            notifications.show({
                color: "green",
                title: "Community Created",
                message: "Your community has been craeted successfully"
            })
        },

        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Creation Failed",
                message: getErrorMessage(error),
            })
        }
    })
}