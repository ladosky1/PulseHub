import { AppShell} from "@mantine/core";
import { Navigation } from "./navigation/Navigation";

interface AppNavbarProps{
    close: () => void;
}

export function AppNavbar({ close }: AppNavbarProps){
    return(
        <AppShell.Navbar
            px={{ base: "sm", md: "md"}}
            style={{
                borderRight: "1px solid var(--mantine-color-default-border)",
            }}
            py="md">
            <Navigation close={close} />
        </AppShell.Navbar>
    )
}