import { Stack } from "@mantine/core";
import { useAuth } from "../../../auth/hook/useAuth";

import { guestNavigation, authenticatedNavigation } from "./navigations";

import { NavigationItems } from "./NavigationItem";

interface NavigationProps {
    close: () => void;
}

export function Navigation({ close }: NavigationProps){
    const {isAuthenticated} = useAuth();

    const navigation = isAuthenticated
        ? authenticatedNavigation
        : guestNavigation;

    return(
        <Stack gap={6}>
            {navigation.map((item) => (
                <NavigationItems
                    key={item.path}
                    item={item}
                    close={close}
                />
            ))}
        </Stack>
    )
}