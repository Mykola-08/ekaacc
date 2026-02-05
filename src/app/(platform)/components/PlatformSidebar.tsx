"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  Settings02Icon,
  UserCircleIcon,
  Logout01Icon,
  ChartBarLine01Icon,
  Book01Icon,
  Notification03Icon,
  CircleIcon,
  ActivityIcon
} from "@hugeicons/core-free-icons"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

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
    { title: "Overview", url: "/console", icon: DashboardSquare01Icon },
    { title: "Analytics", url: "/console/analytics", icon: ChartBarLine01Icon },
    { title: "Users", url: "/console/users", icon: UserCircleIcon },
    { title: "Content", url: "/console/content", icon: Book01Icon },
    { title: "Notifications", url: "/console/notifications", icon: Notification03Icon },
    { title: "Settings", url: "/console/settings", icon: Settings02Icon },
  ]

  return (
    <Sidebar collapsible="offcanvas" variant="floating" {...props} className="border-none">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-border/10">
         <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-xl bg-primary text-primary-foreground shadow-md">
               <HugeiconsIcon icon={ActivityIcon} className="size-5" strokeWidth={2.5} />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold text-foreground">EKA Console</span>
                <span className="truncate text-xs text-muted-foreground opacity-70">Platform Admin</span>
            </div>
         </div>
      </SidebarHeader>
      <SidebarContent className="pt-6 px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold mb-4">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                     asChild 
                     tooltip={item.title} 
                     isActive={pathname === item.url || pathname?.startsWith(item.url + '/')}
                     className={cn(
                        "h-11 rounded-2xl transition-all font-semibold",
                        (pathname === item.url || pathname?.startsWith(item.url + '/')) 
                           ? "bg-primary/10 text-primary shadow-sm" 
                           : "hover:bg-secondary"
                     )}
                  >
                    <Link href={item.url}>
                      <HugeiconsIcon icon={item.icon} className="size-5" strokeWidth={2.5} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton className="h-12 rounded-2xl hover:bg-destructive/10 hover:text-destructive group transition-all">
                <HugeiconsIcon icon={Logout01Icon} className="size-5 opacity-70 group-hover:opacity-100" strokeWidth={2.5} />
                <span className="font-bold">Sign out</span>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
