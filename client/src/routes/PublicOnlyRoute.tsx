import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hook/useAuth";
import { AppLoader } from "../components/loader/AppLoader";

export function PublicOnlyRoute(){
    const {isAuthenticated, isLoading} = useAuth();

    if(isLoading){
        return <AppLoader />;
    }

    if(isAuthenticated){
        return <Navigate to="/" replace/>
    }

    return <Outlet/>
}