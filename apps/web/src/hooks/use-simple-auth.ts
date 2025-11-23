import { useAuth } from '@/context/auth-context'
import { useUser } from '@auth0/nextjs-auth0/client'

/**
 * Simple auth hook that provides essential auth functionality
 * This is a wrapper around useAuth to provide a cleaner API
 */
export function useSimpleAuth() {
  const auth = useAuth()
  const { user: auth0User, isLoading: isAuth0Loading } = useUser()

  // Map Auth0 user to AuthUser interface if Supabase user is missing
  const user = auth.user || (auth0User ? {
    id: auth0User.sub || '',
    email: auth0User.email || '',
    name: auth0User.name || '',
    avatarUrl: auth0User.picture || '',
    role: {
      id: 'default',
      name: 'user',
      description: 'Default user role',
      is_active: true,
      created_at: new Date().toISOString()
    },
    permissions: [],
    profile: {
      id: auth0User.sub || '',
      username: auth0User.nickname || null,
      full_name: auth0User.name || null,
      avatar_url: auth0User.picture || null,
      bio: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    preferences: {
      id: 'default',
      user_id: auth0User.sub || '',
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      email_notifications: true,
      push_notifications: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  } as any : null)

  const isLoading = auth.isLoading || isAuth0Loading
  const isAuthenticated = auth.isAuthenticated || !!auth0User

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
    theme: auth.user?.preferences.theme || 'system',
    language: auth.user?.preferences.language || 'en',
    timezone: auth.user?.preferences.timezone || 'UTC',
    emailNotifications: auth.user?.preferences.email_notifications ?? true,
    pushNotifications: auth.user?.preferences.push_notifications ?? true,
    updatePreferences: auth.updatePreferences,
  }
}