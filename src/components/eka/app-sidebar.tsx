'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package2,
  Settings,
  Heart,
  CalendarDays,
  FileText,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { useUserContext } from '@/context/user-context';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, useSidebar } from '../ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip';

export function AppSidebar() {
  const pathname = usePathname();
  const { currentUser } = useUserContext();
  const { state: sidebarState } = useSidebar();

  const userLinks = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/sessions', icon: CalendarDays, label: 'Sessions' },
    { href: '/therapies', icon: Sparkles, label: 'Therapies'},
    { href: '/donations', icon: Heart, label: 'Donations' },
    { href: '/reports', icon: FileText, label: 'Reports' },
  ];

  const therapistLinks = [
    { href: '/therapist/dashboard', icon: Briefcase, label: "Therapist Dashboard"}
  ];

  const bottomLinks = [
    { href: '/account', icon: Settings, label: 'Account' },
  ];

  const isCollapsed = sidebarState === 'collapsed';

  if (!currentUser) return null; // Or a loading skeleton

  const showTherapistLinks = currentUser.role === 'Therapist' || currentUser.role === 'Admin';
  const showUserLinks = currentUser.role !== 'Therapist';

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string; }) => {
    const isActive = pathname.startsWith(href);
    const linkContent = (
      <Link
        href={href}
        className={cn(
          'flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted relative',
          isCollapsed && 'justify-center',
          isActive && 'bg-muted text-primary font-medium'
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className={cn('truncate', isCollapsed && 'hidden')}>{label}</span>
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-accent rounded-r-full" />
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" align="center">
            {label}
          </TooltipContent>
        </Tooltip>
      );
    }
    return linkContent;
  };
  
  return (
    <Sidebar side="left">
        <SidebarHeader className="flex h-[var(--header-h)] items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6 text-primary" />
            <span className={cn(isCollapsed && 'hidden')}>EKA Account</span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-auto py-2">
          {showUserLinks && (
            <nav className="grid items-start px-2 text-sm font-medium">
              <p className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider", isCollapsed && 'hidden' )}>
                CLIENT
              </p>
              <SidebarMenu>
                {userLinks.map(link => (
                  <SidebarMenuItem key={link.href}>
                    <NavLink {...link} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </nav>
          )}

          {showUserLinks && showTherapistLinks && <Separator className="my-2" />}

          {showTherapistLinks && (
            <nav className="grid items-start px-2 text-sm font-medium">
              <p className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider", isCollapsed && 'hidden' )}>
                THERAPIST
              </p>
              <SidebarMenu>
                {therapistLinks.map(link => (
                  <SidebarMenuItem key={link.href}>
                     <NavLink {...link} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </nav>
          )}
        </SidebarContent>

        <div className="mt-auto p-4 border-t">
          <nav className="grid items-start px-2 text-sm font-medium mb-4">
            <SidebarMenu>
              {bottomLinks.map(link => (
                <SidebarMenuItem key={link.href}>
                  <NavLink {...link} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </nav>
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                {currentUser.initials}
              </span>
            </span>
            <div className={cn(isCollapsed && 'hidden')}>
              <p className="text-sm font-semibold truncate">{currentUser.name}</p>
              <Badge variant="secondary" className="text-xs">{currentUser.role}</Badge>
            </div>
          </div>
        </div>
    </Sidebar>
  );
}
