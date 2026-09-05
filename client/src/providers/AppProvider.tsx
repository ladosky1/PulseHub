import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "../features/auth/context/AuthProvider";
import { Notifications } from "@mantine/notifications";

import { queryClient } from "../lib/queryClient";
import { theme, cssVariablesResolver } from "../app/theme";

interface AppProviderProps {
    children: ReactNode;
};

export function AppProvider({ children } : AppProviderProps){
    return(
        <MantineProvider 
            theme={theme}
            cssVariablesResolver={cssVariablesResolver}
            defaultColorScheme="auto">
            <Notifications />
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </QueryClientProvider>
        </MantineProvider>
    )
}