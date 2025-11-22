"use client"
import { ReactNode, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: ReactNode
  requiredScopes?: string[]
  loadingFallback?: ReactNode
  unauthorizedFallback?: ReactNode
}

function hasAllScopes(scopeString: string | undefined, needed: string[]) {
  if (!needed.length) return true
  if (!scopeString) return false
  const granted = scopeString.split(' ')
  return needed.every(s => granted.includes(s))
}

export function AuthGuard({
  children,
  requiredScopes = [],
  loadingFallback = <div className="p-4 text-sm">Loading session...</div>,
  unauthorizedFallback = <div className="p-4 text-sm text-red-600">Not authorized.</div>,
}: AuthGuardProps) {
  const { isLoading, isAuthenticated, loginWithRedirect, user, getAccessTokenSilently } = useAuth0()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: window.location.pathname } })
    }
  }, [isLoading, isAuthenticated, loginWithRedirect])

  if (isLoading) return <>{loadingFallback}</>
  if (!isAuthenticated) return <>{loadingFallback}</>

  // Scope check (async fetch token if needed)
  const scopeString = (user as any)?.scope as string | undefined
  if (requiredScopes.length && !hasAllScopes(scopeString, requiredScopes)) {
    return <>{unauthorizedFallback}</>
  }

  return <>{children}</>
}
