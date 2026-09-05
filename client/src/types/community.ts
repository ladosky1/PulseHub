export interface Community {
    id: string;
    name: string;
    description: string;
    category: string;
    memberCount: number;
    adminId: string;
    adminUsername: string;
    isJoined: boolean;
}

export interface CommunityMember {
    id: string;
    username: string;
    avatar: string | null;
}