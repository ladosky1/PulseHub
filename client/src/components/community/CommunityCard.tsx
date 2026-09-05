import {
    Avatar,
    Button,
    Paper,
    Badge,
    Group,
    Stack,
    Text,
} from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

import classes from "../../styles/communitystyles/CommunityCard.module.css"

import { PrimaryButton } from "../buttons";
import type { Community } from "../../types";
import { useJoinCommunity } from "../../features/community/hooks/useJoinCommunity";
import { useLeaveCommunity } from "../../features/community/hooks/useLeaveCommunity";

interface CommunityCardProps{
    community: Community;
}

export function CommunityCard({
    community
}: CommunityCardProps){

    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();

    const {
        mutate: joinCommunity,
        isPending: isJoining,
    } = useJoinCommunity();

    const {
        mutate: leaveCommunity,
        isPending: isLeaving,
    } = useLeaveCommunity();

    const initials = community.name
       .split(" ")
       .map((word) => word[0])
       .join("")
       .slice(0, 2)
       .toUpperCase();

    const avatarColors = [
        "indigo",
        "violet",
        "blue",
        "cyan",
        "teal",
        "green",
        "grape",
    ];

    const avatarColor = avatarColors[
        community.name.length % avatarColors.length
    ];

    const categoryColors: Record<string, string> = {
        anime: "violet",
        gaming: "cyan",
        sports: "green",
        coding: "indigo",
        technology: "blue",
        music: "pink",
        books: "orange",
        movies: "red",
        general: "gray",
    }

    const categoryColor =
        categoryColors[community.category.toLowerCase()]?? "gray";

        return(
        <Paper
            component={motion.div}
            initial={shouldReduceMotion? false : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion? undefined : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion? undefined : { duration: 0.38, ease: "easeOut" }}
            whileTap={shouldReduceMotion? undefined : { scale: 0.988 }}
            className={classes.card}
            radius="lg"
            p={{ base: "md", sm: "lg" }}
            onClick={() => navigate(
                `/communities/${community.id}`
            )}>

            <Stack className={classes.content} gap="md">
                <Group
                    className={classes.cardHeader}
                    justify="space-between"
                    wrap="nowrap">
                    <Group
                        className={classes.identity}
                        gap="sm"
                        wrap="nowrap">
                        <Avatar
                            radius="xl"
                            size="lg"
                            color={avatarColor}
                            variant="filled">
                            {initials}
                        </Avatar>

                        <Stack
                            className={classes.titleBlock}
                            gap={2}>
                            <Text
                                className={classes.communityName}
                                fw={650}
                                size="md"
                                lineClamp={1}>
                                {community.name}
                            </Text>

                            <Text
                                className={classes.creator}
                                size="xs"
                                c="dimmed"
                                lineClamp={1}>
                                Created by {community.adminUsername}
                            </Text>
                        </Stack>
                    </Group>

                    <Badge
                        className={classes.category}
                        variant="light"
                        color={categoryColor}
                        radius="sm"
                        size="sm">
                        {community.category}
                    </Badge>
                </Group>

                <Text
                    className={classes.description}
                    c="dimmed"
                    size="sm"
                    lineClamp={2}>
                    {community.description}
                </Text>

                <Group
                    className={classes.footer}
                    justify="space-between"
                    align="center"
                    wrap="nowrap">
                    <Group
                        className={classes.memberCount}
                        gap={6}
                        wrap="nowrap">
                        <IconUsers
                            size={15}
                            color="var(--mantine-color-dimmed)"/>

                        <Text size="sm" c="dimmed">
                            {community.memberCount}{" "}
                            {community.memberCount === 1
                               ? "member"
                                : "members"}
                        </Text>
                    </Group>

                    {community.isJoined? (
                        <Button
                            className={classes.action}
                            variant="default"
                            size="xs"
                            px="lg"
                            radius="xl"
                            loading={isJoining || isLeaving}
                            disabled={isJoining || isLeaving}
                            onClick={(e) => {
                                e.stopPropagation();
                                leaveCommunity(community.id);
                            }}>
                            Leave
                        </Button>
                    ) : (
                        <PrimaryButton
                            className={classes.action}
                            size="xs"
                            px="lg"
                            radius="xl"
                            loading={isJoining || isLeaving}
                            disabled={isJoining || isLeaving}
                            onClick={(e) => {
                                e.stopPropagation();
                                joinCommunity(community.id);
                            }}>
                            Join
                        </PrimaryButton>
                    )}
                </Group>
            </Stack>
        </Paper>
    )
}