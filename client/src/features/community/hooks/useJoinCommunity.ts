import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinCommunity } from "../services/joinCommunityService";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useJoinCommunity(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: joinCommunity,

        onSuccess: (_, communityId) => {
            queryClient.invalidateQueries({
                queryKey: ["communities"],
            });

            queryClient.invalidateQueries({
                queryKey: ["community", communityId]
            });

            queryClient.invalidateQueries({
                queryKey: ["community-members", communityId],
            });

            notifications.show({
                color: "green",
                title: "Joined",
                message: "Community Joined"
            })
        },

        onError: (error) => {
            notifications.show({
                color: "red",
                title: "Join Failed",
                message: `${getErrorMessage(error)}`,
            })
        }
    });
}