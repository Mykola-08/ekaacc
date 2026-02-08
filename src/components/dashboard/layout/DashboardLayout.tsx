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

  // Admin Navigation - Matching Screenshot
  const adminNavItems = [
    { label: 'Overview', href: '/dashboard', icon: Home, isLucide: true },
    { label: 'Projects', href: '/admin/projects', icon: Folder, isLucide: true },
    { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare, isLucide: true },
    { label: 'Finance', href: '/admin/finance', icon: DollarSign, isLucide: true },
    { label: 'Users', href: '/admin/users', icon: Users, isLucide: true },
    { label: 'Organizations', href: '/admin/organizations', icon: Building, isLucide: true },
    { label: 'Settings', href: '/settings', icon: Settings, isLucide: true },
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
          { label: 'All Features', href: '/features', icon: Layout01Icon },
          { label: t('nav.wallet') || 'Wallet', href: '/wallet', icon: Wallet01Icon },
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
        ]
      : []),
    { label: t('nav.account') || 'My Profile', href: '/profile', icon: UserCircleIcon },
    { label: t('nav.settings') || 'Preferences', href: '/settings', icon: Settings01Icon },
  ];

  const navItems = isAdmin ? adminNavItems : regularNavItems;

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '16rem', // Narrower sidebar like screenshot
          '--sidebar-width-mobile': '20rem',
          '--sidebar-bg': '#f9fafb',
          '--sidebar-border': 'transparent',
        } as React.CSSProperties
      }
    >
      <Sidebar
        variant="sidebar"
        collapsible="offcanvas"
        className="border-r border-dashed border-gray-100 bg-[#f9fafb]"
      >
        <SidebarHeader className="p-6 pb-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" className="flex items-center gap-2 px-2">
                <span className="text-xl font-bold tracking-tight text-gray-900">
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
                        'h-10 px-4 py-2 transition-all duration-200 hover:bg-gray-50',
                        pathname === item.href
                          ? 'bg-blue-50 font-semibold text-blue-600'
                          : 'font-medium text-gray-500'
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        {/* @ts-ignore */}
                        {item.isLucide ? (
                          <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
                        ) : (
                          <HugeiconsIcon icon={item.icon} className="h-[18px] w-[18px]" />
                        )}
                        <span className="text-[13px] tracking-wide uppercase">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {!isAdmin && role === 'client' && (
            <div className="mt-auto p-4">
              <div className="bg-destructive/10 text-destructive rounded-xl border p-4">
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
              <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-gray-100 hover:bg-gray-50">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-amber-100 shadow-sm">
                  {/* Placeholder avatar */}
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.first_name || 'User'}`}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-gray-900">
                    {profile?.first_name
                      ? `${profile.first_name} ${profile.last_name || ''}`
                      : 'Mykola Voronin'}
                  </div>
                  <div className="truncate text-xs font-medium text-gray-400">Admin</div>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="flex min-h-screen flex-col bg-[#f9fafb]">
        {/* Top Header - Matching Screenshot */}
        <header className="flex h-20 shrink-0 items-center justify-between gap-2 px-8 py-6">
          <div className="flex items-center gap-3">
            {/* Breadcrumb-like title */}
            <div className="h-8 w-1 rounded-full bg-gray-900"></div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Overview</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <Sun className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full border border-white bg-red-500"></span>
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col overflow-y-auto p-8 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
