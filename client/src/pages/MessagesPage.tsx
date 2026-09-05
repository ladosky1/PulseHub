import { Alert, Container, Stack, Text, Title, Skeleton, Group } from "@mantine/core";
import { IconAlertCircle, IconMessageCircle, IconUsers } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import { useFriends } from "../features/friends/hooks/useFriend";
import { useConversations } from "../features/messages/hooks/useConversations";
import { useAuth } from "../features/auth/hook/useAuth";
import { ChatWindow } from "../features/messages/components/ChatWindow";
import { ConversationList } from "../features/messages/components/ConversationList";
import classes from "../styles/messagestyles/MessagePage.module.css";

function ConversationRowSkeleton() {
  return (
    <div className={classes.row}>
      <Skeleton height={36} width={36} radius={12} />
      <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
        <Group justify="space-between" gap={8} wrap="nowrap">
          <Skeleton height={12} width={84} radius="sm" />
          <Skeleton height={16} width={18} radius="xl" />
        </Group>
        <Skeleton height={10} width="68%" radius="sm" />
      </Stack>
    </div>
  );
}

export function MessagesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedFriendId = searchParams.get("friend");
    const { user } = useAuth();

    const { data: friends = [], isPending: isFriendsPending, isError: isFriendsError, error: friendsError } = useFriends();
    const { data: conversations = [], isPending: isConversationsPending, isError: isConversationsError, error: conversationsError } = useConversations();

    const selectedFriend = friends.find((friend) => friend.id === selectedFriendId);
    const handleSelectFriend = (friendId: string) => setSearchParams({ friend: friendId });

    const hasSelection = !!selectedFriendId;

    return (
        <Container size="xl" py={{ base: "md", md: "xl" }} className={classes.container}>
            <Stack gap={0} className={classes.pageStack}>
                <Stack gap={2} className={classes.pageHeader}>
                    <Title order={2} className={classes.title}>Messages</Title>
                    <Text size="sm" className={classes.subtitle}>Chat with your friends on PulseHub</Text>
                </Stack>

                <div className={`${classes.layout} ${hasSelection ? classes.hasSelection : classes.noSelection}`}>
                    <div className={classes.sidebar}>
                        <div className={classes.sidebarHeader}>
                            <Text className={classes.sidebarTitle}>Friends</Text>
                            <Text className={classes.sidebarCount}>{friends.length} {friends.length === 1 ? "friend" : "friends"}</Text>
                        </div>
                        <div className={classes.sidebarBody}>
                            {isFriendsPending || isConversationsPending ? (
                                <Stack gap="xs">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <ConversationRowSkeleton key={i} />
                                    ))}
                                </Stack>
                            ) : isFriendsError ? (
                                <Alert color="red" icon={<IconAlertCircle size={16} />} radius="md" className={classes.alert}>{friendsError.message}</Alert>
                            ) : isConversationsError ? (
                                <Alert color="red" icon={<IconAlertCircle size={16} />} radius="md" className={classes.alert}>{conversationsError.message}</Alert>
                            ) : friends.length === 0 ? (
                                <div className={classes.emptySidebar}>
                                    <div className={classes.emptyIcon}><IconUsers size={20} /></div>
                                    <Text fw={600} size="sm">No friends yet</Text>
                                    <Text size="xs" c="dimmed" ta="center" className={classes.emptyHint}>Add friends to start conversations</Text>
                                </div>
                            ) : (
                                <ConversationList friends={friends} conversations={conversations} selectedFriendId={selectedFriendId} onSelectFriend={handleSelectFriend} />
                            )}
                        </div>
                    </div>

                    <div className={classes.chatArea}>
                        {selectedFriendId && selectedFriend ? (
                            <ChatWindow
                                friendId={selectedFriendId}
                                currentUserId={user?._id ?? ""}
                                friend={{ username: selectedFriend.username, avatar: selectedFriend.avatar }}
                                onBack={() => setSearchParams({})}
                            />
                        ) : (
                            <div className={classes.emptyChat}>
                                <div className={classes.emptyChatIcon}><IconMessageCircle size={28} /></div>
                                <Text fw={600} size="sm">Select a conversation</Text>
                                <Text size="xs" c="dimmed" className={classes.emptyHint}>Choose a friend to start chatting</Text>
                            </div>
                        )}
                    </div>
                </div>
            </Stack>
        </Container>
    );
}