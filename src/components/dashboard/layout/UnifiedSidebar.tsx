'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/platform/auth-context';
import { useLanguage } from '@/context/LanguageContext';
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
import { Layout01Icon, Calendar03Icon, Wallet01Icon, UserCircleIcon, Settings01Icon, Clock01Icon, BookOpen01Icon, Shield01Icon, CreditCardIcon, UserGroupIcon, FolderOpenIcon, ChartBarLineIcon, Message01Icon, Edit02Icon, Wrench01Icon, SparklesIcon, HeartCheckIcon, UnfoldMoreIcon, UserCheck01Icon, Notification03Icon, Logout03Icon, CheckListIcon, ToggleOnIcon, Database01Icon, Refresh01Icon, AlertCircleIcon, Briefcase01Icon, FileAddIcon, Target01Icon } from '@hugeicons/core-free-icons';

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
  'toggle-right': ToggleOnIcon,
  database: Database01Icon,
  refresh: Refresh01Icon,
  alert: AlertCircleIcon,
  target: Target01Icon,
  briefcase: Briefcase01Icon,
  'file-add': FileAddIcon,
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
  t,
}: {
  sections: { id: string; label: string; items: PageConfig[] }[];
  pathname: string;
  t: (key: string) => string;
}) {
  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === path;
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.id}>
          <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-widest">{t(section.label)}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map((item) => {
              const label = t(item.label);
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={label}>
                    <Link href={item.path} aria-current={isActive(item.path) ? 'page' : undefined}>
                      <NavIcon name={item.icon} />
                      <span>{label}</span>
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

// ─── NavUser — user dropdown in sidebar footer ─────────────────────

function NavUser({
  displayName,
  email,
  avatarUrl,
  roleLabel,
  onSignOut,
  t,
}: {
  displayName: string;
  email: string;
  avatarUrl?: string;
  roleLabel: string;
  onSignOut: () => void;
  t: (key: string) => string;
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
                <span className="text-muted-foreground truncate text-xs">{roleLabel}</span>
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
                  {t('nav.user.account')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings?section=finances">
                  <HugeiconsIcon icon={CreditCardIcon} />
                  {t('nav.user.billing')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/notifications">
                  <HugeiconsIcon icon={Notification03Icon} />
                  {t('nav.notifications')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut} className="cursor-pointer">
              <HugeiconsIcon icon={Logout03Icon} />
              {t('nav.user.logOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// ─── Main component ────────────────────────────────────────────────

export function UnifiedSidebar({ profile, permissions }: { profile?: any; permissions?: any[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const supabase = createClient();

  const canAccess = useMemo(() => {
    return (permission: PagePermission | null): boolean => {
      if (permission === null) return true;
      if (!permissions) return false;

      // Check for manage permission (implies all actions in that group)
      return permissions.some(
        (p) =>
          p.group === permission.group && (p.action === permission.action || p.action === 'manage')
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
  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : profile?.full_name || user?.email?.split('@')[0] || 'User';
  const email = profile?.email || user?.email || '';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  const roleLabel = (() => {
    const r = (role as string).toLowerCase();
    if (r === 'admin' || r === 'super_admin') return t('nav.section.platform') || 'Admin';
    if (r === 'therapist') return t('nav.section.therapist') || 'Therapist';
    if (r === 'reception') return 'Staff';
    return t('nav.section.care') || 'Member';
  })();

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="dashboard-sidebar border-r border-border/60"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="EKA Balance">
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <HugeiconsIcon icon={HeartCheckIcon} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold tracking-tight">EKA Balance</span>
                  <span className="text-muted-foreground truncate text-xs">{t('nav.platformSubtitle')}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain sections={sections} pathname={pathname} t={t} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          displayName={displayName}
          email={email}
          avatarUrl={avatarUrl}
          roleLabel={roleLabel}
          onSignOut={handleSignOut}
          t={t}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
