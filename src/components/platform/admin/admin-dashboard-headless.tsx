'use client';

import React, { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/context/platform/auth-context';
import { AdminBookingTable } from '@/components/platform/admin/AdminBookingTable';
import { RoleManagementPanelHeadless as RoleManagementPanel } from '@/components/platform/admin/role-management-panel-headless';
import { AdminKPI } from '@/app/actions/admin';
import { HugeiconsIcon } from '@hugeicons/react';
import { ShieldIcon, UserIcon, Settings01Icon, Calendar03Icon, CreditCardIcon, EyeIcon } from '@hugeicons/core-free-icons';

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
    <div className="">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card text-card-foreground rounded-[var(--radius)] border">
          <div className="flex flex-row items-center justify-between p-6 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Total Revenue</h3>
            <HugeiconsIcon icon={CreditCardIcon} className="text-muted-foreground size-4"  />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.revenueMtd}</div>
            <p className="text-muted-foreground text-xs">{stats.revenueGrowth} from last month</p>
          </div>
        </div>
        {/* Add more cards as needed */}
      </div>

      <div className="">
        <h2 className="text-2xl font-bold tracking-tight">Recent Bookings</h2>
        <AdminBookingTable />
      </div>
    </div>
  );
}
