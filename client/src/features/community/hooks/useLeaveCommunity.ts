import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveCommunity } from "../services/leaveCommunityService";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useLeaveCommunity(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: leaveCommunity,

        onSuccess: (_, communityId) => {
            queryClient.invalidateQueries({
                queryKey: ["community", communityId],
            });

            queryClient.invalidateQueries({
                queryKey: ["communities"]
            });

            queryClient.invalidateQueries({
                queryKey: ["community-members", communityId],
            });

            notifications.show({
                color: "green",
                title: "Left Community",
                message: "You left the community successfully"
            });
        },
        
        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Leave Failed",
                message: getErrorMessage(error),
            });
        }
    })
}