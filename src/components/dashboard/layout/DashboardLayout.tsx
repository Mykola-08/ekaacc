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
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import {
  Home,
  Folder,
  MessageSquare,
  DollarSign,
  Users,
  Building,
  Settings,
  Bell,
  Sun,
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
import { Separator } from '@/components/ui/separator';

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

  // Admin Navigation - Points to Console pages
  const adminNavItems = [
    { label: 'Overview', href: '/dashboard', icon: Home, isLucide: true },
    { label: 'Users', href: '/console/users', icon: Users, isLucide: true },
    { label: 'Services', href: '/console/services', icon: Folder, isLucide: true },
    { label: 'Payments', href: '/console/payments', icon: DollarSign, isLucide: true },
    { label: 'Subscriptions', href: '/console/subscriptions', icon: Building, isLucide: true },
    { label: 'CMS', href: '/console/cms', icon: MessageSquare, isLucide: true },
    { label: 'Analytics', href: '/console/analytics', icon: Settings, isLucide: true },
    { label: 'Settings', href: '/console/settings', icon: Settings, isLucide: true },
  ];

  // Regular Client/Therapist Navigation
  const regularNavItems = [
    { label: t('nav.dashboard') || 'Dashboard', href: '/dashboard', icon: Layout01Icon },
    ...(role === 'client'
      ? [
          { label: 'Wellness Journal', href: '/journal', icon: BookOpen01Icon },
          { label: t('nav.bookings') || 'Bookings', href: '/bookings', icon: Calendar03Icon },
          { label: 'Book Now', href: '/book', icon: Calendar03Icon },
          { label: 'Materials', href: '/resources', icon: GridIcon },
          { label: 'Subscriptions', href: '/subscriptions', icon: Shield01Icon },
          { label: t('nav.wallet') || 'Wallet', href: '/wallet', icon: Wallet01Icon },
          { label: 'Notifications', href: '/notifications', icon: Layout01Icon },
          { label: 'All Features', href: '/features', icon: Layout01Icon },
        ]
      : []),
    ...(role === 'therapist'
      ? [
          {
            label: t('nav.availability') || 'Availability',
            href: '/availability',
            icon: Clock01Icon,
          },
          { label: t('nav.bookings') || 'My Sessions', href: '/bookings', icon: Calendar03Icon },
          { label: 'Clinical Notes', href: '/therapist/session-notes', icon: BookOpen01Icon },
          { label: 'My Clients', href: '/therapist/clients', icon: Layout01Icon },
          { label: 'Templates', href: '/therapist/templates', icon: GridIcon },
          { label: 'Billing', href: '/therapist/billing', icon: Wallet01Icon },
          { label: 'Progress Reports', href: '/progress-reports', icon: Shield01Icon },
        ]
      : []),
    { label: t('nav.account') || 'My Profile', href: '/profile', icon: UserCircleIcon },
    { label: t('nav.settings') || 'Preferences', href: '/settings', icon: Settings01Icon },
  ];

  const navItems = isAdmin ? adminNavItems : regularNavItems;

  return (
    <SidebarProvider className="dashboard-sidebar">
      <Sidebar
        variant="sidebar"
        collapsible="offcanvas"
        className="dashboard-sidebar-panel"
      >
        <SidebarHeader className="p-6 pb-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" className="flex items-center gap-2 px-2">
                <span className="dashboard-sidebar-brand">
                  {isAdmin ? 'EKA ADMIN' : 'EKA BALANCE'}
                </span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="px-4 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === item.href ||
                        (pathname.startsWith(item.href) && item.href !== '/dashboard')
                      }
                      tooltip={item.label}
                      className={cn(
                        'dashboard-nav-item',
                        pathname === item.href
                          ? 'dashboard-nav-item-active'
                          : 'dashboard-nav-item-inactive'
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        {/* @ts-ignore */}
                        {item.isLucide ? (
                          <item.icon className="dashboard-icon" strokeWidth={2} />
                        ) : (
                          <HugeiconsIcon icon={item.icon} className="dashboard-icon" />
                        )}
                        <span className="dashboard-nav-label">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {!isAdmin && role === 'client' && (
            <div className="mt-auto p-4">
              <div className="crisis-support-card">
                <div className="flex items-center gap-2 font-medium">
                  <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
                  <span className="text-sm">Crisis Support</span>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="mt-3 w-full rounded-lg"
                  onClick={() => router.push('/crisis')}
                >
                  Get Help
                </Button>
              </div>
            </div>
          )}
        </SidebarContent>
        <SidebarFooter className="p-6 pt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="dashboard-user-block">
                <div className="dashboard-avatar">
                  {/* Placeholder avatar */}
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.first_name || 'User'}`}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-foreground truncate text-sm font-bold">
                    {profile?.first_name
                      ? `${profile.first_name} ${profile.last_name || ''}`
                      : 'Mykola Voronin'}
                  </div>
                  <div className="text-muted-foreground truncate text-xs font-medium">{isAdmin ? 'Admin' : role}</div>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="dashboard-inset">
        <header className="dashboard-header">
          <div className="flex items-center gap-3">
            <div className="dashboard-header-accent"></div>
            <h1 className="dashboard-header-title">Overview</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="header-icon-btn">
              <Sun className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="header-icon-btn relative">
              <Bell className="h-6 w-6" />
              <span className="notification-dot"></span>
            </Button>
          </div>
        </header>

        <main className="dashboard-main">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
