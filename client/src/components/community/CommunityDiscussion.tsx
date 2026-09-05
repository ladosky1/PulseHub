import {
    ActionIcon,
    Group,
    Paper,
    ScrollArea,
    Stack,
    Text,
    Button,
    TextInput,
    Skeleton
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useAuth } from "../../features/auth/hook/useAuth";
import { useCommunitySocket } from "../../features/community/hooks/useCommunitySocket";
import { useCommunityMessages } from "../../features/community/hooks/useCommunityMessages";
import { useSendCommunityMessage } from "../../features/community/hooks/useSendCommunityMessage";
import { MessageDateSeparator } from "../messaging/MessageDateSeparator";
import { isSameCalendarDay } from "../../utils/isSameCalendarDay";
import classes from "../../styles/communitystyles/CommunityDiscussion.module.css";

function DiscussionSkeleton() {
  return (
    <Stack gap={14}>
      <Group justify="flex-start">
        <Stack gap={6} style={{ maxWidth: "68%", width: "68%" }}>
          <Skeleton height={10} width={56} radius="sm" />
          <Skeleton height={42} radius={16} />
          <Skeleton height={8} width={36} radius="sm" />
        </Stack>
      </Group>
      <Group justify="flex-end">
        <Stack gap={6} align="flex-end" style={{ maxWidth: "68%", width: "58%" }}>
          <Skeleton height={36} radius={16} />
          <Skeleton height={8} width={36} radius="sm" />
        </Stack>
      </Group>
      <Group justify="flex-start">
        <Stack gap={6} style={{ maxWidth: "60%", width: "60%" }}>
          <Skeleton height={10} width={48} radius="sm" />
          <Skeleton height={32} radius={16} />
          <Skeleton height={8} width={30} radius="sm" />
        </Stack>
      </Group>
      <Group justify="flex-end">
        <Stack gap={6} align="flex-end" style={{ maxWidth: "68%", width: "72%" }}>
          <Skeleton height={52} radius={16} />
          <Skeleton height={8} width={30} radius="sm" />
        </Stack>
      </Group>
    </Stack>
  );
}

export function CommunityDiscussion({ communityId, isJoined }: { communityId: string; isJoined: boolean }){
    const [content, setContent] = useState("");
    const {user, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const viewportRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();
    const { data: messages = [], isPending } = useCommunityMessages(communityId, isAuthenticated);
    const { mutate: sendMessage, isPending: isSending } = useSendCommunityMessage();
    useCommunitySocket(communityId, isJoined);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        requestAnimationFrame(() => {
            viewport.scrollTo({
                top: viewport.scrollHeight,
                behavior: messages.length <= 10? "auto" : "smooth",
            });
        });
    }, [messages]);

    const handleSend = () => {
        const trimmed = content.trim();
        if (!trimmed || isSending ||!user) return;
        sendMessage(
            { communityId, content: trimmed, sender: { _id: user._id, username: user.username, avatar: user.avatar } },
            { onSuccess: () => setContent("") }
        );
    };

    return(
        <Paper withBorder radius="lg" className={classes.panel}>
            <div className={classes.header}>
                <Text className={classes.headerTitle}>Community Discussion</Text>
                <Text size="xs" className={classes.headerMeta}>{messages.length > 0? `${messages.length} messages` : "Live discussion"}</Text>
            </div>

            <ScrollArea viewportRef={viewportRef} type="scroll" offsetScrollbars scrollbarSize={6} className={classes.scrollArea}>
                <div className={classes.messagesInner}>
                    {!isAuthenticated? (
                        <div className={classes.emptyState}>
                            <Text fw={600} size="sm">Sign in to view discussion</Text>
                            <Button size="xs" variant="light" radius="xl" mt={8} onClick={() => navigate("/login")}>Sign In</Button>
                        </div>
                    ) : isPending? (
                        <DiscussionSkeleton />
                    ) : messages.length === 0? (
                        <div className={classes.emptyState}><Text size="sm" fw={500}>No messages yet</Text><Text size="xs" c="dimmed">Be the first to start</Text></div>
                    ) : (
                        <Stack gap={6}>
                        {messages.map((message: any, index: number) => {
                            const isOwn = message.sender._id === user?._id;
                            const prev = index > 0 ? messages[index - 1] : null;
                            const isNewDay = !prev || !isSameCalendarDay(prev.createdAt, message.createdAt);
                            return (
                            <div key={message._id}>
                                {isNewDay && <MessageDateSeparator date={message.createdAt} />}
                                <motion.div
                                initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                                transition={shouldReduceMotion ? undefined : { duration: 0.22, ease: "easeOut" }}
                                >
                                <Group justify={isOwn ? "flex-end" : "flex-start"} className={classes.bubbleRow} gap={6} wrap="nowrap">
                                    <div className={`${classes.bubble} ${isOwn ? classes.bubbleOwn : classes.bubbleOther}`}>
                                    {!isOwn && <Text className={classes.bubbleUsername}>{message.sender.username}</Text>}
                                    <Text className={classes.bubbleContent}>{message.content}</Text>
                                    <Text className={classes.bubbleTime}>{message.status === "sending" ? "Sending..." : new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                                    </div>
                                </Group>
                                </motion.div>
                            </div>
                            );
                        })}
                        </Stack>
                    )}
                </div>
            </ScrollArea>

            <div className={classes.composer}>
                {!isAuthenticated? (
                    <Text size="xs" c="dimmed" ta="center">Sign in to join discussion</Text>
                ) : isJoined? (
                    <Group gap={8} wrap="nowrap">
                        <TextInput flex={1} radius="xl" size="sm" placeholder="Write a message..." value={content} onChange={(e) => setContent(e.currentTarget.value)} onKeyDown={(e) => { if(e.key === "Enter" &&!e.shiftKey){ e.preventDefault(); handleSend(); }}} className={classes.input}/>
                        <ActionIcon size={36} radius="xl" variant="filled" className={classes.sendButton} disabled={!content.trim() || isSending} onClick={handleSend}><IconSend size={16}/></ActionIcon>
                    </Group>
                ) : (
                    <Text size="xs" c="dimmed" ta="center">Join to participate</Text>
                )}
            </div>
        </Paper>
    )
}