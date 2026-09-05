import {
    Alert,
    Avatar,
    Badge,
    Container,
    Group,
    Loader,
    Paper,
    Stack,
    Tabs,
    Text,
    Title,
    Button,
    TextInput,
    UnstyledButton,
    Skeleton
} from "@mantine/core";
import {
    IconAlertCircle,
    IconSearch,
    IconUsers
} from "@tabler/icons-react";

import { useFriends } from "../features/friends/hooks/useFriend";
import { useFriendRequests } from "../features/friends/hooks/useFriendRequests";
import { useRemoveFriend } from "../features/friends/hooks/useRemoveFriend";
import { useAcceptFriendRequest } from "../features/friends/hooks/useAcceptFriendRequest";
import { useRejectFriendRequest } from "../features/friends/hooks/useRejectFriendRequest";
import { usePresence } from "../features/presence/hooks/usePresence";
import { OnlineIndicator } from "../components/common/OnlineIndicator";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedValue } from "@mantine/hooks";
import { motion, useReducedMotion } from "motion/react";

import { useSearchUsers } from "../features/users/hook/useSearchUsers";

import classes from "../styles/friendstyles/FriendPage.module.css";

function FriendRowSkeleton() {
  return (
    <Paper withBorder className={classes.rowCard}>
      <div className={classes.rowMain}>
        <Skeleton height={36} width={36} radius={12} />
        <Stack gap={4} className={classes.rowInfo}>
          <Skeleton height={12} width={92} radius="sm" />
          <Skeleton height={10} width={124} radius="sm" />
        </Stack>
      </div>
      <Skeleton height={28} width={72} radius="xl" />
    </Paper>
  );
}

function RequestRowSkeleton() {
  return (
    <Paper withBorder className={classes.rowCard}>
      <Group gap={10} wrap="nowrap" className={classes.rowMainStatic}>
        <Skeleton height={36} width={36} radius={12} />
        <Stack gap={4} className={classes.rowInfo}>
          <Skeleton height={12} width={92} radius="sm" />
          <Skeleton height={10} width={132} radius="sm" />
        </Stack>
      </Group>
      <Group gap={6} wrap="nowrap">
        <Skeleton height={28} width={64} radius="xl" />
        <Skeleton height={28} width={64} radius="xl" />
      </Group>
    </Paper>
  );
}

export function FriendsPage(){
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();
    const [acceptingId, setAcceptingId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [usernameSearch, setUsernameSearch] = useState("");
    const [debounceUsername] = useDebouncedValue(usernameSearch, 400);
    const { isOnline } = usePresence();

    const {
        data: searchResults = [],
        isPending: isSearching,
        isError: isSearchError,
        error: searchError
    } = useSearchUsers(debounceUsername);

    const {
        data: friends = [],
        isPending: isFriendsPending,
        isError: isFriendsError,
        error: friendsError
    } = useFriends();

    const {
        data: requests = [],
        isPending: isRequestsPending,
        isError: isRequestsError,
        error: requestsError
    } = useFriendRequests();

    const { mutate: acceptRequest } = useAcceptFriendRequest();
    const { mutate: rejectRequest } = useRejectFriendRequest();
    const { mutate: removeFriend } = useRemoveFriend();

    const entrance = shouldReduceMotion? undefined : { opacity: 0, y: 6 };
    const entranceTo = shouldReduceMotion? undefined : { opacity: 1, y: 0 };
    const entranceTransition = shouldReduceMotion? undefined : { duration: 0.28, ease: "easeOut" as const };
    const press = shouldReduceMotion? undefined : { scale: 0.99 };

    return(
        <Container
            size="xl"
            py={{ base: "md", md: "xl" }}>
            <Stack
                gap={0}
                className={classes.pageStack}>
                <Stack
                    gap={2}
                    className={classes.pageHeader}>
                    <Title
                        order={2}
                        className={classes.title}>
                        Friends
                    </Title>

                    <Text
                        size="sm"
                        className={classes.subtitle}>
                        Manage your connections on PulseHub
                    </Text>
                </Stack>

                <Tabs
                    defaultValue="friends"
                    className={classes.tabs}>
                    <Tabs.List className={classes.tabsList}>
                        <Tabs.Tab
                            value="friends"
                            leftSection={<IconUsers size={15}/>}
                            className={classes.tab}>
                            My Friends
                        </Tabs.Tab>

                        <Tabs.Tab
                            value="requests"
                            className={classes.tab}>
                            Friend Requests
                            {requests.length > 0 &&
                                <Badge
                                    size="xs"
                                    radius="xl"
                                    className={classes.requestBadge}>
                                    {requests.length}
                                </Badge>
                            }
                        </Tabs.Tab>

                        <Tabs.Tab
                            value="find-people"
                            className={classes.tab}>
                            Find People
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel
                        value="friends"
                        pt="md"
                        className={classes.tabPanel}>
                        {isFriendsPending? (
                            <div className={classes.grid}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FriendRowSkeleton key={i} />
                                ))}
                            </div>
                        ) : isFriendsError? (
                            <Alert
                                color="red"
                                icon={<IconAlertCircle size={16}/> }
                                radius="md"
                                className={classes.alert}>
                                {friendsError.message}
                            </Alert>
                        ) : friends.length === 0? (
                            <Paper
                                withBorder
                                radius="lg"
                                className={classes.emptyPanel}>
                                <div className={classes.emptyState}>
                                    <div className={classes.emptyIcon}>
                                        <IconUsers size={22} />
                                    </div>

                                    <Text fw={600} size="sm">
                                        No friends yet
                                    </Text>

                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        className={classes.emptyHint}>
                                        Find people on PulseHub and send them a request
                                    </Text>
                                </div>
                            </Paper>
                        ) : (
                            <div className={classes.grid}>
                                {friends.map((friend) => (
                                    <motion.div
                                        key={friend.id}
                                        initial={entrance}
                                        animate={entranceTo}
                                        transition={entranceTransition}
                                    >
                                        <Paper
                                            withBorder
                                            className={classes.rowCard}>
                                            <motion.div whileTap={press} style={{ display: "contents" }}>
                                                <UnstyledButton
                                                    className={classes.rowMain}
                                                    onClick={() => navigate(`/users/${friend.id}`)}>
                                                    <div className={classes.avatarWrap}>
                                                        <Avatar
                                                            size={36}
                                                            radius={12}
                                                            className={classes.rowAvatar}>
                                                            {friend.username.slice(0, 2).toUpperCase()}
                                                        </Avatar>

                                                        <span className={classes.presenceDot}>
                                                            <OnlineIndicator isOnline={isOnline(friend.id)} />
                                                        </span>
                                                    </div>

                                                    <Stack
                                                        gap={1}
                                                        className={classes.rowInfo}>
                                                        <Text className={classes.rowName}>
                                                            {friend.username}
                                                        </Text>

                                                        <Text className={classes.rowMeta}>
                                                            Friend • View profile
                                                        </Text>
                                                    </Stack>
                                                </UnstyledButton>
                                            </motion.div>

                                            <Button
                                                size="xs"
                                                variant="default"
                                                radius="xl"
                                                className={classes.subtleDanger}
                                                loading={removingId === friend.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setRemovingId(friend.id);
                                                    removeFriend(friend.id, {
                                                         onSettled: () => setRemovingId(null)
                                                    }) }
                                                }>
                                                    Remove
                                            </Button>
                                        </Paper>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </Tabs.Panel>

                    <Tabs.Panel value="requests" pt="md" className={classes.tabPanel}>
                        {isRequestsPending? (
                            <Stack gap={6} className={classes.list}>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <RequestRowSkeleton key={i} />
                                ))}
                            </Stack>
                        ) : isRequestsError? (
                            <Alert color="red" icon={<IconAlertCircle size={16}/>} radius="md" className={classes.alert}>{requestsError.message}</Alert>
                        ) : requests.length === 0? (
                            <Paper withBorder radius="lg" className={classes.emptyPanel}>
                                <div className={classes.emptyState}>
                                    <div className={classes.emptyIcon}><IconUsers size={22} /></div>
                                    <Text fw={600} size="sm">No friend requests</Text>
                                    <Text size="xs" c="dimmed" className={classes.emptyHint}>New requests will appear here</Text>
                                </div>
                            </Paper>
                        ) : (
                            <Stack gap={6} className={classes.list}>
                                {requests.map((request) => (
                                    <motion.div
                                        key={request.id}
                                        initial={entrance}
                                        animate={entranceTo}
                                        transition={entranceTransition}
                                    >
                                        <Paper withBorder className={classes.rowCard}>
                                            <Group gap={10} wrap="nowrap" className={classes.rowMainStatic}>
                                                <Avatar size={36} radius={12} src={request.sender.avatar} className={classes.rowAvatar}>{request.sender.username.slice(0, 2).toUpperCase()}</Avatar>
                                                <Stack gap={1} className={classes.rowInfo}>
                                                    <Text className={classes.rowName}>{request.sender.username}</Text>
                                                    <Text className={classes.rowMeta}>Wants to be your friend</Text>
                                                </Stack>
                                            </Group>
                                            <Group gap={6} wrap="nowrap">
                                                <Button size="xs" radius="xl" className={classes.primaryAction} loading={acceptingId === request.id} onClick={() => { setAcceptingId(request.id); acceptRequest(request.id, { onSettled: () => setAcceptingId(null) }); }}>Accept</Button>
                                                <Button size="xs" variant="default" radius="xl" className={classes.subtleDanger} loading={rejectingId === request.id} onClick={() => { setRejectingId(request.id); rejectRequest(request.id, { onSettled: () => setRejectingId(null) }); }}>Reject</Button>
                                            </Group>
                                        </Paper>
                                    </motion.div>
                                ))}
                            </Stack>
                        )}
                    </Tabs.Panel>

                    <Tabs.Panel value="find-people" pt="md" className={classes.tabPanel}>
                        <Stack gap={12}>
                            <div className={classes.searchWrap}>
                                <TextInput
                                    placeholder="Search username..."
                                    value={usernameSearch}
                                    onChange={(e) => setUsernameSearch(e.currentTarget.value)}
                                    leftSection={<IconSearch size={14} />}
                                    radius="xl"
                                    size="sm"
                                    className={classes.searchInput}
                                />
                            </div>

                            {usernameSearch.trim().length < 2? (
                                <Paper withBorder radius="lg" className={classes.emptyPanel}>
                                    <Text ta="center" c="dimmed" size="xs" className={classes.hintCenter}>Enter at least 2 characters to search</Text>
                                </Paper>
                            ) : isSearching? (
                                <div className={classes.emptyState}><Loader size="sm" mx="auto"/></div>
                            ) : isSearchError? (
                                <Alert color="red" icon={<IconAlertCircle size={16}/>} radius="md" className={classes.alert}>{searchError.message}</Alert>
                            ) : searchResults.length === 0? (
                                <Paper withBorder radius="lg" className={classes.emptyPanel}>
                                    <div className={classes.emptyState}>
                                        <div className={classes.emptyIcon}><IconUsers size={22} /></div>
                                        <Text fw={600} size="sm">No users found</Text>
                                        <Text size="xs" c="dimmed" className={classes.emptyHint}>Try a different username</Text>
                                    </div>
                                </Paper>
                            ) : (
                                <Stack gap={6} className={classes.list}>
                                    {searchResults.map((user) => (
                                        <motion.div
                                            key={user.id}
                                            initial={entrance}
                                            animate={entranceTo}
                                            transition={entranceTransition}
                                            whileTap={press}
                                        >
                                            <UnstyledButton className={classes.rowCardButton} onClick={() => navigate(`/users/${user.id}`)}>
                                                <div className={classes.avatarWrap}>
                                                    <Avatar
                                                        size={36}
                                                        radius={12}
                                                        src={user.avatar}
                                                        className={classes.rowAvatar}>
                                                        {user.username.slice(0, 2).toUpperCase()}
                                                    </Avatar>

                                                    <span className={classes.presenceDot}>
                                                        <OnlineIndicator isOnline={isOnline(user.id)} />
                                                    </span>
                                                </div>
                                                <Stack gap={1} className={classes.rowInfo}>
                                                    <Text className={classes.rowName}>{user.username}</Text>
                                                    <Text className={classes.rowMeta}>View profile</Text>
                                                </Stack>
                                            </UnstyledButton>
                                        </motion.div>
                                    ))}
                                </Stack>
                            )}
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </Container>
    )
}