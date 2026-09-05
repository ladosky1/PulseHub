import { Container, ActionIcon, Group, Modal, Button, Paper, Stack, Text, Title, SegmentedControl } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { IconChevronRight, IconLock, IconPalette, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { ChangePasswordForm } from "../features/auth/components/ChangePasswordForm";
import { useDeleteAccount } from "../features/auth/hook/useDeleteAccount";
import classes from "../styles/SettingsPage.module.css";

export function SettingsPage() {
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const [changePasswordOpened, setChangePasswordOpened] = useState(false);
    const [deleteACcountOpened, setDeleteAccountOpened] = useState(false);
    const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

    return (
        <Container size="xl" py={{ base: "md", md: "xl" }} className={classes.container}>
            <div className={classes.centerConstrain}>
                <Stack gap={0}>
                    <Stack gap={2} className={classes.pageHeader}>
                        <Title order={2} className={classes.title}>Settings</Title>
                        <Text size="sm" className={classes.subtitle}>Manage your account and preferences</Text>
                    </Stack>

                    <Paper withBorder className={classes.settingsGroup}>
                        <Title order={4} className={classes.groupTitle}>Account</Title>
                        <div className={classes.rowClickable} onClick={() => setChangePasswordOpened(true)}>
                            <Group wrap="nowrap" gap={10} className={classes.rowMain}>
                                <ActionIcon variant="default" radius={10} size={36} className={classes.rowIcon}><IconLock size={16} /></ActionIcon>
                                <Stack gap={2}>
                                    <Text className={classes.rowLabel}>Change Password</Text>
                                    <Text className={classes.rowDesc}>Update your account password</Text>
                                </Stack>
                            </Group>
                            <IconChevronRight size={16} className={classes.chevron} />
                        </div>
                    </Paper>

                    <Paper withBorder className={classes.settingsGroup}>
                        <Title order={4} className={classes.groupTitle}>Appearance</Title>
                        <div className={classes.rowStatic}>
                            <Group wrap="nowrap" gap={10} className={classes.rowMain}>
                                <ActionIcon variant="default" radius={10} size={36} className={classes.rowIcon}><IconPalette size={16} /></ActionIcon>
                                <Stack gap={2}>
                                    <Text className={classes.rowLabel}>Theme</Text>
                                    <Text className={classes.rowDesc}>Choose how PulseHub looks</Text>
                                </Stack>
                            </Group>
                            <SegmentedControl
                                value={colorScheme}
                                onChange={(value) => setColorScheme(value as "light" | "dark" | "auto")}
                                className={classes.themeControl}
                                size="xs"
                                radius="xl"
                                data={[
                                    { label: "Light", value: "light" },
                                    { label: "Dark", value: "dark" },
                                    { label: "Auto", value: "auto" },
                                ]}
                            />
                        </div>
                    </Paper>

                    <Paper withBorder className={`${classes.settingsGroup} ${classes.dangerGroup}`}>
                        <Title order={4} className={classes.dangerTitle}>Danger Zone</Title>
                        <div className={classes.rowStaticDanger}>
                            <Group wrap="nowrap" gap={10} className={classes.rowMain}>
                                <ActionIcon variant="default" radius={10} size={36} className={classes.dangerIcon}><IconTrash size={16} /></ActionIcon>
                                <Stack gap={2}>
                                    <Text className={classes.rowLabel}>Delete Account</Text>
                                    <Text className={classes.rowDesc}>Permanently delete your account</Text>
                                </Stack>
                            </Group>
                            <Button color="red" variant="default" size="xs" radius="xl" className={classes.dangerButton} onClick={() => setDeleteAccountOpened(true)}>Delete Account</Button>
                        </div>
                    </Paper>
                </Stack>
            </div>

            <Modal opened={changePasswordOpened} onClose={() => setChangePasswordOpened(false)} title="Change Password" centered radius="lg" classNames={{ title: classes.modalTitle }}>
                <ChangePasswordForm />
            </Modal>

            <Modal opened={deleteACcountOpened} onClose={() => { if (!isDeleting) setDeleteAccountOpened(false); }} title="Delete Account" centered radius="lg" classNames={{ title: classes.modalTitleDanger }}>
                <Stack gap="md">
                    <Text size="sm">Are you sure you want to permanently delete your account?</Text>
                    <Text size="xs" c="dimmed" className={classes.modalDesc}>This will permanently remove your account, messages, notifications, friend requests, and other associated data. This action cannot be undone.</Text>
                    <Group justify="flex-end" gap={8}>
                        <Button variant="default" size="xs" radius="xl" disabled={isDeleting} onClick={() => setDeleteAccountOpened(false)}>Cancel</Button>
                        <Button color="red" size="xs" radius="xl" loading={isDeleting} onClick={() => deleteAccount()}>Delete Account</Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}