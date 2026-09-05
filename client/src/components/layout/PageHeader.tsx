import { Stack, Title, Text } from "@mantine/core";

interface PageHeaderProps{
    title: string;
    description?: string;
}

export function PageHeader({
    title,
    description
}: PageHeaderProps){
    return(
        <Stack gap={4}>
            <Title order={1}>
                {title}
            </Title>
            
            {description && (
                <Text c="dimmed" size="lg">
                    {description}
                </Text>
            )}
        </Stack>
    )
}