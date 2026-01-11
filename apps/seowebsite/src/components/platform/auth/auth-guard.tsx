'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  loadingComponent?: React.ReactNode
  redirectToLogin?: boolean
}

/**
 * Component that only renders children if user is authenticated
 */
export function AuthGuard({ 
  children, 
  fallback, 
  loadingComponent,
  redirectToLogin = true 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useSimpleAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectToLogin) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname || '/')}`)
    }
  }, [isLoading, isAuthenticated, redirectToLogin, router, pathname])

  if (isLoading) {
    return <>{loadingComponent || <div className="p-4 flex justify-center">Loading...</div>}</>
  }

  if (!isAuthenticated) {
    if (redirectToLogin) return null
    return <>{fallback || <div className="p-4 text-center">Please sign in to access this content.</div>}</>
  }

  return <>{children}</>
}

interface PermissionGuardProps {
  children: React.ReactNode
  permission: string
  fallback?: React.ReactNode
  loadingComponent?: React.ReactNode
}

/**
 * Component that only renders children if user has specific permission
 */
export function PermissionGuard({ 
  children, 
  permission, 
  fallback, 
  loadingComponent 
}: PermissionGuardProps) {
  const { hasPermission, isLoading, isAuthenticated } = useSimpleAuth()

  if (isLoading) {
    return <>{loadingComponent || <div className="p-4 flex justify-center">Loading...</div>}</>
  }

  if (!isAuthenticated) {
    return <>{fallback || <div className="p-4 text-center">Please sign in to access this content.</div>}</>
  }

  if (!hasPermission(permission)) {
    return <>{fallback || <div className="p-4 text-center text-red-500">You don't have permission to access this content.</div>}</>
  }

  return <>{children}</>
}

interface ResourceGuardProps {
  children: React.ReactNode
  resource: string
  action: string
  fallback?: React.ReactNode
  loadingComponent?: React.ReactNode
}

/**
 * Component that only renders children if user can access resource with specific action
 */
export function ResourceGuard({ 
  children, 
  resource, 
  action, 
  fallback, 
  loadingComponent 
}: ResourceGuardProps) {
  const { canAccessResource, isLoading, isAuthenticated } = useSimpleAuth()

  if (isLoading) {
    return <>{loadingComponent || <div className="p-4 flex justify-center">Loading...</div>}</>
  }

  if (!isAuthenticated) {
    return <>{fallback || <div className="p-4 text-center">Please sign in to access this content.</div>}</>
  }

  if (!canAccessResource(resource, action)) {
    return <>{fallback || <div className="p-4 text-center text-red-500">You don't have permission to access this content.</div>}</>
  }

  return <>{children}</>
}

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  loadingComponent?: React.ReactNode
}

/**
 * Component that only renders children if user has admin role
 */
export function AdminGuard({ children, fallback, loadingComponent }: AdminGuardProps) {
  const { isAdmin, isLoading, isAuthenticated } = useSimpleAuth()

  if (isLoading) {
    return <>{loadingComponent || <div className="p-4 flex justify-center">Loading...</div>}</>
  }

  if (!isAuthenticated) {
    return <>{fallback || <div className="p-4 text-center">Please sign in to access this content.</div>}</>
  }

  if (!isAdmin) {
    return <>{fallback || <div className="p-4 text-center text-red-500">Admin access required.</div>}</>
  }

  return <>{children}</>
}
