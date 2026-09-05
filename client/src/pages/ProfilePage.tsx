import {
    Alert,
    Avatar,
    Container,
    Group,
    Paper,
    Stack,
    Text,
    Title,
    Skeleton,
} from "@mantine/core";
import { IconAlertCircle, IconUsers } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { useAuth } from "../features/auth/hook/useAuth";
import { useUserProfile } from "../features/users/hook/useUserProfile";
import classes from "../styles/ProfilePage.module.css";
import watermark from "../assets/pulsehub-mark.svg";

function ProfileSkeleton() {
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
        <Group justify="center" gap={16} className={classes.statsRow}>
          <Stack gap={4} align="center">
            <Skeleton height={16} width={24} radius="sm" />
            <Skeleton height={10} width={42} radius="sm" />
          </Stack>
        </Group>
      </Paper>
    </div>
  );
}

export function ProfilePage() {
    const { user: currentUser } = useAuth();
    const shouldReduceMotion = useReducedMotion();

    const { data: user, isPending, isError, error } = useUserProfile(currentUser?._id ?? "");

    if (isPending) {
        return (
            <Container size="xl" py={{ base: "md", md: "xl" }} className={classes.container}>
                <div className={classes.profileStage}>
                    <img src={watermark} alt="" aria-hidden className={classes.watermark} />
                    <ProfileSkeleton />
                </div>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container size="xl" py={{ base: "md", md: "xl" }}>
                <div className={classes.centerConstrain}>
                    <Alert color="red" icon={<IconAlertCircle size={16} />} radius="md" className={classes.alert}>
                        {error.message}
                    </Alert>
                </div>
            </Container>
        );
    }

    const initials = user.username.slice(0, 2).toUpperCase();

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
                                <Title order={2} className={classes.username}>{user.username}</Title>
                                <Group gap={6} className={classes.metaRow}>
                                    <span className={classes.metaIconWrap}><IconUsers size={14} /></span>
                                    <Text className={classes.friendCount}>{user.friendCount} {user.friendCount === 1 ? "friend" : "friends"}</Text>
                                </Group>
                                <Text className={classes.joinedDate}>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</Text>
                            </Stack>
                        </Stack>
                        <div className={classes.divider} />
                        <Group justify="center" gap={16} className={classes.statsRow}>
                            <Stack gap={2} align="center">
                                <Text className={classes.statValue}>{user.friendCount}</Text>
                                <Text className={classes.statLabel}>Friends</Text>
                            </Stack>
                        </Group>
                    </Paper>
                </motion.div>
            </div>
        </Container>
    );
}