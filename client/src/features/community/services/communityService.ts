import { api } from "../../../lib/api";
import type { Community } from "../../../types";

interface CommunityDto {
    _id: string;
    name: string;
    description: string;
    category?: string;
    admin: {
        _id: string;
        username: string;
    };
    memberCount: number;
    isJoined: boolean;
}

interface GetCommunitiesResponse {
    communities: CommunityDto[];
}

interface GetCommunitiesParams {
    search?: string;
    category?: string;
}

export async function getCommunities({
    search,
    category
} : GetCommunitiesParams){
    const params = new URLSearchParams();

    if(search){
        params.set("search", search);
    }

    if(category){
        params.set("category", category)
    }

    const {data} = await api.get<GetCommunitiesResponse>(
        "/communities", 
        {
            params,
        }
    );
    
    return data.communities.map<Community>((community) => ({
        id: community._id,
        name: community.name,
        description: community.description,
        category: community.category ?? "General",
        memberCount: community.memberCount,
        adminId: community.admin._id,
        adminUsername: community.admin.username,
        isJoined: community.isJoined,
    }));
}