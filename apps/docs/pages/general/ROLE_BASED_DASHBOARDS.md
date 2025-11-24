# Role-Based Dashboards Implementation Guide

Complete guide for implementing and configuring role-based dashboards across the ekaacc platform.

## Overview

The platform now supports **6 distinct dashboard variants** optimized for different user roles:

1. **Patient Dashboard** - Healthcare and wellness focus
2. **Student Dashboard** - Learning and education focus
3. **Hybrid Dashboard** - Combined patient + student features
4. **Enterprise Manager Dashboard** - Team and subscription management
5. **Enterprise Controller Dashboard** - Financial oversight and analytics
6. **Multi-Role Dashboard** - Automatic role detection and switching

---

## Dashboard Routing Architecture

### Automatic Role Detection

```typescript
// utils/dashboard-router.ts
export function getDashboardPath(userRoles: string[]): string {
  // Priority order for multiple roles
  if (userRoles.includes('enterprise_controller')) {
    return '/dashboard/controller';
  }
  if (userRoles.includes('enterprise_manager')) {
    return '/dashboard/manager';
  }
  if (userRoles.includes('patient') && userRoles.includes('student')) {
    return '/dashboard/hybrid';
  }
  if (userRoles.includes('student')) {
    return '/dashboard/student';
  }
  if (userRoles.includes('patient')) {
    return '/dashboard/patient';
  }
  if (userRoles.includes('therapist')) {
    return '/dashboard/therapist';
  }
  
  // Default fallback
  return '/dashboard';
}

// Usage in middleware
export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const userRoles = await getUserRoles(session.user.id);
  const dashboardPath = getDashboardPath(userRoles);
  
  if (request.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }
  
  return NextResponse.next();
}
```

### Role Switcher Component

```typescript
// components/role-switcher.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoleSwitcherProps {
  userRoles: string[];
  currentRole: string;
}

export function RoleSwitcher({ userRoles, currentRole }: RoleSwitcherProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const roleLabels: Record<string, string> = {
    patient: 'Patient Dashboard',
    student: 'Student Dashboard',
    hybrid: 'Combined Dashboard',
    enterprise_manager: 'Manager Dashboard',
    enterprise_controller: 'Controller Dashboard',
    therapist: 'Therapist Dashboard'
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    const path = `/dashboard/${role === 'hybrid' ? 'hybrid' : role.replace('enterprise_', '')}`;
    router.push(path);
  };

  // Only show if user has multiple roles
  if (userRoles.length <= 1) {
    return null;
  }

  return (
    <Select value={selectedRole} onValueChange={handleRoleChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Switch Dashboard" />
      </SelectTrigger>
      <SelectContent>
        {userRoles.map((role) => (
          <SelectItem key={role} value={role}>
            {roleLabels[role] || role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

---

## Dashboard Implementations

### 1. Patient Dashboard

**Location**: `apps/web/src/app/dashboard/patient/page.tsx`

**Features**:
- Mood tracking overview with trend graph
- Recent journal entries
- Upcoming therapy appointments
- Medication reminders
- Wellness coach recommendations
- Crisis resources quick access
- AI-powered mood predictions

**Layout**:
```typescript
export default async function PatientDashboard() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [moodData, appointments, journalEntries, recommendations] = await Promise.all([
    getMoodLogs(userId, 30),
    getUpcomingAppointments(userId),
    getRecentJournalEntries(userId, 5),
    getWellnessRecommendations(userId)
  ]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Wellness Dashboard</h1>
        <RoleSwitcher userRoles={session.user.roles} currentRole="patient" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mood Tracker Widget */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Mood Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <MoodTrendChart data={moodData} />
            <Button onClick={() => router.push('/mood/log')}>Log Mood</Button>
          </CardContent>
        </Card>

        {/* Wellness Coach Widget */}
        <Card>
          <CardHeader>
            <CardTitle>AI Wellness Coach</CardTitle>
          </CardHeader>
          <CardContent>
            <WellnessRecommendations recommendations={recommendations} />
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentsList appointments={appointments} />
          </CardContent>
        </Card>

        {/* Recent Journal Entries */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Journal Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <JournalEntriesList entries={journalEntries} />
          </CardContent>
        </Card>

        {/* Crisis Resources */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Need Help Now?</CardTitle>
          </CardHeader>
          <CardContent>
            <CrisisResources />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 2. Student Dashboard

**Location**: `apps/web/src/app/dashboard/student/page.tsx`

**Features**:
- Enrolled courses with progress
- Continue learning shortcuts
- Certificates earned
- AI study assistant quick access
- Learning streak tracker
- Recommended courses
- Achievement badges

**Layout**:
```typescript
export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [enrollments, certificates, recommendations, achievements] = await Promise.all([
    getCourseEnrollments(userId),
    getUserCertificates(userId),
    getLearningRecommendations(userId),
    getUserAchievements(userId)
  ]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Learning Dashboard</h1>
        <RoleSwitcher userRoles={session.user.roles} currentRole="student" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Learning Progress */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseProgressList enrollments={enrollments} />
          </CardContent>
        </Card>

        {/* AI Study Assistant */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>AI Study Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <AIStudyAssistantWidget />
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card>
          <CardHeader>
            <CardTitle>My Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <CertificatesList certificates={certificates} />
          </CardContent>
        </Card>

        {/* Recommended Courses */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
          </CardHeader>
          <CardContent>
            <RecommendedCoursesList courses={recommendations} />
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <AchievementsBadges achievements={achievements} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 3. Hybrid Dashboard

**Location**: `apps/web/src/app/dashboard/hybrid/page.tsx`

**Features**:
- Unified view of wellness + learning
- Integrated recommendations
- Cross-platform achievements
- Combined progress tracking
- Smart context switching

**Layout**:
```typescript
export default async function HybridDashboard() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [
    moodData,
    enrollments,
    wellnessRecommendations,
    learningRecommendations,
    unifiedAchievements
  ] = await Promise.all([
    getMoodLogs(userId, 30),
    getCourseEnrollments(userId),
    getWellnessRecommendations(userId),
    getLearningRecommendations(userId),
    getUnifiedAchievements(userId)
  ]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Wellness & Learning Hub</h1>
        <RoleSwitcher userRoles={session.user.roles} currentRole="hybrid" />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick Stats */}
            <StatsCard title="Mood Average" value={calculateMoodAverage(moodData)} />
            <StatsCard title="Courses In Progress" value={enrollments.filter(e => !e.completed).length} />
            <StatsCard title="Wellness Score" value={calculateWellnessScore(moodData)} />
            <StatsCard title="Learning Streak" value={calculateLearningStreak(userId)} />

            {/* Unified Recommendations */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Today's Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <UnifiedRecommendations 
                  wellness={wellnessRecommendations} 
                  learning={learningRecommendations} 
                />
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <UnifiedAchievementsList achievements={unifiedAchievements} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wellness">
          {/* Wellness-focused view */}
        </TabsContent>

        <TabsContent value="learning">
          {/* Learning-focused view */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 4. Enterprise Manager Dashboard

**Location**: `apps/admin/src/app/dashboard/manager/page.tsx`

**Features**:
- Team member management
- Usage analytics
- Subscription overview
- Billing management
- Feature access control
- User role assignments

**Layout**:
```typescript
export default async function ManagerDashboard() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.organizationId;

  const [members, usage, subscription, billing] = await Promise.all([
    getOrganizationMembers(orgId),
    getUsageAnalytics(orgId),
    getSubscriptionDetails(orgId),
    getBillingHistory(orgId)
  ]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Enterprise Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quick Stats */}
        <StatsCard title="Active Users" value={members.filter(m => m.isActive).length} />
        <StatsCard title="AI Usage" value={`${usage.aiQueries}/${subscription.aiQueryLimit}`} />
        <StatsCard title="License Tier" value={subscription.planTier} />
        <StatsCard title="Next Billing" value={formatDate(subscription.nextBillingDate)} />

        {/* Team Members */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <Button onClick={() => router.push('/manager/invite')}>Invite User</Button>
          </CardHeader>
          <CardContent>
            <TeamMembersTable members={members} />
          </CardContent>
        </Card>

        {/* Usage Analytics */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageBreakdown usage={usage} />
          </CardContent>
        </Card>

        {/* Billing */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <BillingHistoryTable billing={billing} />
          </CardContent>
        </Card>

        {/* Subscription Management */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionDetails subscription={subscription} />
            <Button onClick={() => router.push('/manager/upgrade')}>Upgrade Plan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 5. Enterprise Controller Dashboard

**Location**: `apps/admin/src/app/dashboard/controller/page.tsx`

**Features**:
- Financial oversight
- Cross-department analytics
- Cost allocation reports
- ROI analysis
- Audit trail access
- Compliance reports

**Layout**:
```typescript
export default async function ControllerDashboard() {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.organizationId;

  const [financials, departments, roi, compliance] = await Promise.all([
    getFinancialMetrics(orgId),
    getDepartmentAnalytics(orgId),
    getROIAnalysis(orgId),
    getComplianceReports(orgId)
  ]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Financial Controller Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Financial Metrics */}
        <StatsCard title="Monthly Spend" value={formatCurrency(financials.monthlySpend)} />
        <StatsCard title="Cost per User" value={formatCurrency(financials.costPerUser)} />
        <StatsCard title="ROI" value={`${financials.roi}%`} />
        <StatsCard title="Budget Utilization" value={`${financials.budgetUtilization}%`} />

        {/* Cost Breakdown */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Cost Breakdown by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <CostAllocationChart departments={departments} />
          </CardContent>
        </Card>

        {/* ROI Analysis */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>ROI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ROIMetrics roi={roi} />
          </CardContent>
        </Card>

        {/* Audit Trail */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Audit Events</CardTitle>
          </CardHeader>
          <CardContent>
            <AuditTrailTable />
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplianceChecklist reports={compliance} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## Database Schema for Roles

```sql
-- User roles (multi-role support)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- patient, student, therapist, enterprise_manager, enterprise_controller
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ, -- Optional expiration
  metadata JSONB, -- Additional role-specific data
  UNIQUE(user_id, role)
);

-- Role permissions
CREATE TABLE role_permissions (
  role VARCHAR(50) NOT NULL,
  feature VARCHAR(100) NOT NULL,
  can_read BOOLEAN DEFAULT false,
  can_write BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_manage BOOLEAN DEFAULT false, -- Can manage other users' access
  PRIMARY KEY (role, feature)
);

-- Indexes
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id) WHERE is_active = true;
CREATE INDEX idx_user_roles_role ON user_roles(role) WHERE is_active = true;
CREATE INDEX idx_role_permissions_role ON role_permissions(role);

-- RLS Policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can view team roles"
  ON user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('enterprise_manager', 'enterprise_controller')
      AND ur.is_active = true
    )
  );
```

---

## Feature Gating

### Frontend Component

```typescript
// components/feature-gate.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface FeatureGateProps {
  feature: string;
  action?: 'read' | 'write' | 'delete' | 'manage';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ 
  feature, 
  action = 'read', 
  children, 
  fallback = null 
}: FeatureGateProps) {
  const { data: session } = useSession();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    async function checkPermission() {
      if (!session?.user?.id) {
        setHasPermission(false);
        return;
      }

      const response = await fetch(`/api/permissions/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature, action })
      });

      const data = await response.json();
      setHasPermission(data.hasPermission);
    }

    checkPermission();
  }, [session, feature, action]);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Usage
<FeatureGate feature="team_management" action="write">
  <InviteUserButton />
</FeatureGate>
```

### Backend Permission Check

```typescript
// lib/permissions.ts
export async function hasPermission(
  userId: string,
  feature: string,
  action: 'read' | 'write' | 'delete' | 'manage' = 'read'
): Promise<boolean> {
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  const roles = userRoles.map(r => r.role);

  const { data: permissions } = await supabase
    .from('role_permissions')
    .select('*')
    .in('role', roles)
    .eq('feature', feature);

  if (!permissions || permissions.length === 0) {
    return false;
  }

  // Check if any role has the required permission
  const actionKey = `can_${action}`;
  return permissions.some(p => p[actionKey] === true);
}

// API Route
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hasPermission: false }, { status: 401 });
  }

  const { feature, action } = await request.json();
  const hasAccess = await hasPermission(session.user.id, feature, action);

  return NextResponse.json({ hasPermission: hasAccess });
}
```

---

## Automatic Role Assignment

### On Subscription Change

```typescript
// lib/subscription-roles.ts
export async function syncRolesWithSubscription(
  userId: string,
  subscriptionTier: string
) {
  const roleMap: Record<string, string[]> = {
    free: [],
    patient_basic: ['patient'],
    student_basic: ['student'],
    hybrid: ['patient', 'student'],
    professional: ['patient', 'student'],
    team: ['patient', 'student', 'enterprise_manager'],
    enterprise: ['patient', 'student', 'enterprise_manager', 'enterprise_controller'],
    enterprise_custom: ['patient', 'student', 'enterprise_manager', 'enterprise_controller']
  };

  const rolesToGrant = roleMap[subscriptionTier] || [];

  // Revoke all existing subscription-based roles
  await supabase
    .from('user_roles')
    .update({ is_active: false })
    .eq('user_id', userId)
    .in('role', ['patient', 'student', 'enterprise_manager', 'enterprise_controller']);

  // Grant new roles
  for (const role of rolesToGrant) {
    await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role,
        is_active: true,
        granted_by: userId, // Self-granted via subscription
        granted_at: new Date().toISOString()
      });
  }
}

// Call from Stripe webhook
app.post('/api/webhooks/stripe', async (req, res) => {
  const event = stripe.webhooks.constructEvent(...);

  if (event.type === 'customer.subscription.created' || 
      event.type === 'customer.subscription.updated') {
    const subscription = event.data.object;
    const userId = subscription.metadata.userId;
    const tier = subscription.metadata.tier;

    await syncRolesWithSubscription(userId, tier);
  }

  res.json({ received: true });
});
```

---

## Implementation Checklist

### Database Setup
- [ ] Run migration to create `user_roles` and `role_permissions` tables
- [ ] Seed default permissions for each role
- [ ] Create RLS policies for security
- [ ] Add indexes for performance

### Backend API
- [ ] Implement permission checking middleware
- [ ] Create role assignment endpoints
- [ ] Add webhook handlers for automatic role sync
- [ ] Implement audit logging for role changes

### Frontend Components
- [ ] Create 6 dashboard page variants
- [ ] Implement RoleSwitcher component
- [ ] Create FeatureGate component
- [ ] Add dashboard routing logic
- [ ] Build role-specific widgets

### Testing
- [ ] Unit tests for permission logic
- [ ] Integration tests for role switching
- [ ] E2E tests for dashboard access
- [ ] Security testing for unauthorized access

### Documentation
- [ ] API documentation for role endpoints
- [ ] User guide for role switching
- [ ] Admin guide for role management
- [ ] Security audit documentation

---

## Best Practices

1. **Always check permissions server-side** - Never rely solely on client-side checks
2. **Log all role changes** - Maintain comprehensive audit trail
3. **Use feature gates liberally** - Prevent accidental feature exposure
4. **Test role switching thoroughly** - Ensure smooth UX when changing roles
5. **Monitor role-based usage** - Track how different roles use the platform
6. **Keep permissions granular** - Fine-grained control is better than coarse
7. **Document role requirements** - Clear documentation for each role's purpose
8. **Plan for role expansion** - Design system to accommodate new roles easily

---

## Troubleshooting

### User Can't See Expected Features

1. Check user_roles table to verify role is granted and active
2. Verify role_permissions table has correct entries for the feature
3. Check subscription tier matches expected roles
4. Review audit logs for recent role changes
5. Clear session cache and re-authenticate

### Dashboard Not Loading

1. Verify middleware is correctly routing based on roles
2. Check that user has at least one active role
3. Ensure RLS policies allow user to read their own roles
4. Review server logs for permission errors

### Role Switching Not Working

1. Verify RoleSwitcher component has correct props
2. Check that user actually has multiple roles
3. Ensure routing logic handles all role combinations
4. Test with fresh browser session

---

## Migration Guide

### From Single-Role to Multi-Role

```sql
-- Backup existing data
CREATE TABLE user_roles_backup AS SELECT * FROM profiles WHERE role IS NOT NULL;

-- Migrate existing roles
INSERT INTO user_roles (user_id, role, granted_at, granted_by, is_active)
SELECT 
  id,
  role,
  created_at,
  id, -- self-granted
  true
FROM profiles
WHERE role IS NOT NULL;

-- Verify migration
SELECT COUNT(*) FROM user_roles;
SELECT COUNT(*) FROM user_roles_backup;
```

---

## Support

For questions or issues with role-based dashboards:
- Email: support@ekaacc.com
- Docs: https://docs.ekaacc.com/roles
- Slack: #dashboard-support
