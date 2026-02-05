'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    IconLayout01,
    IconCalendar03,
    IconWallet01,
    IconUserCircle,
    IconSettings01,
    IconClock01,
    IconBookOpen01,
    IconShield01,
    IconLogout01,
    IconGrid,
    IconLifesaver
} from '@hugeicons/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function DashboardLayout({ children, profile }: { children: React.ReactNode, profile?: any }) {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useLanguage();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const role = profile?.role || 'client';

    const navItems = [
        { label: t('nav.dashboard') || 'Dashboard', href: '/', icon: IconLayout01 },
        ...(role === 'client' ? [
            { label: 'Wellness Journal', href: '/journal', icon: IconBookOpen01 },
            { label: t('nav.bookings') || 'Bookings', href: '/bookings', icon: IconCalendar03 },
            { label: 'Resources', href: '/resources', icon: IconGrid },
            { label: t('nav.wallet') || 'Wallet', href: '/wallet', icon: IconWallet01 },
            { label: 'My Sessions (Legacy)', href: '/old-sessions', icon: IconCalendar03 },
        ] : []),
        ...(role === 'therapist' ? [
            { label: t('nav.availability') || 'Availability', href: '/availability', icon: IconClock01 },
            { label: t('nav.bookings') || 'My Sessions', href: '/bookings', icon: IconCalendar03 },
            { label: 'Clinical Notes', href: '/notes', icon: IconBookOpen01 },
        ] : []),
        ...(role === 'admin' || role === 'super_admin' ? [
            { label: 'Platform Management', href: '/admin', icon: IconShield01 },
            { label: 'Resource Library', href: '/admin/resources', icon: IconBookOpen01 },
            { label: 'Service Inventory', href: '/services', icon: IconSettings01 },
        ] : []),
        { label: t('nav.account') || 'My Profile', href: '/profile', icon: IconUserCircle },
        { label: t('nav.settings') || 'Preferences', href: '/settings', icon: IconSettings01 },
    ];

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <span className="font-bold italic">E</span>
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">EKA Balance</span>
                                        <span className="truncate text-xs">Wellness Platform</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {role === 'client' && (
                        <div className="mt-auto p-4">
                            <div className="rounded-xl border bg-destructive/10 p-4 text-destructive">
                                <div className="flex items-center gap-2 font-medium">
                                    <IconLifesaver className="size-4" />
                                    <span className="text-sm">Crisis Support</span>
                                </div>
                                <div className="mt-2 text-xs opacity-90">
                                    Need immediate help? Contact our hotline.
                                </div>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="mt-3 w-full"
                                    onClick={() => router.push('/crisis')}
                                >
                                    Get Help
                                </Button>
                            </div>
                        </div>
                    )}

                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <div className="flex items-center gap-2">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                                        {profile?.first_name?.[0] || 'U'}
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{profile?.first_name || 'User'}</span>
                                        <span className="truncate text-xs">{role}</span>
                                    </div>
                                    <IconLogout01 className="ml-auto size-4" onClick={(e) => { e.preventDefault(); handleSignOut(); }} />
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/50 px-4 backdrop-blur-md sticky top-0 z-10">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-muted-foreground">Dashboard</span>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="animate-in fade-in zoom-in duration-300 py-6">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

