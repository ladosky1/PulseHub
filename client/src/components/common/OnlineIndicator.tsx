import { Box } from "@mantine/core";
import classes from "../../styles/OnlineIndicator.module.css";

interface OnlineIndicatorProps {
    isOnline: boolean;
}

export function OnlineIndicator({
    isOnline,
}: OnlineIndicatorProps) {
    if (!isOnline) {
        return null;
    }

    return (
        <Box className={classes.indicator} />
    );
}