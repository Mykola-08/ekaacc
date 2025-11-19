"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Calendar,
  TrendingUp,
  MessageSquare,
  Heart,
  Settings,
  Users,
  Shield,
  BarChart,
  CreditCard,
  UserCircle,
  FileText,
  Briefcase
} from "lucide-react"

import { NavMain } from "@/components/navigation/sidebar-components/nav-main"
import { NavUser } from "@/components/navigation/sidebar-components/nav-user"
import { TeamSwitcher } from "@/components/navigation/sidebar-components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/auth-context"
import { usePathname } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  if (isLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground text-sm">Loading...</span>
          </div>
        </SidebarContent>
      </Sidebar>
    )
  }

  const getNavItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: pathname === "/dashboard",
      },
      {
        title: "Profile",
        url: "/profile",
        icon: UserCircle,
        isActive: pathname === "/profile",
      },
    ]

    if (!user) return baseItems

    if (user.role?.name === 'admin') {
      return [
        {
          title: "Admin Dashboard",
          url: "/admin",
          icon: Shield,
          isActive: pathname === "/admin",
        },
        {
          title: "User Management",
          url: "/admin/users",
          icon: Users,
          isActive: pathname === "/admin/users",
        },
        {
          title: "Tier Management",
          url: "/admin/tiers",
          icon: CreditCard,
          isActive: pathname === "/admin/tiers",
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
          icon: BarChart,
          isActive: pathname === "/admin/analytics",
        },
        {
          title: "System Settings",
          url: "/admin/settings",
          icon: Settings,
          isActive: pathname === "/admin/settings",
        },
        ...baseItems
      ]
    }

    if (user.role?.name === 'therapist') {
      return [
        {
          title: "Therapist Dashboard",
          url: "/therapist",
          icon: Briefcase,
          isActive: pathname === "/therapist",
        },
        {
          title: "Client Management",
          url: "/therapist/clients",
          icon: Users,
          isActive: pathname === "/therapist/clients",
        },
        {
          title: "Schedule",
          url: "/therapist/schedule",
          icon: Calendar,
          isActive: pathname === "/therapist/schedule",
        },
        {
          title: "Reports",
          url: "/therapist/reports",
          icon: FileText,
          isActive: pathname === "/therapist/reports",
        },
        ...baseItems
      ]
    }

    // Regular user items
    return [
      ...baseItems,
      {
        title: "Sessions",
        url: "/sessions",
        icon: Calendar,
        isActive: pathname.startsWith("/sessions"),
        items: [
          {
            title: "Book Session",
            url: "/sessions/booking",
          },
          {
            title: "My Sessions",
            url: "/sessions",
          },
        ],
      },
      {
        title: "Progress",
        url: "/progress",
        icon: TrendingUp,
        isActive: pathname.startsWith("/progress"),
        items: [
          {
            title: "Goals",
            url: "/progress",
          },
          {
            title: "Reports",
            url: "/progress-reports",
          },
        ],
      },
      {
        title: "Messages",
        url: "/messages",
        icon: MessageSquare,
        isActive: pathname === "/messages",
      },
      {
        title: "Wellness",
        url: "/wellness",
        icon: Heart,
        isActive: pathname.startsWith("/wellness"),
        items: [
          {
            title: "Journal",
            url: "/journal",
          },
          {
            title: "Mood Tracker",
            url: "/mood",
          },
        ],
      },
      {
        title: "Tiers",
        url: "/tiers",
        icon: CreditCard,
        isActive: pathname === "/tiers",
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        isActive: pathname === "/settings",
      },
    ]
  }

  const navItems = getNavItems()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
