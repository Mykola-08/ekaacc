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
  // Shared classes
  const base = 'transition-all duration-200 rounded-lg inline-flex items-center';

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              base,
              'justify-center p-2 w-10 h-10',
              isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-primary'
            )}
          >
            {/* Ensure icon always uses current color */}
            <Icon className="h-5 w-5 text-current" aria-hidden />
            <span className="sr-only">{label}</span>
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
        base,
        'gap-3 px-3 py-2.5 w-full',
        isActive ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:bg-muted hover:text-primary'
      )}
    >
      <Icon className="h-5 w-5 text-current flex-shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </Link>
  );
});
SidebarLink.displayName = 'SidebarLink';

export function AppSidebar() {
  const pathname = usePathname();
  const { appUser: currentUser } = useAuth();
  const { isExpanded } = useSidebar();

  const userLinks = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/ai-insights', icon: Sparkles, label: 'AI Insights' },
    { href: '/progress', icon: TrendingUp, label: 'Progress' },
    { href: '/journal', icon: BookOpen, label: 'Journal' },
    // { href: '/community', icon: Users, label: 'Community' }, // Hidden - Backend in development
    // { href: '/wallet', icon: Wallet, label: 'Wallet' },
    // { href: '/loyalty', icon: Trophy, label: 'Loyalty' },
    { href: '/donations', icon: Heart, label: 'Donations' },
  ];  // Donation Seeker link - only show if user is a donation seeker
  const donationSeekerLink = currentUser?.isDonationSeeker 
    ? [{ href: '/donation-seeker', icon: Heart, label: 'Donation Seeker' }]
    : [];
  
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
    { href: '/therapist', icon: Home, label: 'Dashboard' },
    { href: '/verificator', icon: Shield, label: 'Verificator' },
    { href: '/therapist/clients', icon: Users, label: 'Clients' },
    { href: '/therapist/bookings', icon: CalendarDays, label: 'Bookings' },
    { href: '/therapist/billing', icon: Briefcase, label: 'Billing' },
    { href: '/therapist/templates', icon: FileText, label: 'Templates' },
    { href: '/reports', icon: FileText, label: 'Reports' },
  ];
  
  // Admin-specific links
  const adminLinks = [
    { href: '/admin', icon: Shield, label: 'Admin Dashboard' },
    { href: '/verificator', icon: Shield, label: 'Verificator' },
    { href: '/admin/users', icon: Users, label: 'Manage Users' },
    { href: '/admin/settings', icon: Settings, label: 'Admin Settings' },
    { href: '/reports', icon: FileText, label: 'System Reports' },
  ];
  // Client / patient links (explicit section)
  const clientLinks = userLinks; // reuse existing userLinks for client section
  const bottomLinks = [
    { href: '/account', icon: Settings, label: 'Account' },
  ];
  const isCollapsed = !isExpanded;
  
  // Show sidebar skeleton if no user (loading state)
  if (!currentUser) {
    return (
      <Sidebar side="left" className="bg-background border-r border-border/50 flex flex-col">
        <SidebarHeader className="flex h-[var(--header-h)] items-center px-4 border-b border-border/50">
          <div className="h-6 w-16 bg-muted animate-pulse rounded" />
        </SidebarHeader>
        <SidebarContent className="flex-1 py-4 px-2">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }
  
  // Use currentUser.role directly without persona switching
  const effectiveRole = currentUser.role;
  const isAdminRole = effectiveRole === 'Admin';
  const isTherapistRole = effectiveRole === 'Therapist';
  const isClientRole = effectiveRole === 'Patient' || (!isAdminRole && !isTherapistRole);

  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Sidebar side="left" className="bg-background border-r border-border/50 flex flex-col">
        <SidebarHeader className={cn(
          "flex h-[var(--header-h)] items-center transition-all duration-300 border-b border-border/50",
          isCollapsed ? 'justify-center px-2' : 'px-4 gap-2'
        )}>
          <Link href="/" className={cn("flex items-center font-semibold group", isCollapsed ? 'text-lg' : 'text-xl')}> 
            <div className="relative">
              <motion.span 
                className="tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                {isCollapsed ? 'E' : 'EKA'}
              </motion.span>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-lg"></div>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-auto py-4 px-2">
          <SidebarMenu>
            {/* ADMIN section (Admins see admin tools) */}
            {isAdminRole && (
              <>
                <SectionHeader 
                  label="ADMIN" 
                  icon={Shield} 
                  color="text-foreground bg-muted/50 border-border" 
                  isCollapsed={isCollapsed} 
                />
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
            {/* THERAPIST section (Therapists see their tools) */}
            {isTherapistRole && (
              <>
                <SectionHeader 
                  label="THERAPIST" 
                  icon={Briefcase} 
                  color="text-foreground bg-muted/50 border-border" 
                  isCollapsed={isCollapsed} 
                />
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
            {/* CLIENT section (Everyone sees client tools) */}
            {isClientRole && (
              <>
                <SectionHeader 
                  label="CLIENT" 
                  icon={User} 
                  color="text-foreground bg-muted/50 border-border" 
                  isCollapsed={isCollapsed} 
                />
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
                {donationSeekerLink.map(link => (
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
          </SidebarMenu>
        </SidebarContent>

        <div className="mt-auto border-t border-border/50">
          <div className="p-2">
            <SidebarMenu>
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
        </div>
      </Sidebar>
    </motion.div>
  );
}
