"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home01Icon,
  UserCircle02Icon,
  Calendar03Icon,
  Settings01Icon,
  HelpCircleIcon,
  Layout01Icon
} from "@hugeicons/core-free-icons"

const IconHome = (props: any) => <HugeiconsIcon icon={Home01Icon} {...props} />;
const IconUser = (props: any) => <HugeiconsIcon icon={UserCircle02Icon} {...props} />;
const IconCalendar = (props: any) => <HugeiconsIcon icon={Calendar03Icon} {...props} />;
const IconSettings = (props: any) => <HugeiconsIcon icon={Settings01Icon} {...props} />;
const IconHelpCircle = (props: any) => <HugeiconsIcon icon={HelpCircleIcon} {...props} />;
const IconLayoutGrid = (props: any) => <HugeiconsIcon icon={Layout01Icon} {...props} />;

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
  SidebarGroupContent
} from "@/components/ui/sidebar"
import { useLanguage } from "@/context/marketing/LanguageContext"

export function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useLanguage()
  const pathname = usePathname()

  const navMain = [
    {
      title: t('nav.home') || "Home",
      url: "/",
      icon: IconHome,
    },
    {
      title: t('nav.services') || "Services",
      url: "/services",
      icon: IconLayoutGrid,
    },
    {
      title: t('nav.about') || "About",
      url: "/about-elena",
      icon: IconUser,
    },
    {
      title: t('nav.booking') || "Booking",
      url: "/book",
      icon: IconCalendar,
    }
  ]

  const navSecondary = [
    {
      title: "Pricing",
      url: "/pricing",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "/contact",
      icon: IconHelpCircle,
    }
  ]

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50" {...props}>
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-border/20">
         <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              E
            </div>
            <span className="font-semibold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
              EKA Balance
            </span>
         </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs uppercase tracking-wider text-muted-foreground/70 font-bold mb-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 gap-1">
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url || pathname?.startsWith(`${item.url}/`)}
                    className="hover:bg-primary/5 hover:text-primary transition-all rounded-xl py-6 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link href={item.url}>
                      <item.icon size={20} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu className="px-3 gap-1">
               {navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url || pathname?.startsWith(`${item.url}/`)}
                    className="hover:bg-primary/5 hover:text-primary transition-all rounded-xl py-6 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link href={item.url}>
                      <item.icon size={20} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="bg-primary/5 rounded-2xl p-4 group-data-[collapsible=icon]:hidden">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Premium</p>
          <p className="text-sm font-medium mb-3">Upgrade for more benefits</p>
          <Link
            href="/pricing"
            className="block w-full bg-primary text-primary-foreground text-xs py-2 rounded-xl font-bold shadow-sm active:scale-95 transition-all hover:bg-primary/90 text-center"
          >
            Upgrade Now
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}


