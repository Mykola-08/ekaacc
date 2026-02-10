/**
 * EKA Granular Permission System
 *
 * Permissions are atomic capabilities. Roles are just default permission-set
 * presets. When a user lacks access, the error references the specific
 * sub-permission (e.g. "bookings.create") — never the role.
 */

/* ─── Permission Identifiers ─── */

export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',

  // Bookings
  BOOKINGS_VIEW: 'bookings.view',
  BOOKINGS_CREATE: 'bookings.create',
  BOOKINGS_CANCEL: 'bookings.cancel',

  // Journal
  JOURNAL_VIEW: 'journal.view',
  JOURNAL_CREATE: 'journal.create',
  JOURNAL_EDIT: 'journal.edit',

  // Wallet
  WALLET_VIEW: 'wallet.view',
  WALLET_TOPUP: 'wallet.topup',

  // Resources
  RESOURCES_VIEW: 'resources.view',

  // Subscriptions / Plans
  SUBSCRIPTIONS_VIEW: 'subscriptions.view',
  SUBSCRIPTIONS_MANAGE: 'subscriptions.manage',

  // Profile
  PROFILE_VIEW: 'profile.view',
  PROFILE_EDIT: 'profile.edit',

  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_EDIT: 'settings.edit',

  // Notifications
  NOTIFICATIONS_VIEW: 'notifications.view',
  NOTIFICATIONS_MANAGE: 'notifications.manage',

  // Progress Reports
  PROGRESS_REPORTS_VIEW: 'progress_reports.view',

  // Crisis
  CRISIS_ACCESS: 'crisis.access',

  // ── Therapist capabilities ──
  AVAILABILITY_VIEW: 'availability.view',
  AVAILABILITY_MANAGE: 'availability.manage',

  CLIENTS_VIEW: 'clients.view',
  CLIENTS_MANAGE: 'clients.manage',

  SESSION_NOTES_VIEW: 'session_notes.view',
  SESSION_NOTES_CREATE: 'session_notes.create',
  SESSION_NOTES_EDIT: 'session_notes.edit',

  BILLING_VIEW: 'billing.view',
  BILLING_CREATE: 'billing.create',

  TEMPLATES_VIEW: 'templates.view',
  TEMPLATES_MANAGE: 'templates.manage',

  // ── Admin capabilities ──
  USERS_VIEW: 'users.view',
  USERS_MANAGE: 'users.manage',

  SERVICES_VIEW: 'services.view',
  SERVICES_MANAGE: 'services.manage',

  PAYMENTS_VIEW: 'payments.view',
  PAYMENTS_MANAGE: 'payments.manage',

  ANALYTICS_VIEW: 'analytics.view',

  CMS_VIEW: 'cms.view',
  CMS_MANAGE: 'cms.manage',

  SYSTEM_SETTINGS: 'system.settings',
  SYSTEM_ADMIN: 'system.admin',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/* ─── Role → Permission Presets ─── */

const CLIENT_PERMISSIONS: Permission[] = [
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.BOOKINGS_VIEW,
  PERMISSIONS.BOOKINGS_CREATE,
  PERMISSIONS.BOOKINGS_CANCEL,
  PERMISSIONS.JOURNAL_VIEW,
  PERMISSIONS.JOURNAL_CREATE,
  PERMISSIONS.JOURNAL_EDIT,
  PERMISSIONS.WALLET_VIEW,
  PERMISSIONS.WALLET_TOPUP,
  PERMISSIONS.RESOURCES_VIEW,
  PERMISSIONS.SUBSCRIPTIONS_VIEW,
  PERMISSIONS.SUBSCRIPTIONS_MANAGE,
  PERMISSIONS.PROFILE_VIEW,
  PERMISSIONS.PROFILE_EDIT,
  PERMISSIONS.SETTINGS_VIEW,
  PERMISSIONS.SETTINGS_EDIT,
  PERMISSIONS.NOTIFICATIONS_VIEW,
  PERMISSIONS.NOTIFICATIONS_MANAGE,
  PERMISSIONS.PROGRESS_REPORTS_VIEW,
  PERMISSIONS.CRISIS_ACCESS,
];

const THERAPIST_PERMISSIONS: Permission[] = [
  ...CLIENT_PERMISSIONS,
  PERMISSIONS.AVAILABILITY_VIEW,
  PERMISSIONS.AVAILABILITY_MANAGE,
  PERMISSIONS.CLIENTS_VIEW,
  PERMISSIONS.CLIENTS_MANAGE,
  PERMISSIONS.SESSION_NOTES_VIEW,
  PERMISSIONS.SESSION_NOTES_CREATE,
  PERMISSIONS.SESSION_NOTES_EDIT,
  PERMISSIONS.BILLING_VIEW,
  PERMISSIONS.BILLING_CREATE,
  PERMISSIONS.TEMPLATES_VIEW,
  PERMISSIONS.TEMPLATES_MANAGE,
];

const ADMIN_PERMISSIONS: Permission[] = [
  ...THERAPIST_PERMISSIONS,
  PERMISSIONS.USERS_VIEW,
  PERMISSIONS.USERS_MANAGE,
  PERMISSIONS.SERVICES_VIEW,
  PERMISSIONS.SERVICES_MANAGE,
  PERMISSIONS.PAYMENTS_VIEW,
  PERMISSIONS.PAYMENTS_MANAGE,
  PERMISSIONS.ANALYTICS_VIEW,
  PERMISSIONS.CMS_VIEW,
  PERMISSIONS.CMS_MANAGE,
  PERMISSIONS.SYSTEM_SETTINGS,
];

const SUPER_ADMIN_PERMISSIONS: Permission[] = [
  ...ADMIN_PERMISSIONS,
  PERMISSIONS.SYSTEM_ADMIN,
];

export type RoleName = 'client' | 'therapist' | 'admin' | 'super_admin';

export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  client: CLIENT_PERMISSIONS,
  therapist: THERAPIST_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
  super_admin: SUPER_ADMIN_PERMISSIONS,
};

/**
 * Human-readable label for each permission — used in UI & error
 * messages so users see "Book sessions" not "bookings.create".
 */
export const PERMISSION_LABELS: Record<Permission, string> = {
  [PERMISSIONS.DASHBOARD_VIEW]: 'View dashboard',
  [PERMISSIONS.BOOKINGS_VIEW]: 'View bookings',
  [PERMISSIONS.BOOKINGS_CREATE]: 'Book sessions',
  [PERMISSIONS.BOOKINGS_CANCEL]: 'Cancel bookings',
  [PERMISSIONS.JOURNAL_VIEW]: 'View journal',
  [PERMISSIONS.JOURNAL_CREATE]: 'Create journal entries',
  [PERMISSIONS.JOURNAL_EDIT]: 'Edit journal entries',
  [PERMISSIONS.WALLET_VIEW]: 'View wallet',
  [PERMISSIONS.WALLET_TOPUP]: 'Top up wallet',
  [PERMISSIONS.RESOURCES_VIEW]: 'View resources',
  [PERMISSIONS.SUBSCRIPTIONS_VIEW]: 'View plans',
  [PERMISSIONS.SUBSCRIPTIONS_MANAGE]: 'Manage subscriptions',
  [PERMISSIONS.PROFILE_VIEW]: 'View profile',
  [PERMISSIONS.PROFILE_EDIT]: 'Edit profile',
  [PERMISSIONS.SETTINGS_VIEW]: 'View settings',
  [PERMISSIONS.SETTINGS_EDIT]: 'Edit settings',
  [PERMISSIONS.NOTIFICATIONS_VIEW]: 'View notifications',
  [PERMISSIONS.NOTIFICATIONS_MANAGE]: 'Manage notifications',
  [PERMISSIONS.PROGRESS_REPORTS_VIEW]: 'View progress reports',
  [PERMISSIONS.CRISIS_ACCESS]: 'Access crisis support',
  [PERMISSIONS.AVAILABILITY_VIEW]: 'View schedule',
  [PERMISSIONS.AVAILABILITY_MANAGE]: 'Manage availability',
  [PERMISSIONS.CLIENTS_VIEW]: 'View clients',
  [PERMISSIONS.CLIENTS_MANAGE]: 'Manage clients',
  [PERMISSIONS.SESSION_NOTES_VIEW]: 'View session notes',
  [PERMISSIONS.SESSION_NOTES_CREATE]: 'Create session notes',
  [PERMISSIONS.SESSION_NOTES_EDIT]: 'Edit session notes',
  [PERMISSIONS.BILLING_VIEW]: 'View billing',
  [PERMISSIONS.BILLING_CREATE]: 'Create invoices',
  [PERMISSIONS.TEMPLATES_VIEW]: 'View templates',
  [PERMISSIONS.TEMPLATES_MANAGE]: 'Manage templates',
  [PERMISSIONS.USERS_VIEW]: 'View users',
  [PERMISSIONS.USERS_MANAGE]: 'Manage users',
  [PERMISSIONS.SERVICES_VIEW]: 'View services',
  [PERMISSIONS.SERVICES_MANAGE]: 'Manage services',
  [PERMISSIONS.PAYMENTS_VIEW]: 'View payments',
  [PERMISSIONS.PAYMENTS_MANAGE]: 'Manage payments',
  [PERMISSIONS.ANALYTICS_VIEW]: 'View analytics',
  [PERMISSIONS.CMS_VIEW]: 'View CMS',
  [PERMISSIONS.CMS_MANAGE]: 'Manage CMS',
  [PERMISSIONS.SYSTEM_SETTINGS]: 'System settings',
  [PERMISSIONS.SYSTEM_ADMIN]: 'System administration',
};
