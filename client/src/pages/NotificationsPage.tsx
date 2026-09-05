import {
    ActionIcon,
    Alert,
    Avatar,
    Badge,
    Button,
    Container,
    Group,
    Modal,
    Paper,
    Stack,
    Text,
    Title,
    Skeleton,
} from "@mantine/core";
import {
    IconAlertCircle,
    IconBell,
    IconCheck,
    IconTrash
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useNotifications } from "../features/notifications/hook/useNotification";
import { useMarkAllNotificationsAsRead } from "../features/notifications/hook/useMarkAllNotificationsAsRead";
import { useMarkNotificationAsRead } from "../features/notifications/hook/useMarkNotificationAsRead";
import { useDeleteNotification } from "../features/notifications/hook/useDeleteNotification";
import { useDeleteAllNotifications } from "../features/notifications/hook/useDeleteAllNotifications";
import classes from "../styles/notificationstyles/NotificationPage.module.css";

function getNotificationMessage(type: string, username: string) {
    switch (type) {
        case "friend:request-received":
            return `${username} sent you a friend request.`;
        case "friend:request-accepted":
            return `${username} accepted your friend request.`;
        case "friend:request-rejected":
            return `${username} rejected your friend request.`;
        case "friend:removed":
            return `${username} removed you as a friend.`;
        default: return `${username} interacted with you.`;
    }
}

function NotificationRowSkeleton() {
  return (
    <Paper withBorder className={classes.row}>
      <Group wrap="nowrap" align="flex-start" gap={10} className={classes.rowMain}>
        <Skeleton height={36} width={36} radius={12} />
        <Stack gap={6} className={classes.textStack} style={{ flex: 1 }}>
          <Skeleton height={12} width="68%" radius="sm" />
          <Skeleton height={10} width="38%" radius="sm" />
        </Stack>
      </Group>
      <Group gap={4} wrap="nowrap" className={classes.rowActions}>
        <Skeleton height={28} width={28} radius="md" />
        <Skeleton height={28} width={28} radius="md" />
      </Group>
    </Paper>
  );
}

export function NotificationsPage() {
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();
    const [deleteAllOpened, setDeleteAllOpened] = useState(false);
    const [deletingNotificationId, setDeletingNotificationId] = useState<string | null>(null);

    const {
        data: notifications = [],
        isPending,
        isError,
        error } = useNotifications();

    const { mutate: markAsRead } = useMarkNotificationAsRead();

    const {
        mutate: markAllASRead,
        isPending: isMarkingAll } = useMarkAllNotificationsAsRead();
    const { mutate: deleteNotification } = useDeleteNotification();
    const {
        mutate: deleteAllNotifications,
        isPending: isDeletingAll } = useDeleteAllNotifications();

    const unreadCount = notifications.filter((n) =>!n.isRead).length;

    const handleNotificationClick = (notification: (typeof notifications)[number]) => {
        if (!notification.isRead) markAsRead(notification.id);
        switch (notification.type) {
            case "friend:request-received":
            case "friend:request-accepted":
            case "friend:request-rejected":
            case "friend:removed":
                navigate(`/users/${notification.actor.id}`);
                break;
            default: break;
        }
    };

    return (
        <Container
            size="xl"
            py={{ base: "md", md: "xl" }}
            className={classes.container}>
            <Stack
                gap={0}
                className={classes.pageStack}>
                <Group
                    justify="space-between"
                    align="flex-start"
                    wrap="wrap"
                    className={classes.header}>
                    <Stack
                        gap={2}
                        className={classes.headerLeft}>
                        <Group
                            gap={8}
                            align="center">
                            <Title
                                order={2}
                                className={classes.title}>
                                Notifications
                            </Title>
                            {unreadCount > 0 &&
                                <Badge
                                    size="xs"
                                    radius="xl"
                                    className={classes.unreadBadge}>
                                    {unreadCount}
                                </Badge>
                            }
                        </Group>
                        <Text size="sm" className={classes.subtitle}>Stay up to date with your activity on PulseHub</Text>
                    </Stack>

                    <Group gap={8} wrap="wrap" className={classes.headerActions}>
                        {notifications.length > 0 && (
                            <Button variant="default" size="xs" radius="xl" leftSection={<IconTrash size={14} />} className={classes.actionButton} onClick={() => setDeleteAllOpened(true)}>Delete All</Button>
                        )}
                        {unreadCount > 0 && (
                            <Button size="xs" radius="xl" leftSection={<IconCheck size={14} />} loading={isMarkingAll} className={classes.primaryAction} onClick={() => markAllASRead()}>Mark all as read</Button>
                        )}
                    </Group>
                </Group>

                <div className={classes.content}>
                    {isPending? (
                        <Stack gap={6} className={classes.list}>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <NotificationRowSkeleton key={i} />
                            ))}
                        </Stack>
                    ) : isError? (
                        <Alert color="red" icon={<IconAlertCircle size={16} />} radius="md" className={classes.alert}>{error.message}</Alert>
                    ) : notifications.length === 0? (
                        <Paper withBorder radius="lg" className={classes.emptyPanel}>
                            <div className={classes.emptyState}>
                                <div className={classes.emptyIcon}><IconBell size={22} /></div>
                                <Text fw={600} size="sm">No notifications</Text>
                                <Text size="xs" c="dimmed" className={classes.emptyHint}>You are all caught up</Text>
                            </div>
                        </Paper>
                    ) : (
                        <Stack gap={6} className={classes.list}>
                            {notifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={shouldReduceMotion? undefined : { opacity: 0, y: 6 }}
                                    animate={shouldReduceMotion? undefined : { opacity: 1, y: 0 }}
                                    transition={shouldReduceMotion? undefined : { duration: 0.28, ease: "easeOut" }}
                                    whileTap={shouldReduceMotion? undefined : { scale: 0.99 }}
                                    style={{ willChange: "transform" }}
                                >
                                    <Paper
                                        withBorder
                                        className={`${classes.row} ${!notification.isRead? classes.rowUnread : ""}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        {!notification.isRead && <div className={classes.unreadDot} aria-hidden />}
                                        <Group wrap="nowrap" align="flex-start" gap={10} className={classes.rowMain}>
                                            <Avatar size={36} radius={12} src={notification.actor.avatar} className={classes.avatar}>{notification.actor.username.slice(0, 2).toUpperCase()}</Avatar>
                                            <Stack gap={3} className={classes.textStack}>
                                                <Text className={classes.message}>{getNotificationMessage(notification.type, notification.actor.username)}</Text>
                                                <Text className={classes.time}>{new Date(notification.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</Text>
                                            </Stack>
                                        </Group>

                                        <Group gap={4} wrap="nowrap" className={classes.rowActions}>
                                            {!notification.isRead && (
                                                <ActionIcon
                                                    size={28}
                                                    radius="md"
                                                    variant="default"
                                                    className={classes.checkButton}
                                                    onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                                    aria-label="Mark as read"
                                                >
                                                    <IconCheck size={14} />
                                                </ActionIcon>
                                            )}
                                            <ActionIcon
                                                size={28}
                                                radius="md"
                                                variant="default"
                                                className={classes.deleteButton}
                                                loading={deletingNotificationId === notification.id}
                                                onClick={(e) => { e.stopPropagation(); setDeletingNotificationId(notification.id); deleteNotification(notification.id, { onSettled: () => setDeletingNotificationId(null) }); }}
                                                aria-label="Delete notification"
                                            >
                                                <IconTrash size={14} />
                                            </ActionIcon>
                                        </Group>
                                    </Paper>
                                </motion.div>
                            ))}
                        </Stack>
                    )}
                </div>
            </Stack>

            <Modal opened={deleteAllOpened} onClose={() => setDeleteAllOpened(false)} title="Delete all notifications" centered radius="lg" classNames={{ title: classes.modalTitle }}>
                <Stack gap="md">
                    <Text size="sm">Are you sure you want to delete all your notifications?</Text>
                    <Text size="xs" c="dimmed">This will permanently remove all notifications. This action cannot be undone.</Text>
                    <Group justify="flex-end" gap={8}>
                        <Button variant="default" size="xs" radius="xl" disabled={isDeletingAll} onClick={() => setDeleteAllOpened(false)}>Cancel</Button>
                        <Button color="red" size="xs" radius="xl" loading={isDeletingAll} onClick={() => { deleteAllNotifications(undefined, { onSuccess: () => setDeleteAllOpened(false) }); }}>Delete All</Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}