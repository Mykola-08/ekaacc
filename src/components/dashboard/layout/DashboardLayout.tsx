'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Layout01Icon,
    Calendar03Icon,
    Wallet01Icon,
    UserCircleIcon,
    Settings01Icon,
    Clock01Icon,
    BookOpen01Icon,
    Shield01Icon,
    Logout01Icon,
    GridIcon,
    AlertCircleIcon
} from '@hugeicons/core-free-icons';
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
        { label: t('nav.dashboard') || 'Dashboard', href: '/', icon: Layout01Icon },
        ...(role === 'client' ? [
            { label: 'Wellness Journal', href: '/journal', icon: BookOpen01Icon },
            { label: t('nav.bookings') || 'Bookings', href: '/bookings', icon: Calendar03Icon },
            { label: 'Book Now', href: '/book', icon: Calendar03Icon },
            { label: 'Resources', href: '/resources', icon: GridIcon },
            { label: t('nav.wallet') || 'Wallet', href: '/wallet', icon: Wallet01Icon },
            { label: 'My Sessions (Legacy)', href: '/old-sessions', icon: Calendar03Icon },
        ] : []),
        ...(role === 'therapist' ? [
            { label: t('nav.availability') || 'Availability', href: '/availability', icon: Clock01Icon },
            { label: t('nav.bookings') || 'My Sessions', href: '/bookings', icon: Calendar03Icon },
            { label: 'Clinical Notes', href: '/notes', icon: BookOpen01Icon },
        ] : []),
        ...(role === 'admin' || role === 'super_admin' ? [
            { label: 'Platform Management', href: '/admin', icon: Shield01Icon },
            { label: 'Resource Library', href: '/admin/resources', icon: BookOpen01Icon },
            { label: 'Service Inventory', href: '/services', icon: Settings01Icon },
        ] : []),
        { label: t('nav.account') || 'My Profile', href: '/profile', icon: UserCircleIcon },
        { label: t('nav.settings') || 'Preferences', href: '/settings', icon: Settings01Icon },
    ];

    return (
        <SidebarProvider 
            style={{
                "--sidebar-width": "18rem",
                "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties}
        >
            <Sidebar variant="floating" collapsible="icon" className="group-data-[collapsible=icon]:!w-[calc(var(--sidebar-width-icon)+2px)]">
                <SidebarHeader className="p-4">
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
                                                <HugeiconsIcon icon={item.icon} />
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
                                    <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
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
                                    <HugeiconsIcon icon={Logout01Icon} className="ml-auto size-4" onClick={(e) => { e.preventDefault(); handleSignOut(); }} />
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <SidebarInset className="bg-background min-h-screen flex flex-col p-2 md:p-4">
                <div className="bg-card rounded-[36px] border border-border/50 shadow-sm flex-1 flex flex-col overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/50 px-6 backdrop-blur-md sticky top-0 z-10 transition-all">
                        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                            <span className="text-foreground">EKA App</span>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col overflow-y-auto p-6 md:p-10">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {children}
                        </div>
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}


