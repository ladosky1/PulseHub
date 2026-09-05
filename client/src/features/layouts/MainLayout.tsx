import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";

import { AppHeader } from "./components/AppHeader";
import { AppNavbar } from "./components/AppNavbar";

export function MainLayout(){
    const [opened, { toggle, close }] = useDisclosure(false);
    
    return(
        <AppShell
            header={{ height: 64 }}
            navbar={{ 
                width: 260, 
                breakpoint: "md",
                collapsed: {
                    mobile: !opened
                } 
            }}
            padding={0}
        >          
            <AppHeader opened={opened} toggle={toggle} />

            <AppNavbar close={close} />

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}