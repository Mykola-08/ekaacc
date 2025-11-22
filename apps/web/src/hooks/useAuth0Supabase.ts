'use client'

import { useAuth0 } from '@auth0/auth0-react'
import { createSupabaseWithAuth0 } from '@/lib/supabase-auth0'
import { useMemo } from 'react'

/**
 * Hook that combines Auth0 authentication with Supabase client
 * Returns both Auth0 auth state and a Supabase client configured with Auth0 tokens
 */
export function useAuth0Supabase() {
  const auth0 = useAuth0()
  
  // Create Supabase client with Auth0 token provider
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null
    return createSupabaseWithAuth0(auth0 as any)
  }, [auth0.isAuthenticated, auth0.user])

  return {
    // Auth0 state
    isAuthenticated: auth0.isAuthenticated,
    isLoading: auth0.isLoading,
    user: auth0.user,
    error: auth0.error,
    
    // Auth0 methods
    loginWithRedirect: auth0.loginWithRedirect,
    loginWithPopup: auth0.loginWithPopup,
    logout: auth0.logout,
    getAccessTokenSilently: auth0.getAccessTokenSilently,
    getIdTokenClaims: auth0.getIdTokenClaims,
    
    // Supabase client with Auth0 tokens
    supabase,
  }
}
