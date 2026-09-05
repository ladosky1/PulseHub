import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hook/useAuth";
import { useNotificationSocket } from "../features/notifications/hook/useNotificationSocket";
import { useMessageSocket } from "../features/messages/hooks/useMessageSocket";
import { useMessageReadSocket } from "../features/messages/hooks/useMessageReadSocket";
import { usePresenceSocket } from "../features/presence/hooks/usePresenceSocket";
import { AppLoader } from "../components/loader/AppLoader";

export function ProtectedRoute(){
    const {isAuthenticated, isLoading} = useAuth();

    usePresenceSocket(isAuthenticated);
    useNotificationSocket(
        isAuthenticated && !isLoading
    );
    useMessageSocket(isAuthenticated);
    useMessageReadSocket(isAuthenticated);

    if(isLoading){
        return <AppLoader />;
    }

    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    };

    return <Outlet/>;
};