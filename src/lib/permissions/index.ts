/**
 * Permissions Module
 *
 * Unified permission system where roles are just default permission bundles.
 * Each user's effective permissions = role defaults + custom overrides.
 *
 * @module permissions
 */

// Page-to-permission mapping & sidebar nav config
export {
  PAGE_PERMISSIONS,
  SIDEBAR_NAV,
  getRequiredPermission,
  type PagePermission,
  type PageConfig,
} from './page-permissions';

// Server-side permission checking
export {
  getDashboardUser,
  userHasPermission,
  userCan,
  type DashboardUser,
  type ResolvedPermission,
} from './server';
