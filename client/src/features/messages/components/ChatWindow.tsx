import {
    ActionIcon,
    Avatar,
    Group,
    ScrollArea,
    Stack,
    Text,
    Textarea,
    Skeleton
} from "@mantine/core";
import { IconArrowLeft, IconSend } from "@tabler/icons-react";
import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { socket } from "../../../lib/socket";
import { SOCKETS_EVENTS } from "../../../lib/socketEvent";
import { useTypingStatus } from "../../../components/messaging/useTypingStatus";
import { TypingIndicator } from "../../../components/messaging/TypingIndicator";
import { useConversation } from "../hooks/useConversation";
import { useSendMessage } from "../hooks/useSendMessage";
import { useMarkConversationAsRead } from "../hooks/useMarkConversationAsRead";
import { MessageBubble } from "./MessageBubble";
import { MessageDateSeparator } from "../../../components/messaging/MessageDateSeparator";
import { isSameCalendarDay } from "../../../utils/isSameCalendarDay";
import { usePresence } from "../../../features/presence/hooks/usePresence";
import { OnlineIndicator } from "../../../components/common/OnlineIndicator";

import classes from "../../../styles/messagestyles/ChatWindow.module.css";

interface ChatWindowProps {
    friendId: string;
    currentUserId: string;
    friend: { username: string; avatar: string | null };
    onBack: () => void;
}

function MessageBubbleSkeleton({ align }: { align: "left" | "right" }) {
  return (
    <Group justify={align === "right"? "flex-end" : "flex-start"} style={{ width: "100%" }}>
      <Stack gap={6} style={{ maxWidth: "68%", width: align === "right"? "46%" : "62%" }} align={align === "right"? "flex-end" : "flex-start"}>
        <Skeleton height={align === "right"? 38 : 52} radius={18} />
        <Skeleton height={8} width={36} radius="sm" />
      </Stack>
    </Group>
  );
}

export function ChatWindow({
    friendId,
    currentUserId,
    friend,
    onBack
}: ChatWindowProps) {
    const [content, setContent] = useState("");
    const viewportRef = useRef<HTMLDivElement>(null);
    const isTypingRef = useRef(false);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const { isOnline } = usePresence();

    const { data: isTyping = false } = useTypingStatus(friendId);

    const {
        data: messages = [],
        isPending, isError,
        error } = useConversation(friendId);
    const {
        mutate: sendMessage,
        isPending: isSending } = useSendMessage(currentUserId);

    const { mutate: markAsRead } = useMarkConversationAsRead();

    useEffect(() => {
        const hadUnreadMessages = messages.some((m) => m.senderId === friendId &&!m.isRead);
        if (!hadUnreadMessages) return;
        markAsRead(friendId);
    }, [friendId, markAsRead, messages]);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
    }, [messages, isTyping]);

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            if (isTypingRef.current) {
                socket.emit(SOCKETS_EVENTS.TYPING_STOP, { receiverId: friendId });
                isTypingRef.current = false;
            }
        };
    }, [friendId]);

    const handleTyping = (value: string) => {
        setContent(value);
        if (!value.trim()) {
            if (isTypingRef.current) {
                socket.emit(SOCKETS_EVENTS.TYPING_STOP, { receiverId: friendId });
                isTypingRef.current = false;
            }
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            return;
        }
        if (!isTypingRef.current) {
            socket.emit(SOCKETS_EVENTS.TYPING_START, { receiverId: friendId });
            isTypingRef.current = true;
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit(SOCKETS_EVENTS.TYPING_STOP, { receiverId: friendId });
            isTypingRef.current = false;
        }, 2000);
    };

    const handleSubmit = () => {
        const trimmed = content.trim();
        if (!trimmed || isSending) return;
        sendMessage({ receiverId: friendId, content: trimmed }, { onSuccess: () => setContent("") });
    };

    return (
        <motion.div
            className={classes.chatShell}
            initial={shouldReduceMotion? undefined : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion? undefined : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion? undefined : { duration: 0.28, ease: "easeOut" }}
        >
            <div className={classes.header}>
                <Group gap={10} wrap="nowrap" className={classes.headerMain}>
                    <motion.div whileTap={shouldReduceMotion? undefined : { scale: 0.96 }}>
                        <ActionIcon variant="default" size={28} radius="md" className={classes.backButton} onClick={onBack} aria-label="Back to conversations">
                            <IconArrowLeft size={16} />
                        </ActionIcon>
                    </motion.div>
                    <Avatar size={32} radius={10} src={friend.avatar} className={classes.headerAvatar}>
                        {friend.username.slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Group gap={6} wrap="nowrap" align="center" style={{ minWidth: 0, flex: 1 }}>
                        <Text className={classes.headerName}>{friend.username}</Text>
                        {isOnline(friendId) && (
                            <Group gap={4} wrap="nowrap" align="center">
                                <OnlineIndicator isOnline={true} />
                                <Text size="xs" c="dimmed" fw={500} style={{ fontSize: "11px", lineHeight: 1 }}>Online</Text>
                            </Group>
                        )}
                    </Group>
                </Group>
            </div>

            <ScrollArea className={classes.messagesArea} viewportRef={viewportRef} type="hover">
                <div className={classes.messagesInner}>
                    {isPending? (
                        <Stack gap={10}>
                            <MessageBubbleSkeleton align="left" />
                            <MessageBubbleSkeleton align="right" />
                            <MessageBubbleSkeleton align="left" />
                            <MessageBubbleSkeleton align="right" />
                            <MessageBubbleSkeleton align="left" />
                        </Stack>
                    ) : isError? (
                        <Text c="red" size="sm" className={classes.errorText}>{error.message}</Text>
                    ) : (
                        <Stack gap={2} className={classes.messagesStack}>
                            {messages.map((message, index) => {
                                const prev = index > 0? messages[index - 1] : null;
                                const isNewDay =!prev ||!isSameCalendarDay(prev.createdAt, message.createdAt);
                                return (
                                    <div key={message.id} className={classes.messageBlock}>
                                        {isNewDay && <MessageDateSeparator date={message.createdAt} />}
                                        <MessageBubble message={message} currentUserId={currentUserId} friendId={friendId} />
                                    </div>
                                );
                            })}
                            {isTyping && (
                                <div className={classes.typingWrap}>
                                    <TypingIndicator username={friend.username} />
                                </div>
                            )}
                        </Stack>
                    )}
                </div>
            </ScrollArea>

            <div className={classes.composer}>
                <Textarea
                    placeholder="Write a message..."
                    value={content}
                    onChange={(e) => handleTyping(e.currentTarget.value)}
                    autosize
                    minRows={1}
                    maxRows={4}
                    className={classes.input}
                    classNames={{ input: classes.inputField }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" &&!e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                />
                <ActionIcon size={36} radius="xl" variant="filled" className={classes.sendButton} loading={isSending} disabled={isSending ||!content.trim()} onClick={handleSubmit} aria-label="Send message">
                    <IconSend size={16} />
                </ActionIcon>
            </div>
        </motion.div>
    );
}