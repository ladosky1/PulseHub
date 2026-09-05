import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../services/getFriends";

export function useFriends(){
    return useQuery({
        queryKey: ["friends"],
        queryFn: getFriends,
    })
}