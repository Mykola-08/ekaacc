import type { PermissionGroup, PermissionAction } from '@/lib/platform/config/role-permissions';

// ─── Types ─────────────────────────────────────────────────────────

export interface PagePermission {
  group: PermissionGroup;
  action: PermissionAction;
}

export type SidebarSectionId = 'overview' | 'care' | 'manage' | 'platform' | 'account';

export interface PageConfig {
  path: string;
  label: string;
  icon?: string;
  /** null = any authenticated user can see it */
  permission: PagePermission | null;
  hidden?: boolean;
  /** Which sidebar section this item belongs to */
  section?: SidebarSectionId;
  children?: PageConfig[];
}

export interface SidebarSection {
  id: SidebarSectionId;
  label: string;
}

// ─── Section definitions ──────────────────────────────────────────

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'care', label: 'Care' },
  { id: 'manage', label: 'Manage' },
  { id: 'platform', label: 'Platform' },
  { id: 'account', label: 'Account' },
];

// ─── Sidebar navigation registry ──────────────────────────────────
// Flat, functional navigation. No role-specific prefixes — visibility
// is purely controlled by the permission system. `null` permission
// means any authenticated user can see the page.

export const SIDEBAR_NAV: PageConfig[] = [
  // ── Overview ──────────────────────────────────────────────────────
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'home',
    permission: null,
    section: 'overview',
  },
  {
    path: '/bookings',
    label: 'Bookings',
    icon: 'calendar',
    permission: null,
    section: 'overview',
  },
  {
    path: '/chat',
    label: 'Messages',
    icon: 'message',
    permission: null,
    section: 'overview',
  },
  {
    path: '/notifications',
    label: 'Notifications',
    icon: 'bell',
    permission: null,
    section: 'overview',
    hidden: true,
  },

  // ── Care ──────────────────────────────────────────────────────────
  {
    path: '/wellness',
    label: 'Wellness',
    icon: 'heart',
    permission: null,
    section: 'care',
  },
  {
    path: '/journal',
    label: 'Journal',
    icon: 'book',
    permission: null,
    section: 'care',
  },
  {
    path: '/resources',
    label: 'Resources',
    icon: 'folder',
    permission: null,
    section: 'care',
  },
  {
    path: '/assignments',
    label: 'Assignments',
    icon: 'clipboard',
    permission: null,
    section: 'care',
  },
  // {
  //   path: '/ai-insights',
  //   label: 'AI Assistant',
  //   icon: 'sparkle',
  //   permission: null,
  //   section: 'care',
  // },
  {
    path: '/therapist/clients',
    label: 'Clients',
    icon: 'users',
    permission: { group: 'patient_data', action: 'view_all' },
    section: 'care',
  },
  {
    path: '/therapist/session-notes',
    label: 'Session Notes',
    icon: 'edit',
    permission: { group: 'therapist_tools', action: 'create' },
    section: 'care',
  },
  {
    path: '/therapist/templates',
    label: 'Templates',
    icon: 'folder',
    permission: { group: 'therapist_tools', action: 'create' },
    section: 'care',
  },
  {
    path: '/therapist/patients',
    label: 'Patients',
    icon: 'users',
    permission: { group: 'patient_data', action: 'view_all' },
    section: 'care',
  },
  {
    path: '/therapist/assignments',
    label: 'Homework',
    icon: 'clipboard',
    permission: { group: 'therapist_tools', action: 'create' },
    section: 'care',
  },
  {
    path: '/therapist/resources',
    label: 'Clinical Resources',
    icon: 'folder',
    permission: { group: 'therapist_tools', action: 'create' },
    section: 'care',
  },
  // {
  //   path: '/community',
  //   label: 'Community',
  //   icon: 'message',
  //   permission: null,
  //   section: 'care',
  // },
  // {
  //   path: '/forms',
  //   label: 'Forms',
  //   icon: 'file-add',
  //   permission: null,
  //   section: 'care',
  // },
  // {
  //   path: '/crisis',
  //   label: 'Crisis Support',
  //   icon: 'alert',
  //   permission: null,
  //   section: 'care',
  // },

  // ── Manage ────────────────────────────────────────────────────────
  {
    path: '/availability',
    label: 'Availability',
    icon: 'clock',
    permission: { group: 'appointment_management', action: 'manage' },
    section: 'manage',
  },
  {
    path: '/therapist/billing',
    label: 'Billing',
    icon: 'credit-card',
    permission: { group: 'therapist_tools', action: 'create' },
    section: 'manage',
  },
  {
    path: '/business',
    label: 'Business',
    icon: 'briefcase',
    permission: { group: 'financial_management', action: 'manage' },
    section: 'manage',
  },
  // {
  //   path: '/finances',
  //   label: 'Finances',
  //   icon: 'wallet',
  //   permission: null,
  //   section: 'manage',
  // },

  // ── Platform (admin/management) ───────────────────────────────────
  {
    path: '/console/users',
    label: 'Users',
    icon: 'users',
    permission: { group: 'user_management', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/permissions',
    label: 'Permissions',
    icon: 'shield',
    permission: { group: 'user_management', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/services',
    label: 'Services',
    icon: 'wrench',
    permission: { group: 'product_management', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/cms',
    label: 'Content',
    icon: 'pen',
    permission: { group: 'content_management', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/analytics',
    label: 'Analytics',
    icon: 'bar-chart',
    permission: { group: 'analytics', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/features',
    label: 'Features',
    icon: 'toggle-right',
    permission: { group: 'system_settings', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/payments',
    label: 'Payments',
    icon: 'credit-card',
    permission: { group: 'financial_management', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/subscriptions',
    label: 'Subscriptions',
    icon: 'refresh',
    permission: { group: 'product_management', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/telegram',
    label: 'Telegram',
    icon: 'message',
    permission: { group: 'system_settings', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/audit',
    label: 'Audit Log',
    icon: 'shield',
    permission: { group: 'system_settings', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/database',
    label: 'Database',
    icon: 'database',
    permission: { group: 'system_settings', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/settings',
    label: 'Platform Settings',
    icon: 'settings',
    permission: { group: 'system_settings', action: 'manage' },
    section: 'platform',
  },

  // ── Account ───────────────────────────────────────────────────────
  {
    path: '/settings',
    label: 'Settings',
    icon: 'settings',
    permission: null,
    section: 'account',
  },
];
