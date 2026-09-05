import { Paper, Group, Stack, Skeleton } from "@mantine/core";
import classes from "../../styles/communitystyles/CommunityCard.module.css";

export function CommunityCardSkeleton() {
  return (
    <Paper className={classes.card} radius="lg" p={{ base: "md", sm: "lg" }}>
      <Stack className={classes.content} gap="md">
        <Group className={classes.cardHeader} justify="space-between" wrap="nowrap">
          <Group className={classes.identity} gap="sm" wrap="nowrap">
            <Skeleton circle height={48} width={48} />
            <Stack className={classes.titleBlock} gap={4}>
              <Skeleton height={14} width={120} radius="sm" />
              <Skeleton height={10} width={90} radius="sm" />
            </Stack>
          </Group>
          <Skeleton height={20} width={64} radius="sm" />
        </Group>

        <Stack gap={6}>
          <Skeleton height={12} radius="sm" />
          <Skeleton height={12} width="85%" radius="sm" />
        </Stack>

        <Group className={classes.footer} justify="space-between" align="center" wrap="nowrap">
          <Group className={classes.memberCount} gap={6} wrap="nowrap">
            <Skeleton circle height={15} width={15} />
            <Skeleton height={12} width={72} radius="sm" />
          </Group>
          <Skeleton height={26} width={72} radius="xl" />
        </Group>
      </Stack>
    </Paper>
  );
}