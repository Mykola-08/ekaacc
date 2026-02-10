/**
 * Page Permission Configuration
 *
 * Maps dashboard routes to the permission required to access them.
 * Roles are just default permission bundles — each user's effective
 * permissions come from role_permissions + user_custom_permissions.
 *
 * A page with `null` permission is accessible to any authenticated user.
 */

import type { PermissionGroup, PermissionAction } from '@/lib/platform/config/role-permissions';

export interface PagePermission {
  /** Permission group required */
  group: PermissionGroup;
  /** Action within the group */
  action: PermissionAction;
  /** Optional extra conditions */
  conditions?: Record<string, unknown>;
}

export interface PageConfig {
  /** Human-readable label (used in sidebar & breadcrumbs) */
  label: string;
  /** Route path (relative to dashboard root) */
  path: string;
  /** Required permission — null = any authenticated user */
  permission: PagePermission | null;
  /** Icon identifier for the sidebar */
  icon?: string;
  /** Hide from sidebar but still accessible if permission allows */
  hidden?: boolean;
  /** Nested children (for grouped sidebar sections) */
  children?: PageConfig[];
}

// ─── Permission-based page configuration ───────────────────────────

export const PAGE_PERMISSIONS: Record<string, PagePermission | null> = {
  // ── Everyone (any authenticated user) ─────────────────────────
  '/dashboard': null,
  '/profile': null,
  '/settings': null,
  '/notifications': null,
  '/onboarding': null,
  '/status': null,

  // ── Patient pages ─────────────────────────────────────────────
  '/bookings': { group: 'appointment_management', action: 'create' },
  '/wellness': { group: 'patient_data', action: 'view_own' },
  '/finances': { group: 'financial_management', action: 'read' },
  '/resources': { group: 'content_management', action: 'read' },
  '/crisis': null, // Always accessible for safety

  // ── Therapist pages ───────────────────────────────────────────
  '/availability': { group: 'appointment_management', action: 'manage' },
  '/therapist/clients': { group: 'patient_data', action: 'view_own' },
  '/therapist/session-notes': { group: 'therapist_tools', action: 'create' },
  '/therapist/billing': { group: 'financial_management', action: 'read' },

  // ── Console / Admin pages ─────────────────────────────────────
  '/console': { group: 'system_settings', action: 'read' },
  '/console/users': { group: 'user_management', action: 'read' },
  '/console/services': { group: 'product_management', action: 'read' },
  '/console/analytics': { group: 'analytics', action: 'read' },
  '/console/cms': { group: 'content_management', action: 'manage' },
  '/console/database': { group: 'system_settings', action: 'manage' },
  '/console/settings': { group: 'system_settings', action: 'manage' },

  // ── Business / extended admin pages ───────────────────────────
  '/business': { group: 'system_settings', action: 'manage' },
  '/integrations': { group: 'system_settings', action: 'manage' },
  '/ai-insights': { group: 'analytics', action: 'read' },
  '/forms': { group: 'content_management', action: 'create' },
};

// ─── Sidebar navigation structure (permission-gated) ───────────────

export const SIDEBAR_NAV: PageConfig[] = [
  // ── Main ──────────────────────────────────────────────────────
  {
    label: 'Home',
    path: '/dashboard',
    permission: null,
    icon: 'home',
  },
  {
    label: 'Bookings',
    path: '/bookings',
    permission: { group: 'appointment_management', action: 'create' },
    icon: 'calendar',
  },
  {
    label: 'Wellness',
    path: '/wellness',
    permission: { group: 'patient_data', action: 'view_own' },
    icon: 'heart',
  },
  {
    label: 'Finances',
    path: '/finances',
    permission: { group: 'financial_management', action: 'read' },
    icon: 'wallet',
  },
  {
    label: 'Resources',
    path: '/resources',
    permission: { group: 'content_management', action: 'read' },
    icon: 'shield',
  },

  // ── Therapist ─────────────────────────────────────────────────
  {
    label: 'Schedule',
    path: '/availability',
    permission: { group: 'appointment_management', action: 'manage' },
    icon: 'clock',
  },
  {
    label: 'Clients',
    path: '/therapist/clients',
    permission: { group: 'patient_data', action: 'view_own', conditions: { assigned: true } },
    icon: 'users',
  },
  {
    label: 'Session Notes',
    path: '/therapist/session-notes',
    permission: { group: 'therapist_tools', action: 'create' },
    icon: 'edit',
  },

  // ── Console ───────────────────────────────────────────────────
  {
    label: 'Console',
    path: '/console',
    permission: { group: 'system_settings', action: 'read' },
    icon: 'terminal',
    children: [
      {
        label: 'Users',
        path: '/console/users',
        permission: { group: 'user_management', action: 'read' },
        icon: 'users',
      },
      {
        label: 'Services',
        path: '/console/services',
        permission: { group: 'product_management', action: 'read' },
        icon: 'folder',
      },
      {
        label: 'CMS',
        path: '/console/cms',
        permission: { group: 'content_management', action: 'manage' },
        icon: 'book',
      },
      {
        label: 'Analytics',
        path: '/console/analytics',
        permission: { group: 'analytics', action: 'read' },
        icon: 'bar-chart',
      },
      {
        label: 'Database',
        path: '/console/database',
        permission: { group: 'system_settings', action: 'manage' },
        icon: 'database',
      },
      {
        label: 'Settings',
        path: '/console/settings',
        permission: { group: 'system_settings', action: 'manage' },
        icon: 'settings',
      },
    ],
  },

  // ── Extended admin ────────────────────────────────────────────
  {
    label: 'AI Insights',
    path: '/ai-insights',
    permission: { group: 'analytics', action: 'read' },
    icon: 'sparkle',
  },
  {
    label: 'Integrations',
    path: '/integrations',
    permission: { group: 'system_settings', action: 'manage' },
    icon: 'plug',
  },
  // ── Account (always visible) ──────────────────────────────────
  {
    label: 'Profile',
    path: '/profile',
    permission: null,
    icon: 'user',
  },
  {
    label: 'Settings',
    path: '/settings',
    permission: null,
    icon: 'settings',
  },
];

/**
 * Look up the required permission for a given pathname.
 * Matches the longest prefix, so `/console/users/123` matches `/console/users`.
 */
export function getRequiredPermission(pathname: string): PagePermission | null | undefined {
  // Exact match first
  if (pathname in PAGE_PERMISSIONS) {
    return PAGE_PERMISSIONS[pathname];
  }

  // Try progressively shorter prefixes
  const segments = pathname.split('/').filter(Boolean);
  while (segments.length > 0) {
    const prefix = '/' + segments.join('/');
    if (prefix in PAGE_PERMISSIONS) {
      return PAGE_PERMISSIONS[prefix];
    }
    segments.pop();
  }

  // No mapping found — page must define its own guard
  return undefined;
}
