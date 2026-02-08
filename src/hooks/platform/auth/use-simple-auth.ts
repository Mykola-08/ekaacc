import { useAuth } from '@/context/platform/auth-context'

/**
 * Simple auth hook that provides essential auth functionality
 * This is a wrapper around useAuth to provide a cleaner API
 */
export function useSimpleAuth() {
  const auth = useAuth()

  // Map Supabase user to AuthUser interface
  const user = auth.user

  const isLoading = auth.isLoading
  const isAuthenticated = auth.isAuthenticated

  return {
    // User data
    user,
    isLoading,
    isAuthenticated,

    // Authentication actions
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    signInWithOAuth: auth.signInWithOAuth,
    signInWithPasskey: auth.signInWithPasskey,
    registerPasskey: auth.registerPasskey,

    // User management
    updateProfile: auth.updateProfile,
    updatePreferences: auth.updatePreferences,

    // Permission checking (simplified)
    can: auth.canAccessResource,
    canAccessResource: auth.canAccessResource,
    hasPermission: auth.hasPermission,

    // Check if user has admin role
    isAdmin: user?.role?.name === 'admin',

    // Check if user has moderator role
    isModerator: user?.role?.name === 'moderator',

    // Refresh user data
    refreshUser: auth.refreshUser,
  }
}

/**
 * Hook to check if user has specific permissions
 */
export function usePermissions() {
  const auth = useAuth()

  return {
    canReadUsers: auth.hasPermission('users.read'),
    canWriteUsers: auth.hasPermission('users.write'),
    canDeleteUsers: auth.hasPermission('users.delete'),
    canReadContent: auth.hasPermission('content.read'),
    canWriteContent: auth.hasPermission('content.write'),
    canDeleteContent: auth.hasPermission('content.delete'),
    canAccessAdmin: auth.hasPermission('admin.access'),
    canReadRoles: auth.hasPermission('roles.read'),
    canWriteRoles: auth.hasPermission('roles.write'),
    canDeleteRoles: auth.hasPermission('roles.delete'),
  }
}

/**
 * Hook to get user preferences
 */
export function useUserPreferences() {
  const auth = useAuth()

  return {
    preferences: auth.user?.preferences,
    theme: auth.user?.preferences?.theme || 'system',
    language: auth.user?.preferences?.language || 'en',
    timezone: auth.user?.preferences?.timezone || 'UTC',
    emailNotifications: auth.user?.preferences?.email_notifications ?? true,
    pushNotifications: auth.user?.preferences?.push_notifications ?? true,
    updatePreferences: auth.updatePreferences,
  }
}
