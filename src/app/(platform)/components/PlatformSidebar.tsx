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
import { cn } from '@/lib/utils';
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
    items: [
      { title: 'Console Home', url: '/console', icon: DashboardSquare01Icon, exact: true },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Services', url: '/console/services', icon: Layout01Icon },
    ],
  },
  {
    label: 'Content',
    items: [
      { title: 'CMS', url: '/console/cms', icon: Book01Icon },
    ],
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
    <Sidebar collapsible="offcanvas" variant="floating" className="border-none" {...props}>
      <SidebarHeader className="platform-sidebar-header">
        <div className="flex h-full items-center gap-3">
          <div className="platform-sidebar-brand-icon">
            <HugeiconsIcon icon={ActivityIcon} className="size-5" strokeWidth={2.5} />
          </div>
          <div className="grid text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-foreground truncate font-bold">EKA Console</span>
            <span className="text-muted-foreground truncate text-xs">Platform Admin</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-4">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="platform-sidebar-group-label">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={active}
                        className={cn(
                          'platform-nav-item',
                          active ? 'platform-nav-item-active' : 'platform-nav-item-inactive'
                        )}
                      >
                        <Link href={item.url}>
                          <HugeiconsIcon icon={item.icon} className="size-5" strokeWidth={2.4} />
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

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="platform-signout-btn"
            >
              <Link href="/logout">
                <HugeiconsIcon icon={Logout01Icon} className="size-5" strokeWidth={2.4} />
                <span className="font-semibold">Sign out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
