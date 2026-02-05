'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { Alert, AlertDescription } from '@/components/platform/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs';
import { RoleManagementPanel } from '@/components/platform/admin/role-management-panel';
import { ProductManagementPanel } from '@/components/platform/admin/product-management-panel';
import { AdminBookingTable } from '@/components/platform/admin/AdminBookingTable';
import { UnifiedRoleGuard } from '@/components/platform/auth/unified-role-guard';
import { useAuth } from '@/context/platform/auth-context';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { 
  Shield, 
  Users, 
  Activity,
  BarChart3,
  Settings
} from 'lucide-react';
import { AdminKPI } from '@/app/actions/admin';

interface DashboardProps {
  kpiStats?: AdminKPI;
}

export function AdminDashboard({ kpiStats }: DashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Use props if available, otherwise fallback/mock
  const stats = {
    revenueMtd: kpiStats?.revenue_mtd || 0,
    revenueGrowth: kpiStats?.revenue_growth_pct || 0,
    totalUsers: kpiStats?.users_total || 0,
    usersGrowth: kpiStats?.users_growth_pct || 0,
    systemHealth: 'healthy' as const 
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <UnifiedRoleGuard allowedRoles={['Admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email || 'Admin'}. System administration and role management
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className={getHealthColor(stats.systemHealth)}>
              <Activity className="mr-1 h-3 w-3" />
              System {stats.systemHealth}
            </Badge>
            <Badge variant="secondary">
              <Users className="mr-1 h-3 w-3" />
              {stats.totalUsers} total users
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.usersGrowth > 0 ? '+' : ''}{stats.usersGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue (MTD)</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.revenueMtd.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Plan & Service Revenue
              </p>
            </CardContent>
          </Card>

           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.revenueGrowth}%</div>
              <p className="text-xs text-muted-foreground">
                Revenue Growth MoM
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{stats.systemHealth}</div>
              <p className="text-xs text-muted-foreground">
                All services operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="products">Products & Services</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AdminBookingTable />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>System Alerts</CardTitle>
                    <CardDescription>Recent system notifications and alerts.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>System is running smoothly. No critical alerts.</AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
             </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>View and manage all system bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminBookingTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <RoleManagementPanel />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <ProductManagementPanel />
          </TabsContent>
          
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Audit Logs</CardTitle></CardHeader>
              <CardContent>Audit Log Viewer coming soon</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedRoleGuard>
  );
}
