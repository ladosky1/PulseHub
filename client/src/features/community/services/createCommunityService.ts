import { api } from "../../../lib/api";

interface CreateCommunityData {
    name: string;
    description: string;
    avatar?: string;
    category: string;
    isPrivate?: string;
};

export async function createCommunity(data: CreateCommunityData){
    const {data: response} = await api.post(
        "/communities",
        data
    );

    return response;
}