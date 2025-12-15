// Types for the new clean auth system
export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  personalizationCompleted?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  created_at: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  email_notifications: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuthUser {
  id: string;
  uid?: string; // Alias for id (Firebase compatibility)
  email: string;
  name?: string; // User's display name
  displayName?: string; // Alias for name
  fullName?: string; // Full name
  avatarUrl?: string; // User's avatar URL
  phoneNumber?: string; // Phone number
  user_type?: string; // User type/role
  settings?: Record<string, any>; // User settings
  personalizationCompleted?: boolean; // Whether personalization is done
  donationSeekerReason?: string; // Reason for seeking donations
  isVip?: boolean; // VIP status
  vipTier?: string; // VIP tier level
  role: UserRole;
  permissions: Permission[];
  profile: UserProfile;
  preferences: UserPreference;
  user_metadata?: Record<string, any>; // Supabase user metadata
}

export interface ImpersonationData {
  originalUserId: string;
  originalUserEmail: string;
  targetUserId: string;
  targetUserEmail: string;
  targetUserRole: UserRole;
  targetUserPermissions: Permission[];
  reason: string;
  startedAt: string;
  sessionId: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  loading?: boolean; // Alias for isLoading for backward compatibility
  isAuthenticated: boolean;
  isImpersonating?: boolean;
  impersonationData?: ImpersonationData | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName?: string;
  username?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export type OAuthProvider = 'google' | 'github' | 'twitter' | 'linkedin';

// Permission checking types
export type ResourceType = 'users' | 'roles' | 'content' | 'admin';
export type ActionType = 'read' | 'write' | 'delete' | 'access';
