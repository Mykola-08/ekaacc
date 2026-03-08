'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/platform/auth-context';
import { createClient } from '@/lib/supabase/client';
import {
  SIDEBAR_NAV,
  SIDEBAR_SECTIONS,
  type PageConfig,
  type PagePermission,
  type SidebarSectionId,
} from '@/lib/permissions/page-permissions';
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
  CreditCardIcon,
  UserGroupIcon,
  FolderOpenIcon,
  ChartBarLineIcon,
  Message01Icon,
  Edit02Icon,
  Wrench01Icon,
  SparklesIcon,
  HeartCheckIcon,
  UnfoldMoreIcon,
  UserCheck01Icon,
  Notification03Icon,
  Logout03Icon,
  CheckListIcon,
} from '@hugeicons/core-free-icons';

// ─── Icon mapping ──────────────────────────────────────────────────

const ICON_MAP: Record<string, any> = {
  home: Layout01Icon,
  calendar: Calendar03Icon,
  book: BookOpen01Icon,
  wallet: Wallet01Icon,
  shield: Shield01Icon,
  'credit-card': CreditCardIcon,
  clock: Clock01Icon,
  heart: HeartCheckIcon,
  users: UserGroupIcon,
  user: UserCircleIcon,
  settings: Settings01Icon,
  folder: FolderOpenIcon,
  'bar-chart': ChartBarLineIcon,
  message: Message01Icon,
  bell: Notification03Icon,
  edit: Edit02Icon,
  pen: Edit02Icon,
  wrench: Wrench01Icon,
  sparkle: SparklesIcon,
  clipboard: CheckListIcon,
};

function NavIcon({ name, className }: { name?: string; className?: string }) {
  const icon = name ? ICON_MAP[name] : undefined;
  if (!icon) return null;
  return <HugeiconsIcon icon={icon} className={className} />;
}

// ─── Organize items by section ─────────────────────────────────────

function organizeBySections(
  items: PageConfig[]
): { id: SidebarSectionId; label: string; items: PageConfig[] }[] {
  const grouped = new Map<SidebarSectionId, PageConfig[]>();

  for (const item of items) {
    const sectionId = item.section || 'overview';
    const existing = grouped.get(sectionId) || [];
    existing.push(item);
    grouped.set(sectionId, existing);
  }

  return SIDEBAR_SECTIONS.filter((s) => grouped.has(s.id)).map((s) => ({
    ...s,
    items: grouped.get(s.id)!,
  }));
}

// ─── NavMain — flat list grouped by section ────────────────────────

function NavMain({
  sections,
  pathname,
}: {
  sections: { id: string; label: string; items: PageConfig[] }[];
  pathname: string;
}) {
  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === path;
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.id}>
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map((item) => (
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
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

// ─── NavUser — user dropdown in sidebar footer ─────────────────────

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
                <span className="truncate text-xs text-muted-foreground">{roleLabel}</span>
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
                <Link href="/settings">
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
      if (!permissions) return false;

      // Check for manage permission (implies all actions in that group)
      return permissions.some(
        (p) =>
          p.group === permission.group &&
          (p.action === permission.action || p.action === 'manage')
      );
    };
  }, [permissions]);

  const visibleItems = useMemo(() => {
    return SIDEBAR_NAV.filter((item) => {
      if (item.hidden) return false;
      return canAccess(item.permission);
    });
  }, [canAccess]);

  const sections = useMemo(() => organizeBySections(visibleItems), [visibleItems]);

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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="EKA">
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon icon={HeartCheckIcon} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">EKA</span>
                  <span className="truncate text-xs text-muted-foreground">Wellness</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain sections={sections} pathname={pathname} />
      </SidebarContent>

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
