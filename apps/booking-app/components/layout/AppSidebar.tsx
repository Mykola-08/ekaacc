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
import {
  IconHome01,
  IconCalendar03,
  IconWallet01,
  IconUserCircle,
  IconSettings01,
  IconLogout01,
  IconGridView
} from '@hugeicons/react';
import Link from 'next/link';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const items = [
    { title: 'Dashboard', url: '/', icon: IconHome01 },
    { title: 'Bookings', url: '/bookings', icon: IconCalendar03 },
    { title: 'Wallet', url: '/wallet', icon: IconWallet01 },
    { title: 'Resources', url: '/resources', icon: IconGridView },
    { title: 'Profile', url: '/profile', icon: IconUserCircle },
    { title: 'Settings', url: '/settings', icon: IconSettings01 },
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
                      <item.icon className="h-4 w-4" />
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
                    <IconLogout01 className="h-4 w-4" />
                    <span>Sign out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
