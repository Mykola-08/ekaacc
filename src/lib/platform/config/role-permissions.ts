export type SystemRole =
  | 'admin'
  | 'therapist'
  | 'client'
  | 'patient'
  | 'reception';

// Extended type for potential future roles or mapped roles, user-facing
export type DisplayRole = SystemRole | 'content manager' | 'marketing';

export type PermissionGroup =
  | 'user_management'
  | 'content_management'
  | 'product_management'
  | 'academy_management'
  | 'appointment_management'
  | 'financial_management'
  | 'system_settings'
  | 'patient_data'
  | 'therapist_tools'
  | 'analytics'
  | 'communication';

export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'publish'
  | 'manage'
  | 'view_own'
  | 'view_all'
  | 'assign'
  | 'export';

export interface Permission {
  group: PermissionGroup;
  action: PermissionAction;
  resource?: string;
  conditions?: Record<string, any>;
}

export interface RoleDefinition {
  name: SystemRole;
  description: string;
  permissions: Permission[];
  hierarchyLevel: number;
  isSystemRole: boolean;
  canBeModified: boolean;
  maxUsers?: number;
}

export const ROLE_HIERARCHY: Record<SystemRole, number> = {
  admin: 10,
  therapist: 6,
  reception: 5,
  client: 2,
  patient: 2,
};

// Default definitions - acting as fallback or cache
export const SYSTEM_ROLES: Record<SystemRole, RoleDefinition> = {
  admin: {
    name: 'admin',
    description: 'Full system access with complete administrative privileges',
    hierarchyLevel: 10,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      { group: 'user_management', action: 'manage' },
      { group: 'content_management', action: 'manage' },
      { group: 'academy_management', action: 'manage' },
      { group: 'product_management', action: 'manage' },
      { group: 'appointment_management', action: 'manage' },
      { group: 'financial_management', action: 'manage' },
      { group: 'system_settings', action: 'manage' },
      { group: 'patient_data', action: 'view_all' },
      { group: 'patient_data', action: 'update' },
      { group: 'patient_data', action: 'export' },
      { group: 'therapist_tools', action: 'manage' },
      { group: 'analytics', action: 'manage' },
      { group: 'communication', action: 'manage' },
    ],
  },
  therapist: {
    name: 'therapist',
    description: 'Healthcare provider access',
    hierarchyLevel: 6,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      { group: 'user_management', action: 'read' },
      { group: 'content_management', action: 'read' },
      { group: 'appointment_management', action: 'create' },
      { group: 'appointment_management', action: 'read', conditions: { assigned: true } },
      { group: 'appointment_management', action: 'update', conditions: { assigned: true } },
      { group: 'appointment_management', action: 'manage', conditions: { assigned: true } },
      { group: 'patient_data', action: 'view_own', conditions: { assigned: true } },
      { group: 'patient_data', action: 'update', conditions: { assigned: true } },
      { group: 'therapist_tools', action: 'create' },
      { group: 'therapist_tools', action: 'read' },
      { group: 'therapist_tools', action: 'update', conditions: { author: 'self' } },
      { group: 'therapist_tools', action: 'delete', conditions: { author: 'self' } },
      { group: 'financial_management', action: 'read' },
      { group: 'communication', action: 'create', conditions: { recipient_role: 'patient' } },
      { group: 'communication', action: 'read', conditions: { participant: true } },
    ],
  },
  patient: {
    name: 'patient',
    description: 'Standard user access for patients',
    hierarchyLevel: 2,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      { group: 'content_management', action: 'read', conditions: { patient_content: true } },
      { group: 'appointment_management', action: 'create' },
      { group: 'appointment_management', action: 'read', conditions: { own: true } },
      { group: 'appointment_management', action: 'update', conditions: { own: true } },
      { group: 'appointment_management', action: 'delete', conditions: { own: true } },
      { group: 'patient_data', action: 'view_own', conditions: { own: true } },
      { group: 'patient_data', action: 'update', conditions: { own: true } },
      { group: 'communication', action: 'create' },
      { group: 'communication', action: 'read', conditions: { participant: true } },
      { group: 'communication', action: 'update', conditions: { own: true } },
      { group: 'financial_management', action: 'read' },
    ],
  },
  client: {
    name: 'client',
    description: 'Client access (alias for Patient)',
    hierarchyLevel: 2,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
       { group: 'content_management', action: 'read', conditions: { patient_content: true } },
       { group: 'appointment_management', action: 'create' },
       { group: 'appointment_management', action: 'read', conditions: { own: true } },
       // ... same as patient usually
    ],
  },
  reception: {
    name: 'reception',
    description: 'Front desk and scheduling support',
    hierarchyLevel: 5,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      { group: 'user_management', action: 'read', conditions: { role: 'patient' } },
      { group: 'appointment_management', action: 'create' },
      { group: 'appointment_management', action: 'read' },
      { group: 'appointment_management', action: 'update' },
      { group: 'financial_management', action: 'create', conditions: { type: 'payment' } },
      { group: 'financial_management', action: 'read', conditions: { type: 'payment' } },
      { group: 'patient_data', action: 'view_own', conditions: { type: 'basic_info' } },
    ],
  },
};

export interface CustomRole extends RoleDefinition {
  id: string;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}

export function hasPermission(
  userRole: SystemRole | string,
  permissionGroup: PermissionGroup,
  action: PermissionAction,
  conditions?: Record<string, any>
): boolean {
  // Normalize role to lowercase for lookup
  const normalizedRole = userRole.toLowerCase() as SystemRole;
  const roleDefinition = SYSTEM_ROLES[normalizedRole];
  if (!roleDefinition) return false;

  // If no conditions provided, check for unconditional permissions only
  if (!conditions) {
    return roleDefinition.permissions.some((permission) => {
      if (permission.group !== permissionGroup || permission.action !== action) {
        return false;
      }
      return !permission.conditions;
    });
  }

  // If conditions provided, check for match
  const matchingPermissions = roleDefinition.permissions.filter((permission) => {
    return permission.group === permissionGroup && permission.action === action;
  });

  return matchingPermissions.some((permission) => {
    if (!permission.conditions) return true; // Unconditional permission allows everything
    return Object.entries(permission.conditions).every(([key, value]) => {
      return conditions[key] === value;
    });
  });
}

export function getRolePermissions(role: SystemRole | string): Permission[] {
  const normalizedRole = role.toLowerCase() as SystemRole;
  const roleDefinition = SYSTEM_ROLES[normalizedRole];
  return roleDefinition ? roleDefinition.permissions : [];
}

export function canAccessResource(
  userRole: SystemRole | string,
  resource: string,
  action: PermissionAction,
  context?: Record<string, any>
): boolean {
  // Map resource to permission group
  const resourceToGroup: Record<string, PermissionGroup> = {
    users: 'user_management',
    appointments: 'appointment_management',
    content: 'content_management',
    products: 'product_management',
    payments: 'financial_management',
    settings: 'system_settings',
    patient_data: 'patient_data',
    therapist_tools: 'therapist_tools',
    analytics: 'analytics',
    messages: 'communication',
  };

  const group = resourceToGroup[resource];
  if (!group) return false;

  return hasPermission(userRole, group, action, context);
}
