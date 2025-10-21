
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
  Crown,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useData } from '@/context/unified-data-context';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, useSidebar } from '../ui/sidebar';
import React, { useEffect, useState } from 'react';
import PersonaSwitcher from './persona-switcher';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { motion } from 'framer-motion';

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
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              'flex items-center justify-center rounded-lg p-3 transition-all duration-200',
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-primary'
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
        isActive 
          ? 'bg-primary text-primary-foreground font-medium' 
          : 'text-muted-foreground hover:bg-muted hover:text-primary'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
});
SidebarLink.displayName = 'SidebarLink';

export function AppSidebar() {
  const pathname = usePathname();
  const { currentUser } = useData();
  const [persona, setPersona] = useState<string | null>(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem('eka_persona');
      setPersona(p);
    } catch(e) {
      setPersona(null);
    }
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      setPersona(detail);
    };
    window.addEventListener('eka_persona_change', handler as EventListener);
    return () => window.removeEventListener('eka_persona_change', handler as EventListener);
  }, []);
  const { isExpanded } = useSidebar();

  const userLinks = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/ai-insights', icon: Sparkles, label: 'AI Insights' },
    { href: '/sessions', icon: CalendarDays, label: 'Sessions' },
    { href: '/therapies', icon: Sparkles, label: 'Therapies'},
    { href: '/progress', icon: TrendingUp, label: 'Progress' },
    { href: '/journal', icon: BookOpen, label: 'Journal' },
  // Exercises and Community links removed from global nav — shown contextually within client/session views
    { href: '/donations', icon: Heart, label: 'Donations' },
  // Forms page removed from main nav — forms now live in account and session contexts
  ];
  
  // Conditional subscription links
  const subscriptionLinks = [];
  if (currentUser?.isLoyal) {
    subscriptionLinks.push({ href: '/loyal', icon: Zap, label: 'Loyal Benefits' });
  }
  if (currentUser?.isVip) {
    subscriptionLinks.push({ href: '/vip', icon: Crown, label: 'VIP Lounge' });
  }
  
  // Explicit therapist menu items
  const therapistLinks = [
    { href: '/therapist/clients', icon: Users, label: 'Clients' },
    { href: '/therapist/bookings', icon: CalendarDays, label: 'Bookings' },
    { href: '/therapist/billing', icon: Briefcase, label: 'Billing' },
    { href: '/therapist/templates', icon: FileText, label: 'Templates' },
  ];
  // Admin-specific links
  const adminLinks = [
    { href: '/admin', icon: Users, label: 'Admin Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Manage Users' },
    { href: '/admin/settings', icon: Settings, label: 'Admin Settings' },
  ];
  // Client / patient links (explicit section)
  const clientLinks = userLinks; // reuse existing userLinks for client section
  const bottomLinks = [
    { href: '/account', icon: Settings, label: 'Account' },
  ];
  const isCollapsed = !isExpanded;
  if (!currentUser) return null;
  // persona takes precedence; fall back to currentUser.role
  const effectiveRole = persona || currentUser.role;
  const isAdminRole = effectiveRole === 'Admin';
  const isTherapistRole = effectiveRole === 'Therapist';
  const isClientRole = effectiveRole === 'Patient' || effectiveRole === 'User' || (!isAdminRole && !isTherapistRole);

  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Sidebar side="left" className="bg-background">
        <SidebarHeader className={cn(
          "flex h-16 items-center px-4 transition-all duration-300 bg-background",
          isCollapsed ? 'justify-center px-2' : 'gap-2'
        )}>
          <Link href="/" className={cn("flex items-center font-semibold text-xl justify-center")}> 
            <span className="tracking-tight">EKA</span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-auto py-4 px-2 bg-background">
          <SidebarMenu>
            {/* ADMIN section (Admins see admin tools) */}
            {isAdminRole && (
              <>
                {!isCollapsed && <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">ADMIN</div>}
                {adminLinks.map(link => (
                  <SidebarMenuItem key={link.href}>
                    <SidebarLink 
                      href={link.href}
                      icon={link.icon}
                      label={link.label}
                      isActive={pathname === link.href}
                      isCollapsed={isCollapsed}
                    />
                  </SidebarMenuItem>
                ))}
              </>
            )}

            {/* THERAPIST section (Therapists and Admins see therapist tools) */}
            {(isTherapistRole || isAdminRole) && (
              <>
                {!isCollapsed && <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">THERAPIST</div>}
                {therapistLinks.map(link => (
                  <SidebarMenuItem key={link.href}>
                    <SidebarLink 
                      href={link.href}
                      icon={link.icon}
                      label={link.label}
                      isActive={pathname === link.href}
                      isCollapsed={isCollapsed}
                    />
                  </SidebarMenuItem>
                ))}
              </>
            )}

            {/* CLIENT section (Patients / general users) */}
            {(isClientRole || isAdminRole) && (
              <>
                {!isCollapsed && <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">CLIENT</div>}
                {clientLinks.map(link => (
                  <SidebarMenuItem key={link.href}>
                    <SidebarLink 
                      href={link.href}
                      icon={link.icon}
                      label={link.label}
                      isActive={pathname === link.href}
                      isCollapsed={isCollapsed}
                    />
                  </SidebarMenuItem>
                ))}
              </>
            )}
            {/* Subscription Links */}
            {subscriptionLinks.length > 0 && (
              <>
                {!isCollapsed && <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">MEMBERSHIP</div>}
                {subscriptionLinks.map(link => (
                  <SidebarMenuItem key={link.href}>
                    <SidebarLink 
                      href={link.href}
                      icon={link.icon}
                      label={link.label}
                      isActive={pathname === link.href}
                      isCollapsed={isCollapsed}
                    />
                  </SidebarMenuItem>
                ))}
              </>
            )}
            {(isTherapistRole || isAdminRole) && (
              <>
                {!isCollapsed && <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">THERAPIST</div>}
                {therapistLinks.map(link => (
                  <SidebarMenuItem key={link.href}>
                    <SidebarLink 
                      href={link.href}
                      icon={link.icon}
                      label={link.label}
                      isActive={pathname === link.href}
                      isCollapsed={isCollapsed}
                    />
                  </SidebarMenuItem>
                ))}
              </>
            )}
          </SidebarMenu>
        </SidebarContent>

        <div className="mt-auto border-t p-4 bg-background">
          <SidebarMenu>
            <div className="mb-3">
              <PersonaSwitcher />
            </div>
            {/* Therapist link intentionally removed from global nav */}
            {bottomLinks.map(link => (
              <SidebarMenuItem key={link.href}>
                <SidebarLink 
                  href={link.href}
                  icon={link.icon}
                  label={link.label}
                  isActive={pathname === link.href}
                  isCollapsed={isCollapsed}
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </Sidebar>
    </motion.div>
  );
}
