import {createBrowserRouter} from 'react-router-dom';

import { MainLayout } from '../features/layouts/MainLayout';
import { AuthLayout } from '../features/auth/layout/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { 
    ExplorePage,
    RegisterPage,
    LoginPage,
    VerifyEmailPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    CommunityPage,
    FriendsPage,
    UserProfilePage,
    NotificationsPage,
    MessagesPage,
    ProfilePage,
    SettingsPage, 
} from '../pages';

export const router = createBrowserRouter([
    {
        element: <MainLayout/>,
        children: [
            {
                path: '/',
                element: <ExplorePage/>,
            },
            {
                path: '/communities/:communityId',
                element: <CommunityPage/>
            },
            {
                element: <PublicOnlyRoute/>,
                children:[
                    {
                        element: <AuthLayout />,
                        children: [
                            {
                                path: "/login",
                                element: <LoginPage />
                            },
                            {
                                path: "/register",
                                element: <RegisterPage />
                            },
                            {
                                path: "/verify-email",
                                element: <VerifyEmailPage />
                            },
                            {
                                path: "/forgot-password",
                                element: <ForgotPasswordPage />
                            },
                            {
                                path: "/reset-password",
                                element: <ResetPasswordPage />
                            }
                        ]
                    },
                ]
            },
            {
                element: <ProtectedRoute/>,
                children: [
                    {
                        path: "/friends",
                        element: <FriendsPage/>
                    },
                    {
                        path: "/notifications",
                        element: <NotificationsPage />
                    },
                    {
                        path: "/profile",
                        element: <ProfilePage />
                    },
                    {
                        path: "/users/:userId",
                        element: <UserProfilePage/>
                    },
                    {
                        path: "/messages",
                        element: <MessagesPage/>
                    },
                    {
                        path: "/settings",
                        element: <SettingsPage/>
                    }
                ]
            }
        ]
    },
]);