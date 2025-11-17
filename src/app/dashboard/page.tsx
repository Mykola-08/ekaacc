'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const { user, isLoading } = useSimpleAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      if (user.role.name === 'therapist') {
        router.push('/therapist/dashboard')
      } else {
        // Default to patient/home dashboard for regular users and patients
        router.push('/home')
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Redirecting to your dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we load your personalized experience.</p>
        </div>
      </div>
    </AuthGuard>
  )
}
