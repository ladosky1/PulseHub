import { api } from "../../../lib/api";
import type { CommunityMember } from "../../../types";

interface CommunityMembersResponse{
    members: CommunityMember[];
}

export async function getCommunityMembers(
    communityId: string
){
    const {data} = await api.get<CommunityMembersResponse>(
        `/communities/${communityId}/members`
    );

    return data.members;
}