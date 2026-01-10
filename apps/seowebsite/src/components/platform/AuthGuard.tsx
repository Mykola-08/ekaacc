"use client"
import { ReactNode, useEffect } from 'react'
import { useSimpleAuth } from '@/hooks/platform/use-simple-auth'
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
  const { user, isLoading } = useSimpleAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?returnTo=' + encodeURIComponent(window.location.pathname))
    }
  }, [isLoading, user, router])

  if (isLoading) return <>{loadingFallback}</>
  if (!user) return <>{loadingFallback}</>

  // Scope check (async fetch token if needed)
  // Note: Supabase roles/permissions are handled differently, this is a placeholder for now
  // const scopeString = (user as any)?.scope as string | undefined
  // if (requiredScopes.length && !hasAllScopes(scopeString, requiredScopes)) {
  //   return <>{unauthorizedFallback}</>
  // }

  return <>{children}</>
}
