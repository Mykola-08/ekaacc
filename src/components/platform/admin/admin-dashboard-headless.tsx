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
import { AdminBookingTable } from '@/components/platform/admin/AdminBookingTable';
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

  // Handle potential null/undefined kpiStats gracefully
  const stats = {
    revenueMtd: kpiStats?.value || '0', // Adjusting to match the new simplified interface
    revenueGrowth: kpiStats?.change || '0',
    totalUsers: '0', // Placeholder
    usersGrowth: '0', // Placeholder
    systemHealth: 'healthy' as const,
  };

  // Note: The AdminKPI interface changed to { label, value, change, trend }
  // We should probably update the dashboard to render a list of KPIs dynamically
  // For now, mapping manually to keep UI intact

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-muted-foreground bg-muted/30';
    }
  };

  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Total Revenue</h3>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">{stats.revenueMtd}</div>
              <p className="text-xs text-muted-foreground">{stats.revenueGrowth} from last month</p>
            </div>
          </div>
          {/* Add more cards as needed */}
       </div>

       <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Recent Bookings</h2>
          <AdminBookingTable />
       </div>
    </div>
  );
}
