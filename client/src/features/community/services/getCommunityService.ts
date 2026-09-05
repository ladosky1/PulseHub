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
    isMember: boolean;
}

interface GetCommunityResponse {
    community: CommunityDto;
}

export async function getCommunity(
    communityId: string
) : Promise<Community>{

    const {data} = await api.get<GetCommunityResponse>(
        `/communities/${communityId}`
    );
    
    return {
        id: data.community._id,
        name: data.community.name,
        description: data.community.description,
        category: data.community.category ?? "General",
        memberCount: data.community.memberCount,
        adminId: data.community.admin._id,
        adminUsername: data.community.admin.username,
        isJoined: data.community.isMember,
    };
}