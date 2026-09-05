import { 
    AppShell, 
    Burger, 
    Group,
    Avatar,
    Button,
    Menu,
    Text,
    UnstyledButton,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { AppLogo } from "../../../components/branding";
import { useAuth } from "../../auth/hook/useAuth";
import { useLogout } from "../../auth/hook/useLogout";
import classes from "../../../styles/AppHeader.module.css";

interface AppHeaderProps{
    opened: boolean;
    toggle: () => void;
}

export function AppHeader({ opened, toggle }: AppHeaderProps){
    const { user, isAuthenticated } = useAuth();
    const {mutate: logout, isPending} = useLogout();

    return(
        <AppShell.Header className={classes.header} px={{ base: "md", md: "xl"}}>
            <Group h='100%' justify="space-between" wrap="nowrap" className={classes.inner}>
                <Group gap={12} wrap="nowrap" className={classes.left}>
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="md"
                        size='sm'
                        className={classes.burger} />
                    <Link to="/" className={classes.logoLink}>
                        <AppLogo />
                    </Link>
                </Group>

                <Group gap={8} wrap="nowrap" className={classes.right}>
                    {!isAuthenticated ? (
                        <>
                            <Button
                                component={Link}
                                to="/login"
                                variant="subtle"
                                size="sm"
                                radius="md"
                                className={classes.loginButton}>
                                Login
                            </Button>

                            <Button
                                component={Link}
                                to="/register"
                                size="sm"
                                radius="md"
                                className={classes.registerButton}>
                                Register
                            </Button>
                        </>
                    ): (
                        <Menu shadow="md" radius="md" offset={8}>
                            <Menu.Target>
                                <UnstyledButton className={classes.userTrigger}>
                                    <Group gap={8} wrap="nowrap">
                                        <Text
                                            fw={500}
                                            size="sm"
                                            visibleFrom="sm"
                                            className={classes.username}>
                                            {user?.username}
                                        </Text>
                                        <Avatar radius="xl" size="sm" className={classes.avatar}>
                                            {user?.username.slice(0, 2).toUpperCase()}
                                        </Avatar>
                                    </Group>
                                </UnstyledButton>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item component={Link} to="/profile">
                                    Profile
                                </Menu.Item>
                                <Menu.Item component={Link} to="/settings">
                                    Settings
                                </Menu.Item>
                                <Menu.Divider/>
                                <Menu.Item
                                    color="red"
                                    onClick={() => logout()}
                                    disabled={isPending}>
                                    Logout
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    )}
                </Group>
            </Group>
        </AppShell.Header>
    )
}