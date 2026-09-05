import {
    Alert,
    Avatar,
    Group,
    Paper,
    Stack,
    Text,
    UnstyledButton,
    Skeleton
} from "@mantine/core";
import { IconAlertCircle, IconChevronRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import axios from "axios";
import { useCommunityMembers } from "../../features/community/hooks/useCommunityMembers";
import { useAuth } from "../../features/auth/hook/useAuth";
import { usePresence } from "../../features/presence/hooks/usePresence";
import { OnlineIndicator } from "../common/OnlineIndicator";
import classes from "../../styles/communitystyles/CommunityMember.module.css";

interface CommunityMembersProps {
    communityId: string;
    memberCount: number;
}

function MembersSkeleton() {
  return (
    <Stack gap={0} className={classes.list}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={classes.memberRow}>
          <Group gap={10} wrap="nowrap" className={classes.memberMain}>
            <Skeleton circle height={36} width={36} />
            <Stack gap={4}>
              <Skeleton height={12} width={90} radius="sm" />
              <Skeleton height={10} width={60} radius="sm" />
            </Stack>
          </Group>
          <Skeleton height={14} width={14} circle />
        </div>
      ))}
    </Stack>
  );
}

export function CommunityMembers({ communityId, memberCount }: CommunityMembersProps) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const shouldReduceMotion = useReducedMotion();
    const { isOnline } = usePresence();
    const { data: members = [], isPending, isError, error } = useCommunityMembers(communityId, isAuthenticated);

    const onlineCount = members.filter((m) => isOnline(m.id)).length;

    const PanelWrapper = ({ children }: { children: React.ReactNode }) => (
        <Paper withBorder radius="lg" className={classes.panel}>{children}</Paper>
    );

    if (!isAuthenticated) {
        return (
            <PanelWrapper>
                <div className={classes.emptyState}>
                    <Text fw={600} size="sm">Sign in to view members</Text>
                    <Text size="xs" c="dimmed" className={classes.emptyHint}>Members are visible to signed-in users</Text>
                </div>
            </PanelWrapper>
        );
    }

    if (isPending) {
        return (
            <Paper withBorder radius="lg" className={classes.panel}>
                <div className={classes.subHeader}>
                    <Skeleton height={10} width={70} />
                </div>
                <MembersSkeleton />
            </Paper>
        );
    }

    if (isError) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            return (
                <PanelWrapper>
                    <div className={classes.emptyState}>
                        <Text fw={500} size="sm">Join to view members</Text>
                        <Text size="xs" c="dimmed" className={classes.emptyHint}>You need to be a member of this community</Text>
                    </div>
                </PanelWrapper>
            );
        }
        return (
            <PanelWrapper>
                <div className={classes.errorWrap}>
                    <Alert color="red" icon={<IconAlertCircle size={16} />} className={classes.alert}>{error.message}</Alert>
                </div>
            </PanelWrapper>
        );
    }

    return (
        <Paper withBorder radius="lg" className={classes.panel}>
            <div className={classes.subHeader}>
                <Text size="xs" className={classes.subHeaderText}>
                    {memberCount} {memberCount === 1? "member" : "members"}
                    {onlineCount > 0 && (
                        <Text component="span" className={classes.onlineCount}> · {onlineCount} online</Text>
                    )}
                </Text>
            </div>
            <Stack gap={0} className={classes.list}>
                {members.map((member) => (
                    <UnstyledButton
                        key={member.id}
                        component={motion.button}
                        whileTap={shouldReduceMotion? undefined : { scale: 0.99 }}
                        className={classes.memberRow}
                        onClick={() => navigate(`/users/${member.id}`)}
                    >
                        <Group gap={10} wrap="nowrap" className={classes.memberMain}>
                            <div className={classes.avatarWrap}>
                                <Avatar radius={12} size={36} src={member.avatar} className={classes.memberAvatar}>{member.username.slice(0, 2).toUpperCase()}</Avatar>
                                <span className={classes.presenceDot}>
                                    <OnlineIndicator isOnline={isOnline(member.id)} />
                                </span>
                            </div>
                            <Stack gap={1} className={classes.memberInfo}>
                                <Text className={classes.username}>{member.username}</Text>
                                <Text className={classes.profileLink}>View profile</Text>
                            </Stack>
                        </Group>
                        <IconChevronRight size={14} className={classes.chevron} />
                    </UnstyledButton>
                ))}
            </Stack>
        </Paper>
    );
}