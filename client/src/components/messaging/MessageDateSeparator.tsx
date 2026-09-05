import { Divider, Text } from "@mantine/core";

interface MessageDateSeparatorProps {
    date: string;
}

function isToday(date: Date) {
    const now = new Date();

    return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
}

function isYesterday(date: Date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
    );
}

export function MessageDateSeparator({
    date,
}: MessageDateSeparatorProps) {
    const messageDate = new Date(date);

    let label: string;

    if (isToday(messageDate)) {
        label = "Today";
    } else if (isYesterday(messageDate)) {
        label = "Yesterday";
    } else {
        label = messageDate.toLocaleDateString([], {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }

    return (
        <Divider
            label={
                <Text
                    size="xs"
                    c="dimmed"
                    fw={500}>
                    {label}
                </Text>}
            my="sm"/>
    );
}