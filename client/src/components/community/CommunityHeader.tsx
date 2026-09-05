import {
    Avatar,
    Badge,
    Button,
    Group,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { IconTrash, IconUsers } from "@tabler/icons-react";
import type { Community } from "../../types";
import classes from "../../styles/communitystyles/CommunityHeader.module.css";

interface CommunityHeaderProps {
    community: Community;
    isAdmin: boolean;
    isJoiningOrLeaving: boolean;
    onJoinLeave: () => void;
    onDelete: () => void;
}

const UNIFIED_BLUE_GRADIENT = "linear-gradient(135deg, var(--mantine-color-blue-9) 0%, var(--mantine-color-blue-7) 100%)";

const categoryConfig: Record<string, { color: string; gradient: string; accent: string }> = {
    sports: {
        color: "green",
        gradient: UNIFIED_BLUE_GRADIENT,
        accent: "var(--mantine-color-green-4)"
    },
    anime: {
        color: "violet",
        gradient: UNIFIED_BLUE_GRADIENT,
        accent: "var(--mantine-color-violet-3)"
    },
    gaming: {
        color: "grape",
        gradient: UNIFIED_BLUE_GRADIENT,
        accent: "var(--mantine-color-grape-3)"
    },
    coding: {
        color: "dark",
        gradient: UNIFIED_BLUE_GRADIENT,
        accent: "var(--mantine-color-gray-4)"
    },
    technology: {
        color: "blue",
        gradient: UNIFIED_BLUE_GRADIENT,
        accent: "var(--mantine-color-blue-3)"
    },
    music: {
        color: "pink",
        gradient: UNIFIED_BLUE_GRADIENT,
        accent: "var(--mantine-color-pink-3)"
    },
    books: {
        color: "orange",
        gradient: UNIFIED_BLUE_GRADIENT,
        accent: "var(--mantine-color-orange-3)"
    },
    movies: {
        color: "red",
        gradient: UNIFIED_BLUE_GRADIENT,
        accent: "var(--mantine-color-red-3)"
    },
    general: {
        color: "gray",
        gradient: UNIFIED_BLUE_GRADIENT,
        accent: "var(--mantine-color-dimmed)"
    },
};

export function CommunityHeader({
    community,
    isAdmin,
    isJoiningOrLeaving,
    onJoinLeave,
    onDelete,
}: CommunityHeaderProps) {
    const initials = community.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const cat = community.category.toLowerCase();
    const config = categoryConfig[cat] ?? categoryConfig.general;

    return (
        <section className={classes.header}>
            <div
                className={classes.banner}
                style={{ background: config.gradient }}
            >
                <div className={classes.bannerRadial} />
                <div className={classes.bannerGrain} />
            </div>

            <div className={classes.content}>
                <div className={classes.identity}>
                    <Avatar
                        className={classes.avatar}
                        size={88}
                        radius={20}>
                        {initials}
                    </Avatar>

                    <Stack className={classes.identityInfo} gap={6}>
                        <Title order={2} className={classes.title}>
                            {community.name}
                        </Title>

                        <Group 
                            className={classes.metadata} 
                            gap="sm" 
                            wrap="wrap">
                            <Badge
                                className={classes.categoryBadge}
                                color={config.color}
                                variant="light"
                                radius="xl">
                                {community.category}
                            </Badge>

                            <Group 
                                className={classes.memberMeta}
                                 gap={5} 
                                 wrap="nowrap">
                                <IconUsers size={14} />

                                <Text size="sm">
                                    {community.memberCount} members
                                </Text>
                            </Group>

                            <Text 
                                className={classes.creator} 
                                size="sm" 
                                c="dimmed">
                                Created by {community.adminUsername}
                            </Text>
                        </Group>
                    </Stack>
                </div>

                <Text className={classes.description}>
                    {community.description}
                </Text>

                <Group className={classes.actions} gap="xs">
                    <Button
                        size="sm"
                        radius="xl"
                        className={classes.leaveButton}
                        loading={isJoiningOrLeaving}
                        disabled={isJoiningOrLeaving}
                        onClick={onJoinLeave}>
                        {isJoiningOrLeaving
                            ? community.isJoined 
                                ? "Leaving..." : "Joining..."
                            : community.isJoined
                                ? "Leave" : "Join"}
                    </Button>

                    {isAdmin && (
                        <button
                            type="button"
                            className={classes.deleteButton}
                            onClick={onDelete}
                            disabled={isJoiningOrLeaving}
                            aria-label="Delete community">
                            <IconTrash size={16} />
                        </button>
                    )}
                </Group>
            </div>
        </section>
    );
}