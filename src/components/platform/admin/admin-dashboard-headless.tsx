'use client';

import React, { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import {
  Shield,
  Users,
  Activity,
  BarChart3,
  Settings,
  Calendar,
  DollarSign,
  Eye,
  Package,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/context/platform/auth-context';
import { AdminBookingTableHeadless as AdminBookingTable } from '@/components/platform/admin/admin-booking-table-headless';
import { RoleManagementPanelHeadless as RoleManagementPanel } from '@/components/platform/admin/role-management-panel-headless';
import { AdminKPI } from '@/app/actions/admin';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface DashboardProps {
  kpiStats?: AdminKPI;
}

export function AdminDashboardHeadless({ kpiStats }: DashboardProps) {
  const { user } = useAuth();

  const stats = {
    revenueMtd: kpiStats?.revenue_mtd || 0,
    revenueGrowth: kpiStats?.revenue_growth_pct || 0,
    totalUsers: kpiStats?.users_total || 0,
    usersGrowth: kpiStats?.users_growth_pct || 0,
    systemHealth: 'healthy' as const,
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-success bg-success';
      case 'warning':
        return 'text-warning bg-warning';
      case 'critical':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted/30';
    }
  };

  const tabs = [
    { name: 'Overview', icon: BarChart3 },
    { name: 'Bookings', icon: Calendar },
    { name: 'Role Management', icon: Users },
    { name: 'Audit', icon: Shield },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto w-full max-w-7xl space-y-8 duration-500">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-4xl font-semibold tracking-tight">Admin Console</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            System administration and performance monitoring.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
              getHealthColor(stats.systemHealth)
            )}
          >
            <Activity className="h-4 w-4" />
            <span className="capitalize">System {stats.systemHealth}</span>
          </div>
          <button className="text-muted-foreground/80 hover:text-muted-foreground hover:bg-muted rounded-full p-2 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card group relative overflow-hidden rounded-lg p-6 shadow-sm ring-1 ring-border">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-2xl" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-muted-foreground text-sm font-medium">Total Users</h3>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-foreground text-3xl font-semibold">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center text-xs font-medium text-success">
              <span>+{stats.usersGrowth}% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-card group relative overflow-hidden rounded-lg p-6 shadow-sm ring-1 ring-border">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-success/50 blur-2xl" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-muted-foreground text-sm font-medium">Revenue (MTD)</h3>
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div className="text-foreground text-3xl font-semibold">
              �{stats.revenueMtd.toLocaleString()}
            </div>
            <div className="text-muted-foreground/80 mt-2 text-xs">Plan & Service Revenue</div>
          </div>
        </div>

        <div className="bg-card group relative overflow-hidden rounded-lg p-6 shadow-sm ring-1 ring-border">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/50 blur-2xl" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-muted-foreground text-sm font-medium">Growth</h3>
              <BarChart3 className="h-5 w-5 text-chart-4" />
            </div>
            <div className="text-foreground text-3xl font-semibold">{stats.revenueGrowth}%</div>
            <div className="text-muted-foreground/80 mt-2 text-xs">Revenue Growth MoM</div>
          </div>
        </div>

        <div className="bg-card group relative overflow-hidden rounded-lg p-6 shadow-sm ring-1 ring-border">
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-warning/50 blur-2xl" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-muted-foreground text-sm font-medium">System Status</h3>
              <Shield className="h-5 w-5 text-warning" />
            </div>
            <div className="text-foreground text-3xl font-semibold capitalize">
              {stats.systemHealth}
            </div>
            <div className="text-muted-foreground/80 mt-2 text-xs">All services operational</div>
          </div>
        </div>
      </div>

      <TabGroup>
        <TabList className="bg-card/50 flex w-fit space-x-2 rounded-lg border border-border p-1 backdrop-blur-sm">
          {tabs.map(({ name, icon: Icon }) => (
            <Tab
              key={name}
              className={({ selected }) =>
                cn(
                  'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 outline-none',
                  selected
                    ? 'bg-foreground text-background shadow-lg shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {name}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-6">
          <TabPanel className="bg-card rounded-lg p-8 shadow-sm ring-1 ring-border outline-none">
            <h2 className="text-foreground mb-6 text-xl font-semibold">Recent Bookings</h2>
            <AdminBookingTable />
          </TabPanel>

          <TabPanel className="bg-card rounded-lg p-8 shadow-sm ring-1 ring-border outline-none">
            <div className="mb-6 rounded-lg bg-warning/10 p-4 text-sm text-warning">
              Bookings management is also available in the Overview tab.
            </div>
            <AdminBookingTable />
          </TabPanel>

          <TabPanel className="bg-card rounded-lg p-8 shadow-sm ring-1 ring-border outline-none">
            <RoleManagementPanel />
          </TabPanel>

          <TabPanel className="bg-card rounded-lg p-8 shadow-sm ring-1 ring-border outline-none">
            <div className="text-muted-foreground/80 flex h-48 items-center justify-center">
              Audit logs implementation coming soon in next update.
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
