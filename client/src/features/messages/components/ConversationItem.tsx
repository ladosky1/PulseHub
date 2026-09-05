import { Avatar, Group, Stack, Text } from "@mantine/core";
import { motion, useReducedMotion } from "motion/react";
import type { Friend, Conversation } from "../../../types";
import classes from "../../../styles/messagestyles/ConversationItem.module.css";

interface ConversationItemProps {
    friend: Friend;
    conversation?: Conversation;
    selected: boolean;
    onClick: () => void;
}

export function ConversationItem({ friend, conversation, selected, onClick }: ConversationItemProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className={`${classes.row} ${selected ? classes.selected : ""} ${conversation?.unreadCount ? classes.hasUnread : ""}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
            initial={shouldReduceMotion? undefined : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion? undefined : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion? undefined : { duration: 0.28, ease: "easeOut" }}
            whileTap={shouldReduceMotion? undefined : { scale: 0.99 }}
        >
            <Avatar size={36} radius={12} src={friend.avatar} className={classes.avatar}>
                {friend.username.slice(0, 2).toUpperCase()}
            </Avatar>

            <Stack gap={2} className={classes.info}>
                <Group gap={6} wrap="nowrap" justify="space-between" className={classes.topRow}>
                    <Text className={classes.username} title={friend.username}>{friend.username}</Text>
                    {conversation && conversation.unreadCount > 0 && (
                        <span className={classes.unreadBadge}>{conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}</span>
                    )}
                </Group>

                <Text size="xs" className={classes.preview} truncate="end">
                    {conversation ? conversation.lastMessage : "No messages yet"}
                </Text>
            </Stack>
        </motion.div>
    );
}