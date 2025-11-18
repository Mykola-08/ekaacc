'use client';

import * as React from "react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/supabase-auth";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  LogOut,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Heart,
  Target,
  ChevronRight,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarNavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  children?: SidebarNavItem[];
}

const navigationItems: SidebarNavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Sessions',
    href: '/sessions',
    icon: Calendar,
    children: [
      { name: 'Book Session', href: '/sessions/booking', icon: Calendar },
      { name: 'My Sessions', href: '/sessions', icon: Calendar },
    ]
  },
  {
    name: 'Progress',
    href: '/progress',
    icon: TrendingUp,
    children: [
      { name: 'Goals', href: '/progress', icon: Target },
      { name: 'Reports', href: '/progress-reports', icon: FileText },
    ]
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
  },
  {
    name: 'Wellness',
    href: '/wellness',
    icon: Heart,
    children: [
      { name: 'Journal', href: '/journal', icon: Heart },
      { name: 'Mood Tracker', href: '/mood', icon: Heart },
    ]
  },
];

const therapistItems: SidebarNavItem[] = [
  {
    name: 'Clients',
    href: '/therapists',
    icon: Users,
  },
  {
    name: 'Templates',
    href: '/therapist/templates',
    icon: FileText,
  },
];

interface NavItemProps {
  item: SidebarNavItem;
  isExpanded: boolean;
  depth?: number;
}

function NavItem({ item, isExpanded, depth = 0 }: NavItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      router.push(item.href);
    }
  };

  return (
    <div className="w-full">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={cn(
              "w-full justify-start gap-2 px-3 py-2 h-10",
              depth > 0 && "pl-10",
              !isExpanded && "justify-center px-2"
            )}
            onClick={handleClick}
          >
            <item.icon className={cn("h-4 w-4", isActive && "text-white")} />
            {isExpanded && (
              <span className="flex-1 text-left truncate">{item.name}</span>
            )}
            {hasChildren && isExpanded && (
              <ChevronRight className={cn("h-3 w-3 transition-transform", isOpen && "rotate-90")} />
            )}
          </Button>
        </TooltipTrigger>
        {!isExpanded && (
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.name}
          </TooltipContent>
        )}
      </Tooltip>

      {hasChildren && isExpanded && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="CollapsibleContent">
            <div className="pt-1 space-y-1">
              {item.children?.map((child) => (
                <NavItem key={child.name} item={child} isExpanded={isExpanded} depth={depth + 1} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';
  const { user, signOut } = useAuth();
  const router = useRouter();

  const allItems = user?.user_type === 'therapist' 
    ? [...navigationItems, ...therapistItems]
    : navigationItems;

  const filteredItems = allItems.filter(item => 
    !item.roles || item.roles.includes(user?.user_type || '')
  );

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <Sidebar className={cn("bg-background", className)}>
      <SidebarHeader>
        <div className="flex items-center justify-between p-4">
          {isExpanded && (
            <h5 className="text-lg font-semibold text-primary">EKA</h5>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <TooltipProvider>
          <div className="space-y-2 px-4">
            {filteredItems.map((item) => (
              <NavItem key={item.name} item={item} isExpanded={isExpanded} />
            ))}
          </div>
        </TooltipProvider>
      </SidebarContent>

      <SidebarFooter>
        <TooltipProvider>
          <div className="p-4">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start gap-2", !isExpanded && "justify-center px-2")}
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  {isExpanded && <span>Sign Out</span>}
                </Button>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right">Sign Out</TooltipContent>
              )}
            </Tooltip>
          </div>
        </TooltipProvider>
      </SidebarFooter>
    </Sidebar>
  );
}