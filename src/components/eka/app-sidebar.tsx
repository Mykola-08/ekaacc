
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
  const { isExpanded } = useSidebar();

  const userLinks = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/ai-insights', icon: Sparkles, label: 'AI Insights' },
    { href: '/sessions', icon: CalendarDays, label: 'Sessions' },
    { href: '/therapies', icon: Sparkles, label: 'Therapies'},
    { href: '/progress', icon: TrendingUp, label: 'Progress' },
    { href: '/journal', icon: BookOpen, label: 'Journal' },
    { href: '/exercises', icon: Dumbbell, label: 'Exercises' },
    { href: '/community', icon: Users, label: 'Community' },
    { href: '/donations', icon: Heart, label: 'Donations' },
    { href: '/forms', icon: FileText, label: 'Forms' },
  ];
  
  // Conditional subscription links
  const subscriptionLinks = [];
  if (currentUser?.isLoyal) {
    subscriptionLinks.push({ href: '/loyal', icon: Zap, label: 'Loyal Benefits' });
  }
  if (currentUser?.isVip) {
    subscriptionLinks.push({ href: '/vip', icon: Crown, label: 'VIP Lounge' });
  }
  
  const therapistLinks = [
    { href: '/therapist/dashboard', icon: Briefcase, label: "Therapist"}
  ];
  const bottomLinks = [
    { href: '/account', icon: Settings, label: 'Account' },
  ];
  const isCollapsed = !isExpanded;
  if (!currentUser) return null;
  const showTherapistLinks = currentUser.role === 'Therapist' || currentUser.role === 'Admin';
  const showUserLinks = currentUser.role !== 'Therapist';

  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Sidebar side="left" className="bg-background">
        <SidebarHeader className={cn(
          "flex h-16 items-center border-b px-4 transition-all duration-300 bg-background",
          isCollapsed ? 'justify-center px-2' : 'gap-2'
        )}>
          <Link href="/" className={cn("flex items-center font-semibold text-xl", isCollapsed ? "justify-center" : "gap-2")}> 
            <Package2 className="h-7 w-7 text-primary shrink-0" />
            {!isCollapsed && <span>EKA</span>}
          </Link>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-auto py-4 px-2 bg-background">
          <SidebarMenu>
            {showUserLinks && userLinks.map(link => (
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
          </SidebarMenu>
        </SidebarContent>

        <div className="mt-auto border-t p-4 bg-background">
          <SidebarMenu>
            {showTherapistLinks && (
              <SidebarMenuItem>
                <SidebarLink 
                  href={therapistLinks[0].href}
                  icon={therapistLinks[0].icon}
                  label={therapistLinks[0].label}
                  isActive={pathname === therapistLinks[0].href}
                  isCollapsed={isCollapsed}
                />
              </SidebarMenuItem>
            )}
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
