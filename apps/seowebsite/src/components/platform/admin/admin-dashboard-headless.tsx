'use client';

import React, { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { Shield, Users, Activity, BarChart3, Settings, Calendar, DollarSign, Eye, Package } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/context/platform/auth-context';
import { AdminBookingTableHeadless as AdminBookingTable } from '@/components/platform/admin/admin-booking-table-headless';
import { RoleManagementPanelHeadless as RoleManagementPanel } from '@/components/platform/admin/role-management-panel-headless';
import { ProductManagementPanelHeadless as ProductManagementPanel } from '@/components/platform/admin/product-management-panel-headless';
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
    systemHealth: 'healthy' as const 
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500 bg-green-50';
      case 'warning': return 'text-yellow-500 bg-yellow-50';
      case 'critical': return 'text-red-500 bg-red-50';
      default: return 'text-muted-foreground bg-muted/30';
    }
  };

  const tabs = [
    { name: 'Overview', icon: BarChart3 },
    { name: 'Bookings', icon: Calendar },
    { name: 'Users & Roles', icon: Users },
    { name: 'Products', icon: Package },
    { name: 'Audit', icon: Shield },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Admin Console</h1>
          <p className="text-muted-foreground mt-2 text-lg">System administration and performance monitoring.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className={cn("px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2", getHealthColor(stats.systemHealth))}>
                <Activity className="w-4 h-4" />
                <span className="capitalize">System {stats.systemHealth}</span>
            </div>
            <button className="p-2 text-muted-foreground/80 hover:text-muted-foreground rounded-full hover:bg-muted transition-colors">
                <Settings className="w-5 h-5" />
            </button>
        </div>
      </div>

       {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-[32px] p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
                    <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
                <div className="mt-2 flex items-center text-xs font-medium text-green-600">
                    <span>+{stats.usersGrowth}% from last month</span>
                </div>
            </div>
          </div>

          <div className="bg-card rounded-[32px] p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Revenue (MTD)</h3>
                    <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-foreground">€{stats.revenueMtd.toLocaleString()}</div>
                <div className="mt-2 text-xs text-muted-foreground/80">
                     Plan & Service Revenue
                </div>
            </div>
          </div>

          <div className="bg-card rounded-[32px] p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Growth</h3>
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stats.revenueGrowth}%</div>
                <div className="mt-2 text-xs text-muted-foreground/80">
                     Revenue Growth MoM
                </div>
             </div>
          </div>

          <div className="bg-card rounded-[32px] p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">System Status</h3>
                    <Shield className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-foreground capitalize">{stats.systemHealth}</div>
                <div className="mt-2 text-xs text-muted-foreground/80">
                     All services operational
                </div>
             </div>
          </div>
      </div>

      <TabGroup>
        <TabList className="flex space-x-2 bg-card/50 p-1 rounded-2xl backdrop-blur-sm border border-gray-100 w-fit">
          {tabs.map(({ name, icon: Icon }) => (
            <Tab
              key={name}
              className={({ selected }) =>
                cn(
                  'flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 outline-none',
                  selected
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                )
              }
            >
              <Icon className="w-4 h-4" />
              {name}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-6">
           <TabPanel className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 outline-none">
              <h2 className="text-xl font-bold text-foreground mb-6">Recent Bookings</h2>
              <AdminBookingTable />
           </TabPanel>
           
           <TabPanel className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 outline-none">
                <div className="bg-amber-50 rounded-2xl p-4 mb-6 text-amber-800 text-sm">
                    Bookings management is also available in the Overview tab.
                </div>
                <AdminBookingTable />
           </TabPanel>

           <TabPanel className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 outline-none">
                <RoleManagementPanel />
           </TabPanel>

           <TabPanel className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 outline-none">
                <ProductManagementPanel />
           </TabPanel>

           <TabPanel className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 outline-none">
                <div className="flex items-center justify-center h-48 text-muted-foreground/80">
                    Audit logs implementation coming soon in next update.
                </div>
           </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
