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
  { id: 'overview',   label: 'nav.section.overview' },
  { id: 'care',       label: 'nav.section.care' },
  { id: 'therapist',  label: 'nav.section.therapist' },
  { id: 'manage',     label: 'nav.section.manage' },
  { id: 'platform',   label: 'nav.section.platform' },
  { id: 'account',    label: 'nav.section.account' },
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
    label: 'nav.dashboard',
    icon: 'home',
    permission: null,
    section: 'overview',
  },
  {
    path: '/bookings',
    label: 'nav.bookings',
    icon: 'calendar',
    permission: null,
    section: 'overview',
  },
  {
    path: '/chat',
    label: 'nav.chat',
    icon: 'message',
    permission: null,
    section: 'overview',
  },
  {
    path: '/notifications',
    label: 'nav.notifications',
    icon: 'bell',
    permission: null,
    section: 'overview',
    hidden: true,   // accessible via bell icon in topbar
  },

  // ── My Care — personal wellness tools ─────────────────────────────
  {
    path: '/wellness',
    label: 'nav.wellness',
    icon: 'heart',
    permission: null,
    section: 'care',
  },
  {
    path: '/journal',
    label: 'nav.journal',
    icon: 'book',
    permission: null,
    section: 'care',
  },
  {
    path: '/goals',
    label: 'nav.goals',
    icon: 'target',
    permission: null,
    section: 'care',
  },
  {
    path: '/assignments',
    label: 'nav.assignments',
    icon: 'clipboard',
    permission: null,
    section: 'care',
  },
  {
    path: '/resources',
    label: 'nav.resources',
    icon: 'folder',
    permission: null,
    section: 'care',
  },
  {
    path: '/ai-insights',
    label: 'nav.aiInsights',
    icon: 'sparkle',
    permission: null,
    section: 'care',
  },
  {
    path: '/community',
    label: 'nav.community',
    icon: 'users',
    permission: null,
    section: 'care',
  },

  // ── Therapist — clinical work (only shown to therapists) ──────────
  {
    path: '/therapist/patients',
    label: 'nav.patients',
    icon: 'user',
    permission: { group: 'patient_data', action: 'view_all' },
    section: 'therapist',
  },
  {
    path: '/therapist/session-notes',
    label: 'nav.sessionNotes',
    icon: 'edit',
    permission: { group: 'therapist_tools', action: 'create' },
    section: 'therapist',
  },
  {
    path: '/therapist/assignments',
    label: 'nav.homework',
    icon: 'clipboard',
    permission: { group: 'therapist_tools', action: 'create' },
    section: 'therapist',
  },
  {
    path: '/therapist/templates',
    label: 'nav.templates',
    icon: 'folder',
    permission: { group: 'therapist_tools', action: 'create' },
    section: 'therapist',
  },

  // ── Manage — business & financial ─────────────────────────────────
  {
    path: '/availability',
    label: 'nav.availability',
    icon: 'clock',
    permission: { group: 'appointment_management', action: 'manage' },
    section: 'manage',
  },
  {
    path: '/finances',
    label: 'nav.finances',
    icon: 'wallet',
    permission: null,
    section: 'manage',
  },
  {
    path: '/therapist/billing',
    label: 'nav.billing',
    icon: 'credit-card',
    permission: { group: 'therapist_tools', action: 'create' },
    section: 'manage',
  },
  {
    path: '/business',
    label: 'nav.business',
    icon: 'briefcase',
    permission: { group: 'financial_management', action: 'manage' },
    section: 'manage',
  },

  // ── Platform — admin panel (hidden from non-admins by permission) ──
  {
    path: '/console/users',
    label: 'nav.users',
    icon: 'users',
    permission: { group: 'user_management', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/services',
    label: 'nav.services',
    icon: 'wrench',
    permission: { group: 'product_management', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/payments',
    label: 'nav.payments',
    icon: 'credit-card',
    permission: { group: 'financial_management', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/subscriptions',
    label: 'nav.subscriptions',
    icon: 'refresh',
    permission: { group: 'product_management', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/analytics',
    label: 'nav.analytics',
    icon: 'bar-chart',
    permission: { group: 'analytics', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/telegram',
    label: 'nav.telegram',
    icon: 'message',
    permission: { group: 'system_settings', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/features',
    label: 'nav.featureFlags',
    icon: 'toggle-right',
    permission: { group: 'system_settings', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/audit',
    label: 'nav.auditLog',
    icon: 'shield',
    permission: { group: 'system_settings', action: 'manage' },
    section: 'platform',
  },
  {
    path: '/console/permissions',
    label: 'nav.permissions',
    icon: 'shield',
    permission: { group: 'user_management', action: 'manage' },
    section: 'platform',
    hidden: true,   // advanced — accessed from users page
  },
  {
    path: '/console/cms',
    label: 'nav.content',
    icon: 'pen',
    permission: { group: 'content_management', action: 'manage' },
    section: 'platform',
    hidden: true,
  },
  {
    path: '/console/database',
    label: 'nav.database',
    icon: 'database',
    permission: { group: 'system_settings', action: 'manage' },
    section: 'platform',
    hidden: true,   // developer tool
  },
  {
    path: '/console/settings',
    label: 'nav.platformSettings',
    icon: 'settings',
    permission: { group: 'system_settings', action: 'manage' },
    section: 'platform',
    hidden: true,
  },

  // ── Account ───────────────────────────────────────────────────────
  {
    path: '/settings',
    label: 'nav.settings',
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
