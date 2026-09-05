import { Container, Stack, Paper, Group, Skeleton } from "@mantine/core";
import classes from "../../styles/communitystyles/CommunityPage.module.css";
import headerClasses from "../../styles/communitystyles/CommunityHeader.module.css";
import discussionClasses from "../../styles/communitystyles/CommunityDiscussion.module.css";

export function CommunityPageSkeleton() {
  return (
    <Container size="xl" py={{ base: "md", md: "xl" }}>
      <Stack gap={0}>
        <Skeleton height={20} width={60} radius="sm" mb="md" />

        <div className={classes.headerWrap}>
          <section className={headerClasses.header}>
            <Skeleton height={156} radius={0} />
            <div className={headerClasses.content}>
              <div className={headerClasses.identity}>
                <Skeleton circle height={88} width={88} />
                <Stack gap={10} style={{ paddingBottom: 4, flex: 1 }}>
                  <Skeleton height={22} width={180} radius="sm" />
                  <Group gap="sm">
                    <Skeleton height={20} width={70} radius="xl" />
                    <Skeleton height={14} width={90} radius="sm" />
                    <Skeleton height={14} width={110} radius="sm" />
                  </Group>
                </Stack>
              </div>
              <Stack gap={8} mt="md" style={{ marginLeft: 104 }}>
                <Skeleton height={12} radius="sm" />
                <Skeleton height={12} width="70%" radius="sm" />
              </Stack>
              <Group justify="flex-end" mt="md">
                <Skeleton height={32} width={80} radius="xl" />
                <Skeleton height={32} width={32} radius="md" />
              </Group>
            </div>
          </section>
        </div>

        <Stack gap="md" mt="md">
          <Group gap="lg">
            <Skeleton height={20} width={80} />
            <Skeleton height={20} width={70} />
          </Group>

          <Paper withBorder radius="lg" className={discussionClasses.panel}>
            <div className={discussionClasses.header}>
              <Skeleton height={12} width={140} />
              <Skeleton height={10} width={80} />
            </div>
            <div className={discussionClasses.messagesInner}>
              <Stack gap={14}>
                <Group justify="flex-start">
                  <Stack gap={6} style={{ width: "68%" }}>
                    <Skeleton height={10} width={60} />
                    <Skeleton height={46} radius={16} />
                    <Skeleton height={8} width={36} />
                  </Stack>
                </Group>
                <Group justify="flex-end">
                  <Stack gap={6} align="flex-end" style={{ width: "68%" }}>
                    <Skeleton height={38} radius={16} />
                    <Skeleton height={8} width={36} />
                  </Stack>
                </Group>
                <Group justify="flex-start">
                  <Stack gap={6} style={{ width: "60%" }}>
                    <Skeleton height={10} width={50} />
                    <Skeleton height={32} radius={16} />
                    <Skeleton height={8} width={36} />
                  </Stack>
                </Group>
              </Stack>
            </div>
            <div className={discussionClasses.composer}>
              <Group gap={8} wrap="nowrap">
                <Skeleton height={36} radius="xl" style={{ flex: 1 }} />
                <Skeleton circle height={36} width={36} />
              </Group>
            </div>
          </Paper>
        </Stack>
      </Stack>
    </Container>
  );
}