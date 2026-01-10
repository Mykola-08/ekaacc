'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSimpleAuth } from '@/hooks/platform/use-simple-auth'
import { AuthGuard } from '@/components/platform/auth/auth-guard'
import { Skeleton } from '@/components/platform/ui/skeleton'
import { PageContainer } from '@/components/platform/eka/page-container'
import { SurfacePanel } from '@/components/platform/eka/surface-panel'

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
        <PageContainer maxWidth="md">
          <SurfacePanel className="flex items-center justify-center">
            <div className="space-y-4 w-full">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-32 w-full" />
            </div>
          </SurfacePanel>
        </PageContainer>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <PageContainer maxWidth="md">
        <SurfacePanel className="flex items-center justify-center text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Redirecting to your dashboard...</h2>
            <p className="text-muted-foreground">Please wait while we load your personalized experience.</p>
          </div>
        </SurfacePanel>
      </PageContainer>
    </AuthGuard>
  )
}
