'use client';

import * as React from 'react';
import {
  DashboardSquare01Icon,
  Shield01Icon,
  UserGroupIcon,
  CreditCardIcon,
  ChartBarLineIcon,
  Settings02Icon,
  UserCircleIcon,
  Briefcase01Icon,
  Book01Icon,
  PlusSignIcon,
  Wallet01Icon,
  ActivityIcon,
  CourseIcon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons';

import { NavMain } from '@/components/platform/navigation/sidebar-components/nav-main';
import { NavUser } from '@/components/platform/navigation/sidebar-components/nav-user';
import { TeamSwitcher } from '@/components/platform/navigation/sidebar-components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/platform/auth-context';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground text-sm">{t('common.loading')}</span>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  const getNavItems = () => {
    const baseItems = [
      {
        title: t('nav.dashboard'),
        url: '/dashboard',
        icon: DashboardSquare01Icon,
        isActive: pathname === '/dashboard' || pathname === '/home',
      },
      {
        title: t('nav.profile'),
        url: '/myaccount',
        icon: UserCircleIcon,
        isActive: pathname === '/myaccount',
      },
    ];

    if (!user) return baseItems;

    if (user.role?.name === 'admin') {
      return [
        {
          title: t('nav.adminDashboard'),
          url: '/admin',
          icon: Shield01Icon,
          isActive: pathname === '/admin',
        },
        {
          title: t('nav.userManagement'),
          url: '/admin/users',
          icon: UserGroupIcon,
          isActive: pathname === '/admin/users',
        },
        {
          title: t('nav.subscriptions'),
          url: '/admin/subscriptions',
          icon: CreditCardIcon,
          isActive: pathname === '/admin/subscriptions',
        },
        {
          title: t('nav.analytics'),
          url: '/admin/analytics',
          icon: ChartBarLineIcon,
          isActive: pathname === '/admin/analytics',
        },
        {
          title: t('nav.systemSettings'),
          url: '/admin/settings',
          icon: Settings02Icon,
          isActive: pathname === '/admin/settings',
        },
        ...baseItems,
      ];
    }

    if (user.role?.name === 'therapist') {
      return [
        {
          title: t('nav.therapistDashboard'),
          url: '/dashboard',
          icon: Briefcase01Icon,
          isActive: pathname === '/dashboard',
        },
        {
          title: t('nav.clientManagement'),
          url: '/therapist/clients',
          icon: UserGroupIcon,
          isActive: pathname === '/therapist/clients',
        },
        ...baseItems,
      ];
    }

    if (user.role?.name === 'educator') {
      return [
        {
          title: t('nav.educatorDashboard'),
          url: '/educator',
          icon: DashboardSquare01Icon,
          isActive: pathname === '/educator',
        },
        {
          title: t('nav.myCourses'),
          url: '/educator',
          icon: Book01Icon,
          isActive: pathname === '/educator',
        },
        {
          title: t('nav.createCourse'),
          url: '/educator/courses/new',
          icon: PlusSignIcon,
          isActive: pathname === '/educator/courses/new',
        },
        ...baseItems,
      ];
    }

    return [
      ...baseItems,
      {
        title: 'Finances',
        url: '/finances',
        icon: Wallet01Icon,
        isActive: pathname.startsWith('/finances'),
      },
      {
        title: 'Progress',
        url: '/progress',
        icon: ActivityIcon,
        isActive: pathname.startsWith('/progress'),
      },
      {
        title: 'Community',
        url: '/community',
        icon: UserMultipleIcon,
        isActive: pathname === '/community',
      },
      {
        title: 'Academy',
        url: '/academy',
        icon: CourseIcon,
        isActive: pathname.startsWith('/academy'),
        items: [
          {
            title: 'Course Catalog',
            url: '/academy',
          },
          {
            title: 'My Certificates',
            url: '/academy/certificates',
          },
        ],
      },
      {
        title: 'Plans',
        url: '/finances?tab=plans',
        icon: CreditCardIcon,
        isActive: false,
      },
      {
        title: 'Settings',
        url: '/settings',
        icon: Settings02Icon,
        isActive: pathname === '/settings',
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <Sidebar collapsible="offcanvas" variant="floating" {...props} className="border-none">
      <SidebarHeader className="p-4">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
