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
  Briefcase,
  BookOpen,
  PlusCircle
} from "lucide-react"

import { NavMain } from "@/components/platform/navigation/sidebar-components/nav-main"
import { NavUser } from "@/components/platform/navigation/sidebar-components/nav-user"
import { TeamSwitcher } from "@/components/platform/navigation/sidebar-components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/platform/ui/sidebar"
import { useAuth } from "@/context/platform/auth-context"
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
        isActive: pathname === "/dashboard" || pathname === "/home",
      },
      {
        title: "Profile",
        url: "/myaccount",
        icon: UserCircle,
        isActive: pathname === "/myaccount",
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
          title: "Subscriptions",
          url: "/admin/subscriptions",
          icon: CreditCard,
          isActive: pathname === "/admin/subscriptions",
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
          url: "/dashboard",
          icon: Briefcase,
          isActive: pathname === "/dashboard",
        },
        {
          title: "Client Management",
          url: "/therapist/clients",
          icon: Users,
          isActive: pathname === "/therapist/clients",
        },
        ...baseItems
      ]
    }

    if (user.role?.name === 'educator') {
      return [
        {
          title: "Educator Dashboard",
          url: "/educator",
          icon: LayoutDashboard,
          isActive: pathname === "/educator",
        },
        {
          title: "My Courses",
          url: "/educator",
          icon: BookOpen,
          isActive: pathname === "/educator",
        },
        {
          title: "Create Course",
          url: "/educator/courses/new",
          icon: PlusCircle,
          isActive: pathname === "/educator/courses/new",
        },
        ...baseItems
      ]
    }

    // Regular user items
    return [
      ...baseItems,
      {
        title: "Academy",
        url: "/academy",
        icon: BookOpen,
        isActive: pathname.startsWith("/academy"),
        items: [
          {
            title: "Course Catalog",
            url: "/academy",
          },
          {
            title: "My Certificates",
            url: "/academy/certificates",
          }
        ]
      },

      {
        title: "Progress",
        url: "/progress",
        icon: TrendingUp,
        isActive: pathname.startsWith("/progress"),
      },


      {
        title: "Subscriptions",
        url: "/subscriptions",
        icon: CreditCard,
        isActive: pathname === "/subscriptions",
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
