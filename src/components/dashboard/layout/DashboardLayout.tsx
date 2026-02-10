'use client';

import React from 'react';
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
} from '@hugeicons/core-free-icons';
import {
  Home,
  Users,
  Folder,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  LogOut,
} from 'lucide-react';
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
  SidebarGroupContent,
} from '@/components/ui/sidebar';

/* ─── Minimalist role-based navigation ─── */

type NavItem = {
  label: string;
  href: string;
  icon: any;
  isLucide?: boolean;
};

type NavGroup = {
  label?: string;
  items: NavItem[];
};

function getClientNav(t: (k: string) => string): NavGroup[] {
  return [
    {
      items: [
        { label: t('nav.dashboard') || 'Home', href: '/dashboard', icon: Layout01Icon },
        { label: t('nav.bookings') || 'Bookings', href: '/bookings', icon: Calendar03Icon },
        { label: t('nav.journal') || 'Journal', href: '/journal', icon: BookOpen01Icon },
        { label: t('nav.wallet') || 'Wallet', href: '/wallet', icon: Wallet01Icon },
      ],
    },
    {
      label: 'More',
      items: [
        { label: t('nav.resources') || 'Resources', href: '/resources', icon: Shield01Icon },
        { label: t('nav.subscriptions') || 'Plans', href: '/subscriptions', icon: Shield01Icon },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: t('nav.account') || 'Profile', href: '/profile', icon: UserCircleIcon },
        { label: t('nav.settings') || 'Settings', href: '/settings', icon: Settings01Icon },
      ],
    },
  ];
}

function getTherapistNav(t: (k: string) => string): NavGroup[] {
  return [
    {
      items: [
        { label: t('nav.dashboard') || 'Home', href: '/dashboard', icon: Layout01Icon },
        { label: t('nav.bookings') || 'Sessions', href: '/bookings', icon: Calendar03Icon },
        { label: t('nav.myClients') || 'Clients', href: '/therapist/clients', icon: UserCircleIcon },
        { label: t('nav.availability') || 'Schedule', href: '/availability', icon: Clock01Icon },
      ],
    },
    {
      label: 'Clinical',
      items: [
        { label: t('nav.clinicalNotes') || 'Notes', href: '/therapist/session-notes', icon: BookOpen01Icon },
        { label: t('nav.billing') || 'Billing', href: '/therapist/billing', icon: Wallet01Icon },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: t('nav.account') || 'Profile', href: '/profile', icon: UserCircleIcon },
        { label: t('nav.settings') || 'Settings', href: '/settings', icon: Settings01Icon },
      ],
    },
  ];
}

function getAdminNav(t: (k: string) => string): NavGroup[] {
  return [
    {
      items: [
        { label: 'Overview', href: '/dashboard', icon: Home, isLucide: true },
        { label: 'Users', href: '/console/users', icon: Users, isLucide: true },
        { label: 'Services', href: '/console/services', icon: Folder, isLucide: true },
        { label: 'Payments', href: '/console/payments', icon: DollarSign, isLucide: true },
      ],
    },
    {
      label: 'System',
      items: [
        { label: 'Analytics', href: '/console/analytics', icon: BarChart3, isLucide: true },
        { label: 'Settings', href: '/console/settings', icon: Settings, isLucide: true },
      ],
    },
  ];
}

export function DashboardLayout({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile?: any;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const role = profile?.role || 'client';
  const isAdmin = role === 'admin' || role === 'super_admin';

  const navGroups = isAdmin
    ? getAdminNav(t)
    : role === 'therapist'
      ? getTherapistNav(t)
      : getClientNav(t);

  return (
    <SidebarProvider className="dashboard-sidebar">
      <Sidebar
        variant="sidebar"
        collapsible="offcanvas"
        className="dashboard-sidebar-panel"
      >
        <SidebarHeader className="p-5 pb-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" className="flex items-center gap-2 px-2">
                <span className="dashboard-sidebar-brand">
                  {isAdmin ? 'EKA ADMIN' : 'EKA'}
                </span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-3 py-3">
          {navGroups.map((group, gi) => (
            <SidebarGroup key={gi} className={gi > 0 ? 'mt-2' : ''}>
              {group.label && (
                <SidebarGroupLabel className="mb-1 px-3 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {group.items.map((item) => {
                    const active =
                      pathname === item.href ||
                      (pathname.startsWith(item.href) && item.href !== '/dashboard');
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label}
                          className={cn(
                            'dashboard-nav-item',
                            active
                              ? 'dashboard-nav-item-active'
                              : 'dashboard-nav-item-inactive'
                          )}
                        >
                          <Link href={item.href}>
                            {item.isLucide ? (
                              <item.icon className="dashboard-icon" strokeWidth={1.8} />
                            ) : (
                              <HugeiconsIcon icon={item.icon} className="dashboard-icon" />
                            )}
                            <span className="dashboard-nav-label">{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="p-4 pt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="dashboard-user-block">
                <div className="dashboard-avatar">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.first_name || 'U'}&backgroundColor=f0f0f0&textColor=333`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">
                    {profile?.first_name
                      ? `${profile.first_name} ${profile.last_name || ''}`
                      : 'User'}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {isAdmin ? 'Admin' : role === 'therapist' ? 'Therapist' : 'Member'}
                  </div>
                </div>
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleSignOut}
                tooltip={t('nav.signOut') || 'Sign Out'}
                className="dashboard-nav-item dashboard-nav-item-inactive mt-1 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="dashboard-icon" strokeWidth={1.8} />
                <span className="dashboard-nav-label">{t('nav.signOut') || 'Sign Out'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="dashboard-inset">
        <header className="dashboard-header">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => router.push('/notifications')}
              className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="dashboard-main">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
