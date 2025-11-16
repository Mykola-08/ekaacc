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
import { useAuth } from '@/lib/supabase-auth';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, useSidebar } from '../ui/sidebar';
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { motion } from 'framer-motion';

const SectionHeader = ({ label, icon: Icon, color, isCollapsed }: { label: string, icon: React.ElementType, color: string, isCollapsed: boolean }) => {
  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center my-3">
        <div className={cn("p-2 rounded-xl bg-muted/30", color)}>
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    );
  }
  return (
    <div className="px-4 py-3 mb-2">
      <div className={cn("flex items-center gap-3 text-xs font-semibold px-3 py-2 rounded-xl bg-muted/30", color)}>
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground uppercase tracking-wider">{label}</span>
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
  const base = 'transition-all duration-200 rounded-lg inline-flex items-center font-medium hover-lift';

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              base,
              'justify-center p-3 w-12 h-12',
              isActive 
                ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg' 
                : 'text-muted-foreground hover:bg-background/80 hover:text-primary'
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="glass-effect">
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
        'gap-3 px-4 py-3 w-full',
        isActive 
          ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg' 
          : 'text-muted-foreground hover:bg-background/80 hover:text-primary'
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" aria-hidden />
      <span className="truncate font-medium">{label}</span>
    </Link>
  );
});
SidebarLink.displayName = 'SidebarLink';

export function AppSidebar() {
  const pathname = usePathname();
  const { user: currentUser } = useAuth();
  const { isExpanded } = useSidebar();

  const userRole = currentUser?.role || 'Patient';

  const navItems = getNavItems(userRole);
  const isCollapsed = !isExpanded;

  return (
    <Sidebar className="border-r border-border/10 fixed left-0 top-0 h-full z-40 bg-background/80 backdrop-blur-xl">
      <SidebarHeader isCollapsed={isCollapsed}>
        <Link href="/home" className="flex items-center gap-3 font-semibold text-lg">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Package2 className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && <span className="text-foreground text-xl">EKA</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-auto py-6 px-4">
        <SidebarMenu className="space-y-2">
          {navItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <SidebarLink 
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname.startsWith(item.href)}
                isCollapsed={isCollapsed}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

function getNavItems(role: string) {
  const patientNav = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/ai-insights', icon: Sparkles, label: 'AI Insights' },
    { href: '/progress', icon: TrendingUp, label: 'My Progress' },
    { href: '/journal', icon: BookOpen, label: 'My Journal' },
    { href: '/donations', icon: Heart, label: 'Donations' },
  ];

  const therapistNav = [
    { href: '/therapist', icon: Home, label: 'Dashboard' },
    { href: '/verificator', icon: Shield, label: 'Verificator' },
    { href: '/therapist/clients', icon: Users, label: 'Clients' },
    { href: '/therapist/bookings', icon: CalendarDays, label: 'Bookings' },
    { href: '/therapist/billing', icon: Briefcase, label: 'Billing' },
    { href: '/reports', icon: FileText, label: 'Reports' },
  ];
  
  const adminNav = [
    { href: '/admin', icon: Shield, label: 'Admin Panel' },
    { href: '/admin/users', icon: Users, label: 'Manage Users' },
    { href: '/admin/settings', icon: Settings, label: 'System Settings' },
  ];

  if (role === 'Admin') return adminNav;
  if (role === 'Therapist') return therapistNav;
  return patientNav;
}
