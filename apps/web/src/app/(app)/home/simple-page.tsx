'use client'

import { EnhancedDashboard } from '@/components/dashboard/enhanced-dashboard'
import { PageContainer } from '@/components/eka/page-container'
import { PageHeader } from '@/components/eka/page-header'

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
