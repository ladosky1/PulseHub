import { Text } from "@mantine/core";
import classes from "../../styles/messagestyles/TypingIndicator.module.css";

interface TypingIndicatorProps {
    username?: string;
}

export function TypingIndicator({ username = "someone" }: TypingIndicatorProps) {
    return (
        <div className={classes.row} aria-live="polite" aria-label={`${username} is typing`}>
            <div className={classes.bubble}>
                <span className={classes.dots}>
                    <i className={classes.dot} />
                    <i className={classes.dot} />
                    <i className={classes.dot} />
                </span>
            </div>
            <Text className={classes.label}>{username} is typing</Text>
        </div>
    );
}