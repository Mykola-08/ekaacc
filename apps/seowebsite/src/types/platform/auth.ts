// Updated Auth definitions
export type UserRole = 'Patient' | 'Therapist' | 'Admin' | 'Super Admin';

export interface Permission {
  id: string;
  name: string;
  description?: string;
  module: string;
  actions: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  [key: string]: any;
}

export interface UserPreference {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  timezone?: string;
  [key: string]: any;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string; // Backwards compatibility
  role?: {
    id?: string;
    name: string;
    description: string | null;
    [key: string]: any;
  };
  permissions: Permission[];
  profile?: UserProfile;
  preferences?: UserPreference;
  settings?: any; // For flexible settings
  user_metadata?: any;
  app_metadata?: any;
  [key: string]: any; // Allow loose typing to ease migration
}

export interface ImpersonationData {
  originalUserId: string;
  targetUserId?: string;
  reason: string;
  startedAt: string;
  originalUserEmail?: string;
  targetUserEmail?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  loading: boolean; // Component compatibility
  isAuthenticated: boolean;
  isImpersonating?: boolean;
  impersonationData?: ImpersonationData | null;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  provider?: string;
}

export interface SignUpCredentials {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export type OAuthProvider = 'google' | 'github' | 'azure' | 'linkedin' | 'twitter';
