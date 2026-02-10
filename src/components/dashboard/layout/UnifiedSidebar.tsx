'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/platform/auth-context';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import {
  SIDEBAR_NAV,
  type PageConfig,
  type PagePermission,
} from '@/lib/permissions/page-permissions';
import type {
  PermissionGroup,
  PermissionAction,
} from '@/lib/platform/config/role-permissions';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Layout01Icon,
  Calendar03Icon,
  Wallet01Icon,
  UserCircleIcon,
  Settings01Icon,
  Clock01Icon,
  BookOpen01Icon,
  Shield01Icon,
  DashboardSquare01Icon,
  CreditCardIcon,
  ActivityIcon,
  Settings02Icon,
  Notification03Icon,
  Book01Icon,
} from '@hugeicons/core-free-icons';
import {
  Home,
  Users,
  Folder,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Terminal,
  Database,
  MessageCircle,
  PenLine,
  Plug,
  Wrench,
  Sparkles,
  ChevronRight,
  CreditCard,
  Heart,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';

// ─── Icon mapping ──────────────────────────────────────────────────

const ICON_MAP: Record<string, { component: any; isLucide: boolean }> = {
  home: { component: Layout01Icon, isLucide: false },
  calendar: { component: Calendar03Icon, isLucide: false },
  book: { component: BookOpen01Icon, isLucide: false },
  wallet: { component: Wallet01Icon, isLucide: false },
  shield: { component: Shield01Icon, isLucide: false },
  'credit-card': { component: CreditCardIcon, isLucide: false },
  clock: { component: Clock01Icon, isLucide: false },
  heart: { component: Heart, isLucide: true },
  users: { component: Users, isLucide: true },
  user: { component: UserCircleIcon, isLucide: false },
  settings: { component: Settings01Icon, isLucide: false },
  terminal: { component: DashboardSquare01Icon, isLucide: false },
  folder: { component: Folder, isLucide: true },
  dollar: { component: DollarSign, isLucide: true },
  'bar-chart': { component: BarChart3, isLucide: true },
  database: { component: Database, isLucide: true },
  message: { component: MessageCircle, isLucide: true },
  edit: { component: PenLine, isLucide: true },
  pen: { component: PenLine, isLucide: true },
  plug: { component: Plug, isLucide: true },
  wrench: { component: Wrench, isLucide: true },
  sparkle: { component: Sparkles, isLucide: true },
};

function NavIcon({ name, className }: { name?: string; className?: string }) {
  const mapping = name ? ICON_MAP[name] : undefined;
  if (!mapping) return null;

  if (mapping.isLucide) {
    const Icon = mapping.component;
    return <Icon className={className} strokeWidth={1.8} />;
  }

  return <HugeiconsIcon icon={mapping.component} className={className} />;
}

// ─── Group definitions for the sidebar sections ────────────────────

interface SidebarSection {
  label?: string;
  items: PageConfig[];
}

/**
 * Organize the flat SIDEBAR_NAV into grouped sections.
 * We split them into: Main, Therapist, Console, Account.
 */
function organizeSections(items: PageConfig[]): SidebarSection[] {
  const main: PageConfig[] = [];
  const therapist: PageConfig[] = [];
  const console: PageConfig[] = [];
  const account: PageConfig[] = [];

  for (const item of items) {
    if (item.path === '/settings') {
      account.push(item);
    } else if (
      item.path.startsWith('/therapist') ||
      item.path === '/availability'
    ) {
      therapist.push(item);
    } else if (item.path === '/console' || item.path.startsWith('/console/')) {
      console.push(item);
    } else {
      main.push(item);
    }
  }

  const sections: SidebarSection[] = [];

  if (main.length > 0) sections.push({ items: main });
  if (therapist.length > 0) sections.push({ label: 'Clinical', items: therapist });
  if (console.length > 0) sections.push({ label: 'Console', items: console });
  if (account.length > 0) sections.push({ label: 'Account', items: account });

  return sections;
}

// ─── Main component ────────────────────────────────────────────────

export function UnifiedSidebar({ 
  profile,
  permissions 
}: { 
  profile?: any; 
  permissions?: any[] 
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth(); // removed hasPermission from useAuth
  const { t } = useLanguage();
  const supabase = createClient();
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === 'collapsed';

  /** Check if the user has the permission needed for a nav item */
  const canAccess = useMemo(() => {
    return (permission: PagePermission | null): boolean => {
      if (permission === null) return true; // any auth user
      
      // If permissions are provided via props (from DB), use them
      if (permissions) {
        return permissions.some(p => 
          p.group === permission.group && 
          p.action === permission.action
        );
      }
      
      // Fallback (or if user null? but this is sidebar, auth is checked)
      return false; 
    };
  }, [permissions]);

  /** Filter nav items to only those the user can access */
  const visibleItems = useMemo(() => {
    return SIDEBAR_NAV.filter((item) => {
      if (item.hidden) return false;
      return canAccess(item.permission);
    });
  }, [canAccess]);

  const sections = useMemo(() => organizeSections(visibleItems), [visibleItems]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact || path === '/dashboard') return pathname === path;
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const role = profile?.role || user?.role?.name || 'Patient';
  const displayName =
    profile?.first_name
      ? `${profile.first_name} ${profile.last_name || ''}`
      : profile?.full_name || user?.email?.split('@')[0] || 'User';

  const roleLabel = (() => {
    const r = (role as string).toLowerCase();
    if (r === 'admin' || r === 'super_admin') return 'Admin';
    if (r === 'therapist') return 'Therapist';
    if (r === 'reception') return 'Staff';
    return 'Member';
  })();

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="dashboard-sidebar-panel border-none"
    >
      <SidebarHeader className="p-4 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" className="flex items-center gap-2 px-2">
              <Image
                src="/images/eka_logo.png"
                alt="EKA"
                width={28}
                height={28}
                className="shrink-0"
              />
              {!isCollapsed && (
                <span className="text-lg font-bold tracking-tight text-foreground">
                  EKA <span className="font-light">PLATFORM</span>
                </span>
              )}
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2">
        {sections.map((section, si) => (
          <SidebarGroup key={si} className={si > 0 ? 'mt-1' : ''}>
            {section.label && (
              <SidebarGroupLabel className="mb-0.5 px-3 text-[11px] font-medium tracking-wide text-muted-foreground/70 uppercase">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {section.items.map((item) => {
                  // Items with children = collapsible sub-menu
                  if (item.children && item.children.length > 0) {
                    const visibleChildren = item.children.filter(
                      (child) => canAccess(child.permission)
                    );
                    if (visibleChildren.length === 0) return null;

                    const isOpen =
                      pathname === item.path ||
                      pathname?.startsWith(`${item.path}/`);

                    return (
                      <Collapsible
                        key={item.path}
                        asChild
                        defaultOpen={isOpen}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.label}
                              className={cn(
                                'dashboard-nav-item',
                                isOpen
                                  ? 'dashboard-nav-item-active'
                                  : 'dashboard-nav-item-inactive'
                              )}
                            >
                              <NavIcon
                                name={item.icon}
                                className="dashboard-icon"
                              />
                              <span className="dashboard-nav-label">
                                {item.label}
                              </span>
                              <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {visibleChildren.map((child) => {
                                const childActive = isActive(child.path);
                                return (
                                  <SidebarMenuSubItem key={child.path}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={childActive}
                                    >
                                      <Link href={child.path}>
                                        <NavIcon
                                          name={child.icon}
                                          className="dashboard-icon"
                                        />
                                        <span>{child.label}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  // Regular nav item
                  const active = isActive(item.path);
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={cn(
                          'dashboard-nav-item',
                          active
                            ? 'dashboard-nav-item-active'
                            : 'dashboard-nav-item-inactive'
                        )}
                      >
                        <Link href={item.path}>
                          <NavIcon
                            name={item.icon}
                            className="dashboard-icon"
                          />
                          <span className="dashboard-nav-label">
                            {item.label}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 pt-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className={cn('dashboard-user-block', isCollapsed && 'justify-center')}>
              <div className="dashboard-avatar">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=f0f0f0&textColor=333`}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.avatar-fallback') as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <span className="avatar-fallback hidden h-full w-full items-center justify-center bg-muted text-xs font-semibold text-muted-foreground" style={{ display: 'none' }}>
                  {displayName.slice(0, 2).toUpperCase()}
                </span>
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">
                    {displayName}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {roleLabel}
                  </div>
                </div>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip={t('nav.signOut') || 'Sign Out'}
              className="dashboard-nav-item dashboard-nav-item-inactive mt-1 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="dashboard-icon" strokeWidth={1.8} />
              <span className="dashboard-nav-label">
                {t('nav.signOut') || 'Sign Out'}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
