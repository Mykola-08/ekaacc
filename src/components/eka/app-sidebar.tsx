'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import {
  Home,
  Package2,
  Settings,
  Heart,
  CalendarDays,
  FileText,
  Briefcase,
  Sparkles,
  TrendingUp,
  BookOpen,
  Dumbbell,
  Users,
  User,
  Crown,
  Zap,
  Shield,
  Wallet,
  Gift,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, useSidebar } from '../ui/sidebar';
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { motion } from 'framer-motion';

const SectionHeader = ({ label, icon: Icon, color, isCollapsed }: { label: string, icon: React.ElementType, color: string, isCollapsed: boolean }) => {
  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center my-2">
        <div className={cn("p-1.5 rounded-md", color)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    );
  }
  return (
    <div className="px-3 py-2 mb-1">
      <div className={cn("flex items-center gap-2 text-xs font-bold px-2 py-1 rounded-md border", color)}>
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
    </div>
  );
};

// Memoized link component for better performance
const SidebarLink = memo(({ 
  href, 
  icon: Icon, 
  label, 
  isActive, 
  isCollapsed 
}: { 
  href: string; 
  icon: React.ElementType; 
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}) => {
  const base = 'transition-all duration-200 rounded-lg inline-flex items-center font-medium';

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              base,
              'justify-center p-2.5 w-11 h-11',
              isActive 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-gray-800 text-white border-none">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        base,
        'gap-3 px-4 py-2.5 w-full',
        isActive 
          ? 'bg-primary text-primary-foreground shadow-sm' 
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </Link>
  );
});
SidebarLink.displayName = 'SidebarLink';

export function AppSidebar() {
  const pathname = usePathname();
  const { appUser: currentUser } = useAuth();
  const { isExpanded } = useSidebar();

  // Define links for different roles
  const clientLinks = [
    { href: '/home', icon: Home, label: 'Dashboard' },
    { href: '/ai-insights', icon: Sparkles, label: 'AI Insights' },
    { href: '/progress', icon: TrendingUp, label: 'My Progress' },
    { href: '/journal', icon: BookOpen, label: 'My Journal' },
    { href: '/donations', icon: Heart, label: 'Donations' },
  ];

  const therapistLinks = [
    { href: '/therapist', icon: Home, label: 'Dashboard' },
    { href: '/verificator', icon: Shield, label: 'Verificator' },
    { href: '/therapist/clients', icon: Users, label: 'Clients' },
    { href: '/therapist/bookings', icon: CalendarDays, label: 'Bookings' },
    { href: '/therapist/billing', icon: Briefcase, label: 'Billing' },
    { href: '/reports', icon: FileText, label: 'Reports' },
  ];
  
  const adminLinks = [
    { href: '/admin', icon: Shield, label: 'Admin Panel' },
    { href: '/admin/users', icon: Users, label: 'Manage Users' },
    { href: '/admin/settings', icon: Settings, label: 'System Settings' },
  ];

  const bottomLinks = [
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isCollapsed = !isExpanded;
  
  if (!currentUser) {
    return (
      <Sidebar side="left" className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <SidebarHeader className="flex h-[var(--header-h)] items-center px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
        </SidebarHeader>
        <SidebarContent className="flex-1 py-4 px-3">
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-11 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }
  
  const effectiveRole = currentUser.role;
  let links = clientLinks;
  if (effectiveRole === 'Admin') links = adminLinks;
  else if (effectiveRole === 'Therapist') links = therapistLinks;

  return (
    <motion.div
      initial={{ x: isCollapsed ? '-100%' : 0 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <Sidebar side="left" className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <SidebarHeader className={cn(
          "flex h-[var(--header-h)] items-center transition-all duration-300 border-b border-gray-200 dark:border-gray-800",
          isCollapsed ? 'justify-center px-2' : 'px-4'
        )}>
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary"> 
            <Package2 className="h-6 w-6" />
            {!isCollapsed && <span className="tracking-tight">EKA</span>}
          </Link>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-auto py-4 px-3">
          <SidebarMenu>
            {links.map(link => (
              <SidebarMenuItem key={link.href}>
                <SidebarLink 
                  href={link.href}
                  icon={link.icon}
                  label={link.label}
                  isActive={pathname.startsWith(link.href)}
                  isCollapsed={isCollapsed}
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <div className="mt-auto border-t border-gray-200 dark:border-gray-800">
          <div className="p-3">
            <SidebarMenu>
              {bottomLinks.map(link => (
                <SidebarMenuItem key={link.href}>
                  <SidebarLink 
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                    isActive={pathname.startsWith(link.href)}
                    isCollapsed={isCollapsed}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </div>
      </Sidebar>
    </motion.div>
  );
}
