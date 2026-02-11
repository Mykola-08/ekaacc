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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
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
  UserGroupIcon,
  FolderOpenIcon,
  DollarCircleIcon,
  ChartBarLineIcon,
  Database01Icon,
  Message01Icon,
  Edit02Icon,
  Wrench01Icon,
  SparklesIcon,
  HeartCheckIcon,
  ArrowRight01Icon,
  UnfoldMoreIcon,
  UserCheck01Icon,
  Notification03Icon,
  Logout03Icon,
} from '@hugeicons/core-free-icons';

// ─── Icon mapping ──────────────────────────────────────────────────

const ICON_MAP: Record<string, { component: any; isLucide: boolean }> = {
  home: { component: Layout01Icon, isLucide: false },
  calendar: { component: Calendar03Icon, isLucide: false },
  book: { component: BookOpen01Icon, isLucide: false },
  wallet: { component: Wallet01Icon, isLucide: false },
  shield: { component: Shield01Icon, isLucide: false },
  'credit-card': { component: CreditCardIcon, isLucide: false },
  clock: { component: Clock01Icon, isLucide: false },
  heart: { component: HeartCheckIcon, isLucide: false },
  users: { component: UserGroupIcon, isLucide: false },
  user: { component: UserCircleIcon, isLucide: false },
  settings: { component: Settings01Icon, isLucide: false },
  terminal: { component: DashboardSquare01Icon, isLucide: false },
  folder: { component: FolderOpenIcon, isLucide: false },
  dollar: { component: DollarCircleIcon, isLucide: false },
  'bar-chart': { component: ChartBarLineIcon, isLucide: false },
  database: { component: Database01Icon, isLucide: false },
  message: { component: Message01Icon, isLucide: false },
  edit: { component: Edit02Icon, isLucide: false },
  pen: { component: Edit02Icon, isLucide: false },
  plug: { component: Wrench01Icon, isLucide: false },
  wrench: { component: Wrench01Icon, isLucide: false },
  sparkle: { component: SparklesIcon, isLucide: false },
};

function NavIcon({ name, className }: { name?: string; className?: string }) {
  const mapping = name ? ICON_MAP[name] : undefined;
  if (!mapping) return null;

  if (mapping.isLucide) {
    const Icon = mapping.component;
    return <Icon className={className} />;
  }

  return <HugeiconsIcon icon={mapping.component} className={className} />;
}

// ─── Group definitions for the sidebar sections ────────────────────

interface SidebarSection {
  label: string;
  items: PageConfig[];
}

function organizeSections(items: PageConfig[]): SidebarSection[] {
  const main: PageConfig[] = [];
  const therapist: PageConfig[] = [];
  const consoleItems: PageConfig[] = [];
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
      consoleItems.push(item);
    } else {
      main.push(item);
    }
  }

  const sections: SidebarSection[] = [];

  if (main.length > 0) sections.push({ label: 'Platform', items: main });
  if (therapist.length > 0) sections.push({ label: 'Clinical', items: therapist });
  if (consoleItems.length > 0) sections.push({ label: 'Console', items: consoleItems });
  if (account.length > 0) sections.push({ label: 'Account', items: account });

  return sections;
}

// ─── NavMain — sidebar-07 pattern with collapsible groups ──────────

function NavMain({
  sections,
  pathname,
  canAccess,
}: {
  sections: SidebarSection[];
  pathname: string;
  canAccess: (permission: PagePermission | null) => boolean;
}) {
  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === path;
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.label}>
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map((item) => {
              if (item.children && item.children.length > 0) {
                const visibleChildren = item.children.filter(
                  (child) => canAccess(child.permission)
                );
                if (visibleChildren.length === 0) return null;

                const isOpen = isActive(item.path);

                return (
                  <Collapsible
                    key={item.path}
                    asChild
                    defaultOpen={isOpen}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.label}>
                          <NavIcon name={item.icon} />
                          <span>{item.label}</span>
                          <HugeiconsIcon icon={ArrowRight01Icon} className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {visibleChildren.map((child) => (
                            <SidebarMenuSubItem key={child.path}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive(child.path)}
                              >
                                <Link href={child.path}>
                                  <span>{child.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                  >
                    <Link href={item.path}>
                      <NavIcon name={item.icon} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

// ─── NavUser — sidebar-07 pattern with dropdown ────────────────────

function NavUser({
  displayName,
  email,
  avatarUrl,
  roleLabel,
  onSignOut,
}: {
  displayName: string;
  email: string;
  avatarUrl?: string;
  roleLabel: string;
  onSignOut: () => void;
}) {
  const { isMobile } = useSidebar();

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <HugeiconsIcon icon={UnfoldMoreIcon} className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/myaccount">
                  <HugeiconsIcon icon={UserCheck01Icon} />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/finances">
                  <HugeiconsIcon icon={CreditCardIcon} />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings">
                  <HugeiconsIcon icon={Settings01Icon} />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/notifications">
                  <HugeiconsIcon icon={Notification03Icon} />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut} className="cursor-pointer">
              <HugeiconsIcon icon={Logout03Icon} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// ─── Main component ────────────────────────────────────────────────

export function UnifiedSidebar({
  profile,
  permissions,
}: {
  profile?: any;
  permissions?: any[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const canAccess = useMemo(() => {
    return (permission: PagePermission | null): boolean => {
      if (permission === null) return true;
      if (permissions) {
        return permissions.some(
          (p) => p.group === permission.group && p.action === permission.action
        );
      }
      return false;
    };
  }, [permissions]);

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

  const role = profile?.role || user?.role?.name || 'Patient';
  const displayName =
    profile?.first_name
      ? `${profile.first_name} ${profile.last_name || ''}`.trim()
      : profile?.full_name || user?.email?.split('@')[0] || 'User';
  const email = profile?.email || user?.email || '';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  const roleLabel = (() => {
    const r = (role as string).toLowerCase();
    if (r === 'admin' || r === 'super_admin') return 'Admin';
    if (r === 'therapist') return 'Therapist';
    if (r === 'reception') return 'Staff';
    return 'Member';
  })();

  return (
    <Sidebar collapsible="icon">
      {/* ── Header: Brand ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="EKA Platform">
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon icon={HeartCheckIcon} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">EKA</span>
                  <span className="truncate text-xs">{roleLabel}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Content: Nav groups ── */}
      <SidebarContent>
        <NavMain
          sections={sections}
          pathname={pathname}
          canAccess={canAccess}
        />
      </SidebarContent>

      {/* ── Footer: User dropdown ── */}
      <SidebarFooter>
        <NavUser
          displayName={displayName}
          email={email}
          avatarUrl={avatarUrl}
          roleLabel={roleLabel}
          onSignOut={handleSignOut}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
