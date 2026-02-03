import { Calendar, LayoutDashboard, Settings, User, Wallet } from 'lucide-react';

export type DashboardNavItem = {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
};

export const dashboardNavItems: DashboardNavItem[] = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Wallet', href: '/wallet', icon: Wallet },
    { label: 'Bookings', href: '/bookings', icon: Calendar },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
];
