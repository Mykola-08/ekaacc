"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  UserCircle02Icon,
  Calendar03Icon,
  Settings01Icon,
  HelpCircleIcon,
  Search01Icon,
  Message01Icon,
  Layout01Icon,
  CreditCardIcon,
  StarIcon
} from "@hugeicons/core-free-icons"

const IconHome = (props: any) => <HugeiconsIcon icon={Home01Icon} {...props} />;
const IconUser = (props: any) => <HugeiconsIcon icon={UserCircle02Icon} {...props} />;
const IconCalendar = (props: any) => <HugeiconsIcon icon={Calendar03Icon} {...props} />;
const IconSettings = (props: any) => <HugeiconsIcon icon={Settings01Icon} {...props} />;
const IconHelpCircle = (props: any) => <HugeiconsIcon icon={HelpCircleIcon} {...props} />;
const IconSearch = (props: any) => <HugeiconsIcon icon={Search01Icon} {...props} />;
const IconMessageCircle = (props: any) => <HugeiconsIcon icon={Message01Icon} {...props} />;
const IconLayoutGrid = (props: any) => <HugeiconsIcon icon={Layout01Icon} {...props} />;
const IconCreditCard = (props: any) => <HugeiconsIcon icon={CreditCardIcon} {...props} />;
const IconStar = (props: any) => <HugeiconsIcon icon={StarIcon} {...props} />;

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
import { useLanguage } from "@/context/LanguageContext"

export function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useLanguage()

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
      url: "/booking",
      icon: IconCalendar,
    }
  ]

  const navSecondary = [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "#",
      icon: IconHelpCircle,
    }
  ]

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50" {...props}>
      <SidebarHeader className="h-16 flex items-center px-6">
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
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-primary/5 hover:text-primary transition-all rounded-xl py-6">
                    <a href={item.url}>
                      <item.icon size={20} />
                      <span className="font-medium">{item.title}</span>
                    </a>
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
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-primary/5 hover:text-primary transition-all rounded-xl py-6">
                    <a href={item.url}>
                      <item.icon size={20} />
                      <span className="font-medium">{item.title}</span>
                    </a>
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
          <button className="w-full bg-primary text-primary-foreground text-xs py-2 rounded-xl font-bold shadow-sm active:scale-95 transition-all">
            Upgrade Now
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
