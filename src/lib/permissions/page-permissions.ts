import type { PermissionGroup, PermissionAction } from '@/lib/platform/config/role-permissions';

// ─── Types ─────────────────────────────────────────────────────────

export interface PagePermission {
  group: PermissionGroup;
  action: PermissionAction;
}

export type SidebarSectionId = 'overview' | 'care' | 'therapist' | 'manage' | 'platform' | 'account';

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
// Ordered for progressive disclosure: overview → personal care
// → therapist tools → manage → admin platform → account

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: 'overview',   label: 'Overview' },
  { id: 'care',       label: 'My Care' },
  { id: 'therapist',  label: 'Therapist' },
  { id: 'manage',     label: 'Manage' },
  { id: 'platform',   label: 'Platform' },
  { id: 'account',    label: 'Account' },
];

// ─── Sidebar navigation registry ──────────────────────────────────
// Principles applied:
//  • Hick's Law: max ~7 visible items per section
//  • Miller's Law: grouped into ≤5 sections
//  • Progressive Disclosure: admin/advanced items in deeper sections
//  • Chunking: related items grouped together
//  • Visual Hierarchy: most-used items at top
//  • Removed duplicates: clients==patients (use patients), wallet==finances
//
// `hidden: true` hides from sidebar but keeps the route accessible.

export const SIDEBAR_NAV: PageConfig[] = [
  // ── Overview — what matters right now ─────────────────────────────
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
    hidden: true,   // accessible via bell icon in topbar
  },

  // ── My Care — personal wellness tools ─────────────────────────────
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
    path: '/goals',
    label: 'Goals',
    icon: 'target',
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
  {
    path: '/resources',
    label: 'Resources',
    icon: 'folder',
    permission: null,
    section: 'care',
  },
  {
    path: '/ai-insights',
    label: 'AI Insights',
    icon: 'sparkle',
    permission: null,
    section: 'care',
  },
  {
    path: '/community',
    label: 'Community',
    icon: 'users',
    permission: null,
    section: 'care',
  },

  // ── Therapist — clinical work (only shown to therapists) ──────────
  {
    path: '/therapist/patients',
    label: 'Patients',
    icon: 'user',
    permission: { group: 'patient_data', action: 'view_all' },
    section: 'therapist',
  },
  {
    path: '/therapist/session-notes',
    label: 'Session Notes',
    icon: 'edit',
    permission: { group: 'therapist_tools', action: 'create' },
    section: 'therapist',
  },
  {
    path: '/therapist/assignments',
    label: 'Homework',
    icon: 'clipboard',
    permission: { group: 'therapist_tools', action: 'create' },
    section: 'therapist',
  },
  {
    path: '/therapist/templates',
    label: 'Templates',
    icon: 'folder',
    permission: { group: 'therapist_tools', action: 'create' },
    section: 'therapist',
  },

  // ── Manage — business & financial ─────────────────────────────────
  {
    path: '/availability',
    label: 'Availability',
    icon: 'clock',
    permission: { group: 'appointment_management', action: 'manage' },
    section: 'manage',
  },
  {
    path: '/finances',
    label: 'Finances',
    icon: 'wallet',
    permission: null,
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

  // ── Platform — admin panel (hidden from non-admins by permission) ──
  {
    path: '/console/users',
    label: 'Users',
    icon: 'users',
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
    path: '/console/analytics',
    label: 'Analytics',
    icon: 'bar-chart',
    permission: { group: 'analytics', action: 'manage' },
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
    path: '/console/features',
    label: 'Feature Flags',
    icon: 'toggle-right',
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
    path: '/console/permissions',
    label: 'Permissions',
    icon: 'shield',
    permission: { group: 'user_management', action: 'manage' },
    section: 'platform',
    hidden: true,   // advanced — accessed from users page
  },
  {
    path: '/console/cms',
    label: 'Content',
    icon: 'pen',
    permission: { group: 'content_management', action: 'manage' },
    section: 'platform',
    hidden: true,
  },
  {
    path: '/console/database',
    label: 'Database',
    icon: 'database',
    permission: { group: 'system_settings', action: 'manage' },
    section: 'platform',
    hidden: true,   // developer tool
  },
  {
    path: '/console/settings',
    label: 'Platform Settings',
    icon: 'settings',
    permission: { group: 'system_settings', action: 'manage' },
    section: 'platform',
    hidden: true,
  },

  // ── Account ───────────────────────────────────────────────────────
  {
    path: '/settings',
    label: 'Settings',
    icon: 'settings',
    permission: null,
    section: 'account',
  },

  // ── Hidden routes (accessible but not in sidebar) ─────────────────
  // Duplicates removed: /therapist/clients → use /therapist/patients
  //                     /wallet → redirects to /finances
  //                     /sessions → use /bookings
  //                     /therapist/resources → use /resources
  //                     /forms, /crisis → not yet implemented
  {
    path: '/wallet',
    label: 'Wallet',
    icon: 'wallet',
    permission: null,
    hidden: true,
  },
  {
    path: '/sessions',
    label: 'Sessions',
    icon: 'calendar',
    permission: null,
    hidden: true,
  },
  {
    path: '/therapist/clients',
    label: 'Clients',
    icon: 'users',
    permission: { group: 'patient_data', action: 'view_all' },
    hidden: true,   // use /therapist/patients instead
  },
  {
    path: '/therapist/resources',
    label: 'Clinical Resources',
    icon: 'folder',
    permission: { group: 'therapist_tools', action: 'create' },
    hidden: true,   // use /resources
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: 'bar-chart',
    permission: null,
    hidden: true,
  },
];
