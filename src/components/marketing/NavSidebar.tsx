'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home01Icon,
  UserCircle02Icon,
  Calendar03Icon,
  Settings01Icon,
  HelpCircleIcon,
  Layout01Icon,
} from '@hugeicons/core-free-icons';

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
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { useLanguage } from '@/context/marketing/LanguageContext';

export function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navMain = [
    {
      title: t('nav.home') || 'Home',
      url: '/',
      icon: IconHome,
    },
    {
      title: t('nav.services') || 'Services',
      url: '/services',
      icon: IconLayoutGrid,
    },
    {
      title: t('nav.about') || 'About',
      url: '/about-elena',
      icon: IconUser,
    },
    {
      title: t('nav.booking') || 'Booking',
      url: '/book',
      icon: IconCalendar,
    },
  ];

  const navSecondary = [
    {
      title: 'Pricing',
      url: '/pricing',
      icon: IconSettings,
    },
    {
      title: 'Help',
      url: '/contact',
      icon: IconHelpCircle,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-border/50 border-r" {...props}>
      <SidebarHeader className="border-border/20 flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg font-bold">
            E
          </div>
          <span className="text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            EKA Balance
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 mb-2 px-6 text-xs font-bold tracking-wider uppercase">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-3">
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url || pathname?.startsWith(`${item.url}/`)}
                    className="hover:bg-primary/5 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary rounded-xl py-6 transition-all"
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
            <SidebarMenu className="gap-1 px-3">
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url || pathname?.startsWith(`${item.url}/`)}
                    className="hover:bg-primary/5 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary rounded-xl py-6 transition-all"
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
          <p className="text-primary mb-1 text-xs font-bold tracking-widest uppercase">Premium</p>
          <p className="mb-3 text-sm font-medium">Upgrade for more benefits</p>
          <Link
            href="/pricing"
            className="bg-primary text-primary-foreground hover:bg-primary/90 block w-full rounded-xl py-2 text-center text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            Upgrade Now
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

