'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
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
  UserPreference 
} from '@/types/auth'

interface AuthContextType extends AuthState {
  // Authentication methods
  signIn: (credentials: LoginCredentials) => Promise<{ error: AuthError | null }>
  signUp: (credentials: SignUpCredentials) => Promise<{ error: AuthError | null }>
  signInWithOAuth: (provider: OAuthProvider) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  
  // User management
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>
  updatePreferences: (updates: Partial<UserPreference>) => Promise<{ error: AuthError | null }>
  
  // Role and permission management
  hasPermission: (permissionName: string) => boolean
  canAccessResource: (resource: string, action: string) => boolean
  
  // Refresh user data
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Load user data from Supabase
  const loadUser = useCallback(async (user: User) => {
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // Fetch user role
      const { data: roleAssignment } = await supabase
        .from('user_role_assignments')
        .select(`
          role_id,
          user_roles!inner(name, description)
        `)
        .eq('user_id', user.id)
        .single()

      // Fetch user permissions
      const { data: permissions } = await supabase
        .from('role_permissions')
        .select(`
          permissions!inner(*)
        `)
        .eq('role_id', roleAssignment?.role_id)

      // Fetch user preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      const authUser: AuthUser = {
        id: user.id,
        email: user.email!,
        role: roleAssignment?.user_roles || { name: 'user', description: 'Default user role' },
        permissions: permissions?.map(p => p.permissions) || [],
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
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Error loading user data:', error)
      setState({
        user: null,
        isLoading: false,
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
            isAuthenticated: false,
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setState({
            user: null,
            isLoading: false,
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', state.user.id)

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
      const { error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', state.user.id)

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
  const hasPermission = useCallback((permissionName: string): boolean => {
    if (!state.user) return false
    return state.user.permissions.some(p => p.name === permissionName)
  }, [state.user])

  const canAccessResource = useCallback((resource: string, action: string): boolean => {
    if (!state.user) return false
    const permissionName = `${resource}.${action}`
    return hasPermission(permissionName)
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

  const contextValue: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    updateProfile,
    updatePreferences,
    hasPermission,
    canAccessResource,
    refreshUser,
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