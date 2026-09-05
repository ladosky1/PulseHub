import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

import { deleteCommunity } from "../services/deleteCommunityService";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useDeleteCommunity(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (communityId: string) => deleteCommunity(communityId),

        onSuccess: (_, communityId) => {
            queryClient.removeQueries({
                queryKey: ["community", communityId],
            });

            queryClient.invalidateQueries({
                queryKey: ["communities"],
            });

            notifications.show({
                color: "green",
                title: "Community Deleted",
                message: "The community was deleted successfully"
            });

            navigate("/");
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