import type { ReactNode } from "react";
import { useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { useCurrentUser } from "../hook/useCurrentUser";

interface AuthProviderProps {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps | null){
    const {data, isLoading} = useCurrentUser();

    const user = data?.user ?? null;

    const value = useMemo(() => ({
        user,
        isLoading,
        isAuthenticated: ! !user,
    }),
    [user, isLoading]);

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}