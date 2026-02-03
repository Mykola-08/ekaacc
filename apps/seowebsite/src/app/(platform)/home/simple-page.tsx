'use client'

import { BentoDashboard } from '@/components/platform/dashboard/bento-dashboard'
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
   
   <BentoDashboard user={{ name: "Guest", email: "guest@example.com" }} />
  </PageContainer>
 )
}
