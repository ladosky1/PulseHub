import { Alert, Avatar, Button, Container, Group, Paper, Stack, Text, Title, Skeleton } from "@mantine/core";
import { IconAlertCircle, IconUsers } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserProfile } from "../features/users/hook/useUserProfile";
import { useSendFriendRequest } from "../features/friends/hooks/useSendFriendRequest";
import { useFriendRequests } from "../features/friends/hooks/useFriendRequests";
import { useAcceptFriendRequest } from "../features/friends/hooks/useAcceptFriendRequest";
import { useRejectFriendRequest } from "../features/friends/hooks/useRejectFriendRequest";
import { usePresence } from "../features/presence/hooks/usePresence";
import { OnlineIndicator } from "../components/common/OnlineIndicator";
import classes from "../styles/UserProfilePage.module.css";
import watermark from "../assets/pulsehub-watermark-dark.svg";

function UserProfileSkeleton() {
  return (
    <div className={classes.centerConstrain}>
      <Paper withBorder className={classes.profileCard}>
        <Stack align="center" gap={0} className={classes.cardInner}>
          <Skeleton height={80} width={80} radius={20} />
          <Stack align="center" gap={10} mt={16} className={classes.identity}>
            <Skeleton height={22} width={140} radius="sm" />
            <Skeleton height={12} width={96} radius="sm" />
            <Skeleton height={10} width={120} radius="sm" />
          </Stack>
        </Stack>
        <div className={classes.divider} />
        <div className={classes.actionArea}>
          <Skeleton height={32} width={110} radius="xl" />
        </div>
      </Paper>
    </div>
  );
}

export function UserProfilePage() {
    const navigate = useNavigate();
    const { userId = "" } = useParams();
    const shouldReduceMotion = useReducedMotion();
    const { isOnline } = usePresence();

    const { data: user, isPending, isError, error } = useUserProfile(userId);
    const { mutate: sendFriendRequest, isPending: isSending } = useSendFriendRequest();
    const { data: requests = [], isPending: isRequestsPending } = useFriendRequests();
    const { mutate: acceptRequest, isPending: isAccepting } = useAcceptFriendRequest();
    const { mutate: rejectRequest, isPending: isRejecting } = useRejectFriendRequest();

    if (isPending) {
        return (
            <Container size="xl" py={{ base: "md", md: "xl" }} className={classes.container}>
                <div className={classes.profileStage}>
                    <img src={watermark} alt="" aria-hidden className={classes.watermark} />
                    <UserProfileSkeleton />
                </div>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container size="xl" py={{ base: "md", md: "xl" }}>
                <div className={classes.centerConstrain}>
                    <Alert color="red" icon={<IconAlertCircle size={16} />} radius="md" className={classes.alert}>{error.message}</Alert>
                </div>
            </Container>
        );
    }

    const incomingRequest = requests.find((request) => request.sender.id === user.id);
    const initials = user.username.slice(0, 2).toUpperCase();
    const userIsOnline = isOnline(user.id);

    return (
        <Container size="xl" py={{ base: "md", md: "xl" }} className={classes.container}>
            <div className={classes.profileStage}>
                <img src={watermark} alt="" aria-hidden className={classes.watermark} />
                <motion.div
                    className={classes.centerConstrain}
                    initial={shouldReduceMotion? false : { opacity: 0, y: 8 }}
                    animate={shouldReduceMotion? undefined : { opacity: 1, y: 0 }}
                    transition={shouldReduceMotion? undefined : { duration: 0.4, ease: "easeOut" }}
                >
                    <Paper withBorder className={classes.profileCard}>
                        <Stack align="center" gap={0} className={classes.cardInner}>
                            <Avatar size={80} radius={20} src={user.avatar} className={classes.avatar}>{initials}</Avatar>
                            <Stack align="center" gap={6} className={classes.identity}>
                                <Group gap={8} justify="center" align="center" wrap="nowrap">
                                    <Title order={2} className={classes.username}>{user.username}</Title>
                                    {userIsOnline && (
                                        <Group gap={4} align="center" wrap="nowrap">
                                            <OnlineIndicator isOnline={true} />
                                            <Text size="xs" c="dimmed" fw={500} style={{ fontSize: "11px", letterSpacing: "0.01em" }}>Online</Text>
                                        </Group>
                                    )}
                                </Group>
                                <Group gap={6} className={classes.metaRow}>
                                    <span className={classes.metaIconWrap}><IconUsers size={14} /></span>
                                    <Text className={classes.friendCount}>{user.friendCount} {user.friendCount === 1 ? "friend" : "friends"}</Text>
                                </Group>
                                <Text className={classes.joinedDate}>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</Text>
                            </Stack>
                        </Stack>
                        <div className={classes.divider} />
                        <div className={classes.actionArea}>
                            {user.relationship === "none" && (<Button radius="xl" size="xs" className={classes.primaryAction} loading={isSending} onClick={() => sendFriendRequest({ receiverId: user.id })}>Add Friend</Button>)}
                            {user.relationship === "request_sent" && (<Button radius="xl" size="xs" variant="default" className={classes.subduedAction} disabled>Request Sent</Button>)}
                            {user.relationship === "request_received" && (
                                <Group gap={8} justify="center" wrap="nowrap" className={classes.acceptRejectGroup}>
                                    <Button radius="xl" size="xs" className={classes.primaryAction} loading={isAccepting} disabled={isAccepting || isRejecting || isRequestsPending || !incomingRequest} onClick={() => { if (!incomingRequest) return; acceptRequest(incomingRequest.id); }}>Accept</Button>
                                    <Button radius="xl" size="xs" variant="default" className={classes.dangerAction} loading={isRejecting} disabled={isAccepting || isRejecting || isRequestsPending || !incomingRequest} onClick={() => { if (!incomingRequest) return; rejectRequest(incomingRequest.id); }}>Reject</Button>
                                </Group>
                            )}
                            {user.relationship === "friends" && (<Button radius="xl" size="xs" className={classes.primaryAction} onClick={() => navigate(`/messages?friend=${user.id}`)}>Message</Button>)}
                            {user.relationship === "self" && (<Button radius="xl" size="xs" variant="default" className={classes.subduedAction} disabled>Your Profile</Button>)}
                        </div>
                    </Paper>
                </motion.div>
            </div>
        </Container>
    );
}