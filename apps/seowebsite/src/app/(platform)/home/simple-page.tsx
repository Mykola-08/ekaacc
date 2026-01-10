'use client'

import { EnhancedDashboard } from '@/components/platform/dashboard/enhanced-dashboard'
import { PageContainer } from '@/components/platform/eka/page-container'
import { PageHeader } from '@/components/platform/eka/page-header'

export default function SimplePatientDashboard() {
  return (
    <PageContainer>
      <PageHeader
        title="Your Dashboard"
        description="Track your wellness journey and stay on top of your goals"
        badge="Overview"
      />
      
      <EnhancedDashboard />
    </PageContainer>
  )
}
