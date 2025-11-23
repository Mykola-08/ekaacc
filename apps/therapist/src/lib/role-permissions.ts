export type SystemRole = 
  | 'Admin'
  | 'Therapist'
  | 'Reception'
  | 'Patient'
  | 'VIP Patient'
  | 'Corporate Client'
  | 'Content Manager'
  | 'Marketing'
  | 'Accountant'
  | 'Custom';

export type PermissionGroup = 
  | 'user_management'
  | 'content_management'
  | 'product_management'
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
  'Admin': 10,
  'Content Manager': 8,
  'Marketing': 7,
  'Accountant': 7,
  'Therapist': 6,
  'Reception': 5,
  'Corporate Client': 4,
  'VIP Patient': 3,
  'Patient': 2,
  'Custom': 1
};

export const SYSTEM_ROLES: Record<SystemRole, RoleDefinition> = {
  Admin: {
    name: 'Admin',
    description: 'Full system access with complete administrative privileges',
    hierarchyLevel: 10,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      // User Management
      { group: 'user_management', action: 'create' },
      { group: 'user_management', action: 'read' },
      { group: 'user_management', action: 'update' },
      { group: 'user_management', action: 'delete' },
      { group: 'user_management', action: 'manage' },
      
      // Content Management
      { group: 'content_management', action: 'create' },
      { group: 'content_management', action: 'read' },
      { group: 'content_management', action: 'update' },
      { group: 'content_management', action: 'delete' },
      { group: 'content_management', action: 'publish' },
      { group: 'content_management', action: 'manage' },
      
      // Product Management
      { group: 'product_management', action: 'create' },
      { group: 'product_management', action: 'read' },
      { group: 'product_management', action: 'update' },
      { group: 'product_management', action: 'delete' },
      { group: 'product_management', action: 'publish' },
      { group: 'product_management', action: 'manage' },
      
      // Appointment Management
      { group: 'appointment_management', action: 'create' },
      { group: 'appointment_management', action: 'read' },
      { group: 'appointment_management', action: 'update' },
      { group: 'appointment_management', action: 'delete' },
      { group: 'appointment_management', action: 'manage' },
      
      // Financial Management
      { group: 'financial_management', action: 'create' },
      { group: 'financial_management', action: 'read' },
      { group: 'financial_management', action: 'update' },
      { group: 'financial_management', action: 'delete' },
      { group: 'financial_management', action: 'export' },
      { group: 'financial_management', action: 'manage' },
      
      // System Settings
      { group: 'system_settings', action: 'create' },
      { group: 'system_settings', action: 'read' },
      { group: 'system_settings', action: 'update' },
      { group: 'system_settings', action: 'delete' },
      { group: 'system_settings', action: 'manage' },
      
      // Patient Data
      { group: 'patient_data', action: 'view_all' },
      { group: 'patient_data', action: 'update' },
      { group: 'patient_data', action: 'export' },
      
      // Therapist Tools
      { group: 'therapist_tools', action: 'create' },
      { group: 'therapist_tools', action: 'read' },
      { group: 'therapist_tools', action: 'update' },
      { group: 'therapist_tools', action: 'delete' },
      { group: 'therapist_tools', action: 'manage' },
      
      // Analytics
      { group: 'analytics', action: 'read' },
      { group: 'analytics', action: 'export' },
      { group: 'analytics', action: 'manage' },
      
      // Communication
      { group: 'communication', action: 'create' },
      { group: 'communication', action: 'read' },
      { group: 'communication', action: 'update' },
      { group: 'communication', action: 'delete' },
      { group: 'communication', action: 'manage' }
    ]
  },
  
  Therapist: {
    name: 'Therapist',
    description: 'Licensed therapist with access to patient data and therapy tools',
    hierarchyLevel: 6,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      // User Management - Limited basic access + conditional restrictions
      { group: 'user_management', action: 'read' },
      { group: 'user_management', action: 'read', conditions: { role: 'Patient' } },
      { group: 'user_management', action: 'update' },
      { group: 'user_management', action: 'update', conditions: { role: 'Patient', assigned: true } },
      
      // Content Management - Limited
      { group: 'content_management', action: 'create', conditions: { type: 'exercise' } },
      { group: 'content_management', action: 'read' },
      { group: 'content_management', action: 'update', conditions: { author: 'self' } },
      
      // Appointment Management
      { group: 'appointment_management', action: 'create' },
      { group: 'appointment_management', action: 'read', conditions: { assigned: true } },
      { group: 'appointment_management', action: 'update', conditions: { assigned: true } },
      
      // Patient Data - Assigned only
      { group: 'patient_data', action: 'view_own', conditions: { assigned: true } },
      { group: 'patient_data', action: 'update', conditions: { assigned: true } },
      
      // Therapist Tools
      { group: 'therapist_tools', action: 'create' },
      { group: 'therapist_tools', action: 'read' },
      { group: 'therapist_tools', action: 'update', conditions: { author: 'self' } },
      { group: 'therapist_tools', action: 'delete', conditions: { author: 'self' } },
      
      // Communication - Limited
      { group: 'communication', action: 'create', conditions: { recipient_role: 'Patient' } },
      { group: 'communication', action: 'read', conditions: { participant: true } }
    ]
  },
  
  Reception: {
    name: 'Reception',
    description: 'Front desk staff managing appointments and basic patient info',
    hierarchyLevel: 5,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      // User Management - Basic
      { group: 'user_management', action: 'read', conditions: { role: 'Patient' } },
      { group: 'user_management', action: 'update', conditions: { role: 'Patient', field: 'basic_info' } },
      
      // Appointment Management
      { group: 'appointment_management', action: 'create' },
      { group: 'appointment_management', action: 'read' },
      { group: 'appointment_management', action: 'update' },
      
      // Financial Management - Payments only
      { group: 'financial_management', action: 'create', conditions: { type: 'payment' } },
      { group: 'financial_management', action: 'read', conditions: { type: 'payment' } },
      { group: 'financial_management', action: 'update', conditions: { type: 'payment' } },
      
      // Patient Data - Basic only
      { group: 'patient_data', action: 'view_own', conditions: { type: 'basic_info' } },
      
      // Communication - Limited
      { group: 'communication', action: 'create', conditions: { type: 'appointment_related' } },
      { group: 'communication', action: 'read', conditions: { participant: true } }
    ]
  },
  
  'Corporate Client': {
    name: 'Corporate Client',
    description: 'Corporate representative managing employee appointments',
    hierarchyLevel: 4,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      // User Management - Corporate employees only
      { group: 'user_management', action: 'read', conditions: { corporate_id: 'own' } },
      { group: 'user_management', action: 'create', conditions: { corporate_id: 'own' } },
      { group: 'user_management', action: 'update', conditions: { corporate_id: 'own' } },
      
      // Appointment Management - Corporate only
      { group: 'appointment_management', action: 'create', conditions: { corporate_id: 'own' } },
      { group: 'appointment_management', action: 'read', conditions: { corporate_id: 'own' } },
      { group: 'appointment_management', action: 'update', conditions: { corporate_id: 'own' } },
      
      // Financial Management - Corporate only
      { group: 'financial_management', action: 'read', conditions: { corporate_id: 'own' } },
      
      // Analytics - Corporate only
      { group: 'analytics', action: 'read', conditions: { corporate_id: 'own' } }
    ]
  },
  
  'VIP Patient': {
    name: 'VIP Patient',
    description: 'Premium patient with priority access and VIP content',
    hierarchyLevel: 3,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      // Content Management - VIP content
      { group: 'content_management', action: 'read', conditions: { vip_content: true } },
      
      // Appointment Management
      { group: 'appointment_management', action: 'create' },
      { group: 'appointment_management', action: 'read', conditions: { own: true } },
      { group: 'appointment_management', action: 'update', conditions: { own: true } },
      { group: 'appointment_management', action: 'delete', conditions: { own: true } },
      
      // Patient Data - Own only
      { group: 'patient_data', action: 'view_own', conditions: { own: true } },
      { group: 'patient_data', action: 'update', conditions: { own: true } },
      
      // Communication
      { group: 'communication', action: 'create' },
      { group: 'communication', action: 'read', conditions: { participant: true } },
      { group: 'communication', action: 'update', conditions: { own: true } },
      { group: 'communication', action: 'delete', conditions: { own: true } }
    ]
  },
  
  Patient: {
    name: 'Patient',
    description: 'Standard patient with basic access to services',
    hierarchyLevel: 2,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      // Content Management - Standard content only
      { group: 'content_management', action: 'read', conditions: { patient_content: true } },
      
      // Appointment Management - Own only
      { group: 'appointment_management', action: 'create' },
      { group: 'appointment_management', action: 'read', conditions: { own: true } },
      { group: 'appointment_management', action: 'update', conditions: { own: true } },
      { group: 'appointment_management', action: 'delete', conditions: { own: true } },
      
      // Patient Data - Own only
      { group: 'patient_data', action: 'view_own', conditions: { own: true } },
      { group: 'patient_data', action: 'update', conditions: { own: true } },
      
      // Communication - Limited
      { group: 'communication', action: 'create' },
      { group: 'communication', action: 'read', conditions: { participant: true } },
      { group: 'communication', action: 'update', conditions: { own: true } }
    ]
  },
  
  'Content Manager': {
    name: 'Content Manager',
    description: 'Manages articles, exercises, media, and content library',
    hierarchyLevel: 8,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      // Content Management
      { group: 'content_management', action: 'create' },
      { group: 'content_management', action: 'read' },
      { group: 'content_management', action: 'update' },
      { group: 'content_management', action: 'delete' },
      { group: 'content_management', action: 'publish' },
      { group: 'content_management', action: 'manage' },
      
      // Category Management
      { group: 'system_settings', action: 'update', conditions: { type: 'categories' } }
    ]
  },
  
  Marketing: {
    name: 'Marketing',
    description: 'Manages analytics, banners, announcements, and A/B testing',
    hierarchyLevel: 7,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      // Analytics
      { group: 'analytics', action: 'read' },
      { group: 'analytics', action: 'export' },
      { group: 'analytics', action: 'manage' },
      
      // Content Management - Marketing content
      { group: 'content_management', action: 'create', conditions: { type: 'marketing' } },
      { group: 'content_management', action: 'read' },
      { group: 'content_management', action: 'update', conditions: { type: 'marketing' } },
      { group: 'content_management', action: 'publish', conditions: { type: 'marketing' } },
      
      // System Settings - Marketing settings
      { group: 'system_settings', action: 'read' },
      { group: 'system_settings', action: 'update', conditions: { type: 'marketing' } }
    ]
  },
  
  Accountant: {
    name: 'Accountant',
    description: 'Manages financial data, invoices, transactions, and reports',
    hierarchyLevel: 7,
    isSystemRole: true,
    canBeModified: false,
    permissions: [
      // Financial Management
      { group: 'financial_management', action: 'create' },
      { group: 'financial_management', action: 'read' },
      { group: 'financial_management', action: 'update' },
      { group: 'financial_management', action: 'delete' },
      { group: 'financial_management', action: 'export' },
      { group: 'financial_management', action: 'manage' },
      
      // Analytics - Financial only
      { group: 'analytics', action: 'read', conditions: { type: 'financial' } },
      { group: 'analytics', action: 'export', conditions: { type: 'financial' } }
    ]
  },
  
  Custom: {
    name: 'Custom',
    description: 'Custom role with configurable permissions',
    hierarchyLevel: 1,
    isSystemRole: false,
    canBeModified: true,
    permissions: []
  }
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
  const roleDefinition = SYSTEM_ROLES[userRole as SystemRole];
  if (!roleDefinition) return false;
  
  // If no conditions provided, check for unconditional permissions only
  if (!conditions) {
    return roleDefinition.permissions.some(permission => {
      if (permission.group !== permissionGroup || permission.action !== action) {
        return false;
      }
      return !permission.conditions;
    });
  }
  
  // If conditions provided, first check for exact conditional matches
  const conditionalMatches = roleDefinition.permissions.filter(permission => {
    if (permission.group !== permissionGroup || permission.action !== action) {
      return false;
    }
    return permission.conditions;
  });
  
  // If there are conditional permissions, check if any match the conditions
  if (conditionalMatches.length > 0) {
    return conditionalMatches.some(permission => {
      return Object.entries(permission.conditions!).every(([key, value]) => {
        return conditions[key] === value;
      });
    });
  }
  
  // No conditional permissions found, check for unconditional permissions
  return roleDefinition.permissions.some(permission => {
    if (permission.group !== permissionGroup || permission.action !== action) {
      return false;
    }
    return !permission.conditions;
  });
}

export function getRolePermissions(role: SystemRole | string): Permission[] {
  const roleDefinition = SYSTEM_ROLES[role as SystemRole];
  return roleDefinition ? roleDefinition.permissions : [];
}

export function canAccessResource(
  userRole: SystemRole | string,
  resource: string,
  action: PermissionAction,
  context?: Record<string, any>
): boolean {
  const roleDefinition = SYSTEM_ROLES[userRole as SystemRole];
  if (!roleDefinition) return false;
  
  // Map resource to permission group
  const resourceToGroup: Record<string, PermissionGroup> = {
    'users': 'user_management',
    'appointments': 'appointment_management',
    'content': 'content_management',
    'products': 'product_management',
    'payments': 'financial_management',
    'settings': 'system_settings',
    'patient_data': 'patient_data',
    'therapist_tools': 'therapist_tools',
    'analytics': 'analytics',
    'messages': 'communication'
  };
  
  const group = resourceToGroup[resource];
  if (!group) return false;
  
  return hasPermission(userRole, group, action, context);
}