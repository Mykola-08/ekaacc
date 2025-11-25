'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { safeSupabaseQuery, safeSupabaseUpdate } from '@/lib/supabase-utils'
import type { 
  AuthUser, 
  AuthState, 
  LoginCredentials, 
  SignUpCredentials, 
  AuthError, 
  OAuthProvider,
  UserRole,
  Permission,
  UserProfile,
  UserPreference,
  ImpersonationData
} from '@/types/auth'
import type { PermissionGroup, PermissionAction } from '@/lib/role-permissions'

const supabase = createClient()

interface AuthContextType extends AuthState {
  // Authentication methods
  signIn: (credentials: LoginCredentials) => Promise<{ error: AuthError | null }>
  signUp: (credentials: SignUpCredentials) => Promise<{ error: AuthError | null }>
  signInWithOAuth: (provider: OAuthProvider) => Promise<{ error: AuthError | null }>
  signInWithPasskey: (email?: string) => Promise<{ error: AuthError | null }>
  registerPasskey: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  
  // User management
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>
  updatePreferences: (updates: Partial<UserPreference>) => Promise<{ error: AuthError | null }>
  
  // Role and permission management
  hasPermission: (permission: { group: PermissionGroup; action: PermissionAction; conditions?: Record<string, any> } | string) => boolean
  canAccessResource: (resource: string | { resource: string; action: PermissionAction; context?: Record<string, any> }, action?: string, context?: Record<string, any>) => boolean
  
  // Refresh user data
  refreshUser: () => Promise<void>
  
  // Impersonation methods
  startImpersonation: (targetUserId: string, reason: string) => Promise<{ error: AuthError | null }>
  endImpersonation: (reason?: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    loading: true, // Alias for backward compatibility
    isAuthenticated: false,
    isImpersonating: false,
    impersonationData: null,
  })

  // Load user data from Supabase
  const loadUser = useCallback(async (user: User) => {
    try {
      // Fetch user profile
      const { data: profile } = await safeSupabaseQuery<any>(
        supabase.from('user_profiles').select('*').eq('id', user.id).single()
      )

      // Fetch user role
      const { data: roleAssignment } = await safeSupabaseQuery<{
        role_id: string;
        user_roles: { name: string; description: string | null };
      }>(
        supabase.from('user_role_assignments')
          .select(`
            role_id,
            user_roles!inner(name, description)
          `)
          .eq('user_id', user.id)
          .single()
      )

      // Fetch user permissions
      const { data: permissions } = await safeSupabaseQuery<Permission[]>(
        supabase.from('role_permissions')
          .select(`
            permissions!inner(*)
          `)
          .eq('role_id', roleAssignment?.role_id)
      )

      // Fetch user preferences
      const { data: preferences } = await safeSupabaseQuery<any>(
        supabase.from('user_preferences').select('*').eq('user_id', user.id).single()
      )

      const authUser: AuthUser = {
        id: user.id,
        email: user.email!,
        role: roleAssignment?.user_roles ? {
          id: roleAssignment.role_id,
          name: roleAssignment.user_roles.name,
          description: roleAssignment.user_roles.description,
          is_active: true,
          created_at: user.created_at
        } : { 
          id: 'default',
          name: 'user', 
          description: 'Default user role',
          is_active: true,
          created_at: user.created_at
        },
        permissions: permissions || [],
        profile: profile || {
          id: user.id,
          username: user.email?.split('@')[0] || null,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          bio: null,
          created_at: user.created_at,
          updated_at: user.updated_at!,
        },
        preferences: preferences || {
          id: '',
          user_id: user.id,
          theme: 'system',
          language: 'en',
          timezone: 'UTC',
          email_notifications: true,
          push_notifications: true,
          created_at: user.created_at,
          updated_at: user.updated_at!,
        },
      }

      setState({
        user: authUser,
        isLoading: false,
        loading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Error loading user data:', error)
      setState({
        user: null,
        isLoading: false,
        loading: false,
        isAuthenticated: false,
      })
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth initialization error:', error)
          setState({
            user: null,
            isLoading: false,
            loading: false,
            isAuthenticated: false,
          })
          return
        }

        if (session?.user && mounted) {
          await loadUser(session.user)
        } else if (mounted) {
          setState({
            user: null,
            isLoading: false,
            loading: false,
            isAuthenticated: false,
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setState({
            user: null,
            isLoading: false,
            loading: false,
            isAuthenticated: false,
          })
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (session?.user) {
          await loadUser(session.user)
        } else {
          setState({
            user: null,
            isLoading: false,
            loading: false,
            isAuthenticated: false,
          })
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [loadUser])

  // Authentication methods
  const signIn = async (credentials: LoginCredentials) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        return { error: { message: error.message, code: error.code } }
      }

      return { error: null }
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.fullName,
            username: credentials.username,
          },
        },
      })

      if (error) {
        return { error: { message: error.message, code: error.code } }
      }

      return { error: null }
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const signInWithOAuth = async (provider: OAuthProvider) => {
    try {
      // Preserve intended destination across OAuth redirects
      const params = new URLSearchParams(window.location.search)
      const returnTo = params.get('returnTo') || '/dashboard'
      
      // Configure OAuth options based on provider
      // For Google: request offline access and force consent to get refresh token
      const options: any = {
        redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
      }

      // Google-specific configuration for saving tokens
      // See: https://supabase.com/docs/guides/auth/social-login/auth-google#saving-google-tokens
      if (provider === 'google') {
        options.queryParams = {
          access_type: 'offline', // Request refresh token
          prompt: 'consent', // Force consent screen to ensure refresh token is returned
        }
        // Optional: Request additional scopes beyond the default openid, email, profile
        // options.scopes = 'openid email profile https://www.googleapis.com/auth/calendar.readonly'
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options,
      })

      if (error) {
        return { error: { message: error.message, code: error.code } }
      }

      return { error: null }
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const signInWithPasskey = async (email?: string) => {
    try {
      const { error } = await (supabase.auth as any).signInWithWebAuthn({
        email,
      })

      if (error) {
        return { error: { message: error.message, code: error.code } }
      }

      return { error: null }
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const registerPasskey = async () => {
    try {
      const { data, error } = await (supabase.auth.mfa as any).enroll({
        factorType: 'webauthn',
      })

      if (error) {
        return { error: { message: error.message, code: error.code } }
      }

      return { error: null }
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error: { message: error.message, code: error.code } }
      }

      return { error: null }
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  // User management methods
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) {
      return { error: { message: 'User not authenticated' } }
    }

    try {
      const { error } = await safeSupabaseUpdate<any>(
        'user_profiles',
        updates,
        { id: state.user.id }
      )

      if (error) {
        return { error: { message: error.message } }
      }

      // Refresh user data
      await refreshUser()
      return { error: null }
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const updatePreferences = async (updates: Partial<UserPreference>) => {
    if (!state.user) {
      return { error: { message: 'User not authenticated' } }
    }

    try {
      const { error } = await safeSupabaseUpdate<any>(
        'user_preferences',
        updates,
        { user_id: state.user.id }
      )

      if (error) {
        return { error: { message: error.message } }
      }

      // Refresh user data
      await refreshUser()
      return { error: null }
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  // Permission checking methods
  const hasPermission = useCallback((permission: { group: PermissionGroup; action: PermissionAction; conditions?: Record<string, any> } | string): boolean => {
    if (!state.user) return false
    
    if (typeof permission === 'string') {
      return state.user.permissions.some(p => p.name === permission)
    }
    
    // For object-based permissions, check if user has the specific permission
    const permissionName = `${permission.group}.${permission.action}`
    return state.user.permissions.some(p => p.name === permissionName)
  }, [state.user])

  const canAccessResource = useCallback((resource: string | { resource: string; action: PermissionAction; context?: Record<string, any> }, action?: string, context?: Record<string, any>): boolean => {
    if (!state.user) return false
    
    if (typeof resource === 'string' && action) {
      const permissionName = `${resource}.${action}`
      return hasPermission(permissionName)
    }
    
    if (typeof resource === 'object') {
      const permissionName = `${resource.resource}.${resource.action}`
      return hasPermission(permissionName)
    }
    
    return false
  }, [state.user, hasPermission])

  // Refresh user data
  const refreshUser = async () => {
    if (!state.user) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await loadUser(user)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  // Impersonation methods
  const startImpersonation = async (targetUserId: string, reason: string) => {
    try {
      const response = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId, reason }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: { message: data.error || 'Failed to start impersonation' } }
      }

      // Update state with impersonated user data
      setState(prev => ({
        ...prev,
        user: data.user,
        isImpersonating: true,
        impersonationData: data.impersonation,
      }))

      return { error: null }
    } catch (error) {
      console.error('Impersonation error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const endImpersonation = async (reason?: string) => {
    if (!state.impersonationData) {
      return { error: { message: 'No active impersonation session' } }
    }

    try {
      const params = new URLSearchParams({
        targetUserId: state.impersonationData.targetUserId,
        reason: reason || 'User ended impersonation'
      })

      const response = await fetch(`/api/admin/impersonate?${params}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        return { error: { message: data.error || 'Failed to end impersonation' } }
      }

      // Get the original user data back
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await loadUser(user)
      }

      return { error: null }
    } catch (error) {
      console.error('End impersonation error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const contextValue: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signInWithOAuth,
    signInWithPasskey,
    registerPasskey,
    signOut,
    updateProfile,
    updatePreferences,
    hasPermission,
    canAccessResource,
    refreshUser,
    startImpersonation,
    endImpersonation,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}