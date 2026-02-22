import type {
  PermissionGroup,
  PermissionAction,
} from '@/lib/platform/config/role-permissions';

// ─── Types ─────────────────────────────────────────────────────────

export interface PagePermission {
  group: PermissionGroup;
  action: PermissionAction;
}

export interface PageConfig {
  path: string;
  label: string;
  icon?: string;
  /** null = any authenticated user can see it */
  permission: PagePermission | null;
  hidden?: boolean;
  children?: PageConfig[];
}

// ─── Sidebar navigation registry ──────────────────────────────────
// Every dashboard page that should appear in the sidebar is listed here.
// The `permission` field controls visibility per-role via the permission
// system. `null` means any authenticated user can access the page.

export const SIDEBAR_NAV: PageConfig[] = [
  // ── Main ──────────────────────────────────────────────────────────
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'home',
    permission: null,
  },
  {
    path: '/bookings',
    label: 'Bookings',
    icon: 'calendar',
    permission: null,
  },
  {
    path: '/wellness',
    label: 'Wellness',
    icon: 'heart',
    permission: null,
  },
  {
    path: '/chat',
    label: 'Messages',
    icon: 'message',
    permission: null,
  },
  {
    path: '/resources',
    label: 'Resources',
    icon: 'book',
    permission: null,
  },
  {
    path: '/ai-insights',
    label: 'AI Insights',
    icon: 'sparkle',
    permission: null,
  },
  {
    path: '/notifications',
    label: 'Notifications',
    icon: 'message',
    permission: null,
    hidden: true,
  },
  {
    path: '/finances',
    label: 'Finances',
    icon: 'wallet',
    permission: { group: 'financial_management', action: 'view_own' },
  },

  // ── Therapist / Clinical ──────────────────────────────────────────
  {
    path: '/therapist/clients',
    label: 'Clients',
    icon: 'users',
    permission: { group: 'patient_data', action: 'view_all' },
  },
  {
    path: '/therapist/session-notes',
    label: 'Session Notes',
    icon: 'edit',
    permission: { group: 'therapist_tools', action: 'manage' },
  },
  {
    path: '/therapist/templates',
    label: 'Templates',
    icon: 'folder',
    permission: { group: 'therapist_tools', action: 'manage' },
  },
  {
    path: '/therapist/billing',
    label: 'Billing',
    icon: 'credit-card',
    permission: { group: 'financial_management', action: 'manage' },
  },
  {
    path: '/availability',
    label: 'Availability',
    icon: 'clock',
    permission: { group: 'appointment_management', action: 'manage' },
  },

  // ── Console (Admin) ───────────────────────────────────────────────
  {
    path: '/console',
    label: 'Console',
    icon: 'terminal',
    permission: { group: 'system_settings', action: 'manage' },
    children: [
      {
        path: '/console/users',
        label: 'Users',
        icon: 'users',
        permission: { group: 'user_management', action: 'view_all' },
      },
      {
        path: '/console/services',
        label: 'Services',
        icon: 'wrench',
        permission: { group: 'product_management', action: 'manage' },
      },
      {
        path: '/console/cms',
        label: 'Content',
        icon: 'pen',
        permission: { group: 'content_management', action: 'manage' },
      },
      {
        path: '/console/analytics',
        label: 'Analytics',
        icon: 'bar-chart',
        permission: { group: 'analytics', action: 'view_all' },
      },
      {
        path: '/console/database',
        label: 'Database',
        icon: 'database',
        permission: { group: 'system_settings', action: 'manage' },
      },
      {
        path: '/console/settings',
        label: 'Settings',
        icon: 'settings',
        permission: { group: 'system_settings', action: 'manage' },
      },
    ],
  },

  // ── Account ───────────────────────────────────────────────────────
  {
    path: '/settings',
    label: 'Settings',
    icon: 'settings',
    permission: null,
  },
];
