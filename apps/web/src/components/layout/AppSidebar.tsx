'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home01Icon,
  Calendar03Icon,
  Wallet01Icon,
  UserCircleIcon,
  Settings01Icon,
  Logout01Icon,
  GridViewIcon
} from '@hugeicons/core-free-icons';
import Link from 'next/link';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const items = [
    { title: 'Dashboard', url: '/', icon: Home01Icon },
    { title: 'Bookings', url: '/bookings', icon: Calendar03Icon },
    { title: 'Wallet', url: '/wallet', icon: Wallet01Icon },
    { title: 'Resources', url: '/resources', icon: GridViewIcon },
    { title: 'Profile', url: '/profile', icon: UserCircleIcon },
    { title: 'Settings', url: '/settings', icon: Settings01Icon },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
            <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
                <div className="h-3 w-3 bg-primary rounded-full" />
            </div>
            <span className="font-semibold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
                EKA App
            </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={pathname === item.url || pathname?.startsWith(item.url + '/')}
                  >
                    <Link href={item.url}>
                      <HugeiconsIcon icon={item.icon} className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <HugeiconsIcon icon={Logout01Icon} className="h-4 w-4" />
                    <span>Sign out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
