import {
    ActionIcon,
    Alert,
    Button,
    Group,
    Modal,
    Stack,
    Container,
    Tabs,
    Text,
    Title,
    UnstyledButton,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

import axios from "axios";
import { useState } from "react";

import { useAuth } from "../features/auth/hook/useAuth";
import { useCommunity } from "../features/community/hooks/useCommunity";
import { useJoinCommunity } from "../features/community/hooks/useJoinCommunity";
import { useLeaveCommunity } from "../features/community/hooks/useLeaveCommunity";
import { useDeleteCommunity } from "../features/community/hooks/useDeleteCommunity";

import { CommunityHeader } from "../components/community/CommunityHeader";
import { CommunityMembers } from "../components/community/CommunityMembers";
import { CommunityDiscussion } from "../components/community/CommunityDiscussion";
import { CommunityPageSkeleton } from "../components/community/CommunityPageSkeleton";

import classes from "../styles/communitystyles/CommunityPage.module.css";

export function CommunityPage() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { communityId = "" } = useParams();
    const [deleteOpened, setDeleteOpened] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const {
        data: community,
        isPending,
        isError,
        error
    } = useCommunity(communityId);

    const {
        mutate: joinCommunity,
        isPending: isJoining
    } = useJoinCommunity();

    const {
        mutate: leaveCommunity,
        isPending: isLeaving
    } = useLeaveCommunity();

    const {
        mutate: deleteCommunity,
        isPending: isDeleting
    } = useDeleteCommunity();

    if (isPending) {
        return <CommunityPageSkeleton />;
    }

    if (isError) {
        const isDeletedCommunity =
            axios.isAxiosError(error) && error.response?.status === 404;
        if (isDeletedCommunity) {
            return (
                <Container size="xl" py={{ base: "md", md: "xl" }}>
                    <Stack align="center" justify="center" gap="sm" mih="50vh">
                        <IconAlertCircle size={40} stroke={1.5} opacity={0.5} />
                        <Title order={3} fw={600}>Community no longer available</Title>
                        <Text c="dimmed" ta="center" size="sm">This community has been deleted or no longer exists.</Text>
                        <Button variant="light" radius="xl" size="xs" mt="xs" onClick={() => navigate("/")}>Back to Explore</Button>
                    </Stack>
                </Container>
            );
        }
        return (
            <Container size="xl" py={{ base: "md", md: "xl" }}>
                <Alert color="red" icon={<IconAlertCircle size={16} />}>{error.message}</Alert>
            </Container>
        );
    }

    const isAdmin = user?._id === community.adminId;

    const handleJoinLeave = () => {
        if (!isAuthenticated) { navigate("/login"); return; }
        if (community.isJoined) leaveCommunity(communityId)
        else joinCommunity(communityId);
    };

    const handleDelete = () => {
        deleteCommunity(communityId, { onSuccess: () => setDeleteOpened(false) });
    };

    return (
        <>
            <Container size="xl" py={{ base: "md", md: "xl" }}>
                <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={shouldReduceMotion ? undefined : { duration: 0.4, ease: "easeOut" }}
                >
                    <Stack gap={0}>
                    <UnstyledButton
                        className={classes.backButton}
                        onClick={() => navigate(-1)}
                    >
                        <ActionIcon variant="transparent" size={20} className={classes.backIcon} aria-hidden>
                        <IconArrowLeft size={16} />
                        </ActionIcon>
                        <Text size="sm" className={classes.backText}>Back</Text>
                    </UnstyledButton>

                    <div className={classes.headerWrap}>
                        <CommunityHeader
                        community={community}
                        isAdmin={isAdmin}
                        isJoiningOrLeaving={isJoining || isLeaving}
                        onJoinLeave={handleJoinLeave}
                        onDelete={() => setDeleteOpened(true)}
                        />
                    </div>

                    <Tabs defaultValue="discussion" className={classes.tabs} keepMounted={false}>
                        <Tabs.List className={classes.tabsList}>
                        <Tabs.Tab value="discussion" className={classes.tab}>Discussion</Tabs.Tab>
                        <Tabs.Tab value="members" className={classes.tab}>Members</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="discussion" pt="md" className={classes.tabPanel}>
                        <CommunityDiscussion communityId={communityId} isJoined={community.isJoined} />
                        </Tabs.Panel>
                        <Tabs.Panel value="members" pt="md" className={classes.tabPanel}>
                        <CommunityMembers communityId={communityId} memberCount={community.memberCount} />
                        </Tabs.Panel>
                    </Tabs>
                    </Stack>
                </motion.div>

                <Modal opened={deleteOpened} onClose={() => { if (!isDeleting) setDeleteOpened(false); }} title="Delete Community" centered radius="lg" classNames={{ title: classes.modalTitle }}>
                    <Stack gap="md">
                        <Text size="sm">Are you sure you want to permanently delete <Text span fw={600}>{community.name}</Text>?</Text>
                        <Text size="xs" c="dimmed">This will delete the community and its messages. This action cannot be undone.</Text>
                        <Group justify="flex-end" gap="xs">
                            <Button variant="default" size="xs" radius="xl" onClick={() => setDeleteOpened(false)} disabled={isDeleting}>Cancel</Button>
                            <Button color="red" size="xs" radius="xl" loading={isDeleting} onClick={handleDelete}>Delete Community</Button>
                        </Group>
                    </Stack>
                </Modal>
            </Container>
        </>
    );
}