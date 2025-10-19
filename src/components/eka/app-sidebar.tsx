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
    { href: '/therapist/dashboard', icon: Briefcase, label: "Therapist"}
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
          'flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
          isCollapsed && 'justify-center',
          isActive && 'bg-primary/10 text-primary font-semibold'
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className={cn('truncate', isCollapsed && 'sr-only')}>{label}</span>
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
          <Link href="/" className={cn("flex items-center gap-2 font-semibold", isCollapsed && "justify-center")}>
            <Package2 className="h-6 w-6 text-primary" />
            <span className={cn(isCollapsed && 'hidden')}>EKA</span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-auto py-4">
          <SidebarMenu>
            {showUserLinks && userLinks.map(link => (
              <SidebarMenuItem key={link.href}>
                <NavLink {...link} />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <div className="mt-auto p-2">
            <nav className="grid items-start text-sm font-medium">
                <SidebarMenu>
                 {showTherapistLinks && (
                    <SidebarMenuItem>
                        <NavLink {...therapistLinks[0]} />
                    </SidebarMenuItem>
                  )}
                    <Separator className="my-2" />
                    {bottomLinks.map(link => (
                        <SidebarMenuItem key={link.href}>
                        <NavLink {...link} />
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
          </nav>
        </div>
    </Sidebar>
  );
}
