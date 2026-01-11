'use client'

import { AuthGuard } from '@/components/platform/auth/auth-guard'
import Dashboard from '@/components/platform/dashboard'

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto p-4 md:p-8">
        <Dashboard />
      </div>
    </AuthGuard>
  )
}
