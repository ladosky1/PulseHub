export const COMMUNITY_CATEGORIES = [
    "anime",
    "movies",
    "gaming",
    "sports",
    "coding",
    "technology",
    "music",
    "book",
    "general",
] as const;

export type CommunityCategory = typeof COMMUNITY_CATEGORIES[number];