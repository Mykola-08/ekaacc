"use client"
import { ReactNode, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: ReactNode
  requiredScopes?: string[]
  loadingFallback?: ReactNode
  unauthorizedFallback?: ReactNode
}

export function AuthGuard({
  children,
  requiredScopes = [],
  loadingFallback = <div className="p-4 text-sm">Loading session...</div>,
  unauthorizedFallback = <div className="p-4 text-sm text-red-600">Not authorized.</div>,
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to the centralized auth app
      window.location.href = `http://localhost:9005/login?returnTo=${encodeURIComponent(window.location.href)}`
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) return <>{loadingFallback}</>
  if (!isAuthenticated) return <>{loadingFallback}</>

  // TODO: Implement scope/permission check if needed using user.permissions or user.role
  
  return <>{children}</>
}
