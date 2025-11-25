export type SystemRole = 
  | 'Admin'
  | 'Therapist'
  | 'Educator'
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
}
