'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { createSupabaseWithAuth0 } from '@/lib/supabase-auth0'
import { useMemo } from 'react'

/**
 * Hook that combines Auth0 authentication with Supabase client
 * Returns both Auth0 auth state and a Supabase client configured with Auth0 tokens
 */
export function useAuth0Supabase() {
  const { user, error, isLoading } = useUser()
  const router = useRouter()
  
  // Create Supabase client (currently anon as we can't easily get token client-side with this SDK)
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null
    return createSupabaseWithAuth0({} as any)
  }, [])

  const loginWithRedirect = (options?: any) => {
    const returnTo = options?.appState?.returnTo || window.location.pathname
    router.push(`/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`)
  }

  const logout = (options?: any) => {
    const returnTo = options?.logoutParams?.returnTo || window.location.origin
    router.push(`/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`)
  }

  return {
    // Auth0 state
    isAuthenticated: !!user,
    isLoading,
    user,
    error,
    
    // Auth0 methods
    loginWithRedirect,
    loginWithPopup: () => console.warn('loginWithPopup not supported in Next.js Auth0 SDK'),
    logout,
    getAccessTokenSilently: async () => '', // No-op for now
    getIdTokenClaims: async () => null, // No-op for now
    
    // Supabase client
    supabase,
  }
}
