"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Layout01Icon,
  Settings01Icon,
  UserCircleIcon,
  Logout01Icon,
  ChartBarLineIcon,
  BookOpen01Icon,
  Notification01Icon,
  CircleIcon
} from "@hugeicons/core-free-icons"

const IconLayout01 = (props: any) => <HugeiconsIcon icon={Layout01Icon} {...props} />;
const IconSettings01 = (props: any) => <HugeiconsIcon icon={Settings01Icon} {...props} />;
const IconUserCircle = (props: any) => <HugeiconsIcon icon={UserCircleIcon} {...props} />;
const IconLogout01 = (props: any) => <HugeiconsIcon icon={Logout01Icon} {...props} />;
const IconChartBarLine = (props: any) => <HugeiconsIcon icon={ChartBarLineIcon} {...props} />;
const IconBookOpen01 = (props: any) => <HugeiconsIcon icon={BookOpen01Icon} {...props} />;
const IconNotification01 = (props: any) => <HugeiconsIcon icon={Notification01Icon} {...props} />;
const IconCircle = (props: any) => <HugeiconsIcon icon={CircleIcon} {...props} />;
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  SidebarRail
} from "@/components/ui/sidebar"

export function PlatformSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const navItems = [
    { title: "Overview", url: "/console", icon: IconLayout01 },
    { title: "Analytics", url: "/console/analytics", icon: IconChartBarLine },
    { title: "Users", url: "/console/users", icon: IconUserCircle },
    { title: "Content", url: "/console/content", icon: IconBookOpen01 },
    { title: "Notifications", url: "/console/notifications", icon: IconNotification01 },
    { title: "Settings", url: "/console/settings", icon: IconSettings01 },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40" {...props}>
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-border/10">
         <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground">
               <IconCircle variant="solid" className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold">EKA Console</span>
                <span className="truncate text-xs text-muted-foreground">Platform Admin</span>
            </div>
         </div>
      </SidebarHeader>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs uppercase tracking-wider text-muted-foreground/60 font-bold mb-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 gap-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                     asChild 
                     tooltip={item.title} 
                     isActive={pathname === item.url || pathname?.startsWith(item.url + '/')}
                     className="hover:bg-primary/5 hover:text-primary transition-all rounded-md py-5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link href={item.url}>
                      <item.icon size={20} className="opacity-80 group-hover:opacity-100" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/10">
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton className="hover:bg-destructive/10 hover:text-destructive transition-colors rounded-md">
                <IconLogout01 size={20} />
                <span>Sign out</span>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
