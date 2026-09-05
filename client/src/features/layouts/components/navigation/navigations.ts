import {
    IconCompass,
    IconFriends,
    IconMessageCircle,
    IconBell,
    IconUser,
    IconLogin,
    IconUserPlus,
    IconSettings,
} from '@tabler/icons-react';
import type { IconProps } from '@tabler/icons-react';

export interface NavigationItem {
    label: string;
    path: string;
    icon: React.ComponentType<IconProps>;
    protected: boolean;
}

export const guestNavigation: NavigationItem[] = [
    {
        label: 'Explore',
        path: '/',
        icon: IconCompass,
        protected: false,
    },
    {
        label: 'Login',
        path: '/login',
        icon: IconLogin,
        protected: false,
    },
    {
        label: 'Register',
        path: '/register',
        icon: IconUserPlus,
        protected: false,
    }
];

export const authenticatedNavigation: NavigationItem[] = [
    {
        label: 'Explore',
        path: '/',
        icon: IconCompass,
        protected: true,
    },
    {
        label: 'Friends',
        path: '/friends',
        icon: IconFriends,
        protected: true,
    },
    {
        label: 'Messages',
        path: '/messages',
        icon: IconMessageCircle,
        protected: true,
    },
    {
        label: 'Notifications',
        path: '/notifications',
        icon: IconBell,
        protected: true,
    },
    {
        label: 'Profile',
        path: '/profile',
        icon: IconUser,
        protected: true,
    },
    {
        label: 'Settings',
        path: '/settings',
        icon: IconSettings,
        protected: true,
    }
]