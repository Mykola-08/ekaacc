"use client"
import { ReactNode, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
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
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login?returnTo=' + encodeURIComponent(window.location.pathname))
    }
  }, [isLoading, user, router])

  if (isLoading) return <>{loadingFallback}</>
  if (!user) return <>{loadingFallback}</>

  // Scope check (async fetch token if needed)
  const scopeString = (user as any)?.scope as string | undefined
  if (requiredScopes.length && !hasAllScopes(scopeString, requiredScopes)) {
    return <>{unauthorizedFallback}</>
  }

  return <>{children}</>
}
