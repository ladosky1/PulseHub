import { Box, Text, Menu } from "@mantine/core";
import { motion, useReducedMotion } from "motion/react";
import type { Message } from "../../../types";
import { IconTrash } from "@tabler/icons-react";
import { useDeleteMessage } from "../hooks/useDeleteMessage";
import { useRef, useState } from "react";
import classes from "../../../styles/messagestyles/MessageBubble.module.css";

interface MessageBubbleProps {
    message: Message;
    currentUserId: string;
    friendId: string;
}

export function MessageBubble({ 
    message, 
    currentUserId, 
    friendId 
}: MessageBubbleProps) {
    const isMine = message.senderId === currentUserId;
    const shouldReduceMotion = useReducedMotion();

    const [menuOpened, setMenuOpened] = useState(false);
    const longPressTimer = useRef<number | null>(null);

    const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage();

    const handlePointerDown = () => {
        if (!isMine) return;
        longPressTimer.current = window.setTimeout(() => setMenuOpened(true), 600);
    };

    const handlePointerUp = () => {
        if (longPressTimer.current !== null) {
            window.clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleContextMenu = (event: React.MouseEvent) => {
        if (!isMine) return;
        event.preventDefault();
        setMenuOpened(true);
    };

    return (
        <Menu 
            opened={isMine && menuOpened} 
            onChange={setMenuOpened} 
            position={isMine ? "bottom-end" : "bottom-start"} 
            withArrow 
            offset={6} 
            classNames={{ dropdown: classes.menuDropdown, item: classes.menuItem }}>
            <Menu.Target>
                <motion.div
                    initial={shouldReduceMotion? undefined : { opacity: 0, y: 4 }}
                    animate={shouldReduceMotion? undefined : { opacity: 1, y: 0 }}
                    transition={shouldReduceMotion? undefined : { duration: 0.22, ease: "easeOut" }}
                >
                    <Box
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        onContextMenu={handleContextMenu}
                        className={`${classes.wrapper} ${isMine ? classes.mineWrapper : classes.theirWrapper}`}
                    >
                        <div className={`${classes.bubble} ${isMine ? classes.mine : classes.theirs}`}>
                            <Text className={classes.content}>{message.content}</Text>
                            <Text className={classes.meta}>
                                {message.status === "sending"
                                    ? "Sending"
                                    : new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </Text>
                        </div>
                    </Box>
                </motion.div>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item 
                    color="red" 
                    leftSection={<IconTrash size={14} />} 
                    disabled={isDeleting} 
                    onClick={() => deleteMessage({ messageId: message.id, friendId })}>
                    Delete message
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}