import { Stack } from "@mantine/core";
import type { Friend, Conversation } from "../../../types";
import { ConversationItem } from "./ConversationItem";

interface ConversationListProps {
    friends: Friend[];
    conversations: Conversation[];
    selectedFriendId: string | null;
    onSelectFriend: (friendId: string) => void;
}

export function ConversationList({
    friends,
    conversations,
    selectedFriendId,
    onSelectFriend,
}: ConversationListProps) {

    return (
        <Stack gap="xs">
            {friends.map((friend) => {
                const conversation = conversations.find(
                    (conversation) =>
                        conversation.friend.id === friend.id
                );

                return (
                    <ConversationItem
                        key={friend.id}
                        friend={friend}
                        conversation={conversation}
                        selected={
                            selectedFriendId === friend.id
                        }
                        onClick={() =>
                            onSelectFriend(friend.id)
                        }
                    />
                );
            })}
        </Stack>
    );
}