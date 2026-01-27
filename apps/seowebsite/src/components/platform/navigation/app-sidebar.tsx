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
import { useAuth } from "@/contexts/platform/auth-context"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground text-sm">{t('common.loading')}</span>
          </div>
        </SidebarContent>
      </Sidebar>
    )
  }

  const getNavItems = () => {
    const baseItems = [
      {
        title: t('nav.dashboard'),
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: pathname === "/dashboard" || pathname === "/home",
      },
      {
        title: t('nav.profile'),
        url: "/myaccount",
        icon: UserCircle,
        isActive: pathname === "/myaccount",
      },
    ]

    if (!user) return baseItems

    if (user.role?.name === 'admin') {
      return [
        {
          title: t('nav.adminDashboard'),
          url: "/admin",
          icon: Shield,
          isActive: pathname === "/admin",
        },
        {
          title: t('nav.userManagement'),
          url: "/admin/users",
          icon: Users,
          isActive: pathname === "/admin/users",
        },
        {
          title: t('nav.subscriptions'),
          url: "/admin/subscriptions",
          icon: CreditCard,
          isActive: pathname === "/admin/subscriptions",
        },
        {
          title: t('nav.analytics'),
          url: "/admin/analytics",
          icon: BarChart,
          isActive: pathname === "/admin/analytics",
        },
        {
          title: t('nav.systemSettings'),
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
          title: t('nav.therapistDashboard'),
          url: "/dashboard",
          icon: Briefcase,
          isActive: pathname === "/dashboard",
        },
        {
          title: t('nav.clientManagement'),
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
          title: t('nav.educatorDashboard'),
          url: "/educator",
          icon: LayoutDashboard,
          isActive: pathname === "/educator",
        },
        {
          title: t('nav.myCourses'),
          url: "/educator",
          icon: BookOpen,
          isActive: pathname === "/educator",
        },
        {
          title: t('nav.createCourse'),
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
        title: "Wallet",
        url: "/wallet",
        icon: CreditCard,
        isActive: pathname === "/wallet",
      },
      {
        title: "Progress",
        url: "/progress",
        icon: TrendingUp,
        isActive: pathname.startsWith("/progress"),
      },
      {
        title: "Community",
        url: "/community",
        icon: MessageSquare,
        isActive: pathname === "/community",
      },
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
        title: "Subscriptions",
        url: "/subscriptions",
        icon: Heart,
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
