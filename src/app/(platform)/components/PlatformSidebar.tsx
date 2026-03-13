'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DashboardSquare01Icon,
  UserCircleIcon,
  Book01Icon,
  Settings02Icon,
  Logout01Icon,
  ActivityIcon,
  Layout01Icon,
  Calendar03Icon,
  CreditCardIcon,
  Notification03Icon,
} from '@hugeicons/core-free-icons';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from '@/components/ui/sidebar';

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
  exact?: boolean;
};

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [{ title: 'Console Home', url: '/console', icon: DashboardSquare01Icon, exact: true }],
  },
  {
    label: 'Operations',
    items: [{ title: 'Services', url: '/console/services', icon: Layout01Icon }],
  },
  {
    label: 'Content',
    items: [{ title: 'CMS', url: '/console/cms', icon: Book01Icon }],
  },
  {
    label: 'System',
    items: [
      { title: 'Users', url: '/console/users', icon: UserCircleIcon },
      { title: 'Analytics', url: '/console/analytics', icon: ActivityIcon },
      { title: 'Database', url: '/console/database', icon: Settings02Icon },
      { title: 'Settings', url: '/console/settings', icon: Settings02Icon },
    ],
  },
];

export function PlatformSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const isItemActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.url;
    }
    return pathname === item.url || pathname?.startsWith(`${item.url}/`);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/console">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={ActivityIcon} className="size-4" strokeWidth={2} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">EKA Console</span>
                  <span className="truncate text-xs">Platform Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title} isActive={active}>
                        <Link href={item.url}>
                          <HugeiconsIcon icon={item.icon} className="size-4" strokeWidth={2} />
                          <span>{item.title}</span>
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/logout">
                <HugeiconsIcon icon={Logout01Icon} className="size-4" strokeWidth={2} />
                <span>Sign out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
