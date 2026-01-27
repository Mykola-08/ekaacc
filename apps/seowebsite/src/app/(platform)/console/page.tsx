'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/platform/auth-context';
import { getDataService } from '@/lib/platform/services/data-service';
import type { User, Session } from '@/lib/platform/types/types';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { AdminDashboardHeadless } from '@/components/platform/admin/admin-dashboard-headless';

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    totalRevenue: 0,
    recentUsers: [] as User[],
    recentSessions: [] as Session[]
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const dataService = await getDataService();
      const [users, sessions] = await Promise.all([
        dataService.getAllUsers(),
        dataService.getSessions()
      ]);

      const totalUsers = users.length;
      // Filter active users (last 7 days)
      const activeUsers = users.filter((u: any) => 
        u.lastActive && new Date(u.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      
      const totalSessions = sessions.length;
      const totalRevenue = sessions.reduce((sum: number, session: any) => sum + (session.price || 0), 0);

      const recentUsers = users.sort((a: any, b: any) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      ).slice(0, 10);
      
      const recentSessions = sessions.sort((a: any, b: any) => 
        new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
      ).slice(0, 10);

      setStats({ 
        totalUsers, 
        activeUsers, 
        totalSessions, 
        totalRevenue, 
        recentUsers: recentUsers as any, 
        recentSessions: recentSessions as any 
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to load dashboard data. Using mock data for display.', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => { 
    fetchDashboardData(); 
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Adapt stats for headless component
  const kpiStats = {
      users_total: stats.totalUsers,
      revenue_mtd: stats.totalRevenue,
      users_growth_pct: 12, // Mock growth for now
      revenue_growth_pct: 8, 
      active_users: stats.activeUsers,
      systemHealth: 'healthy' as const
  };

  return <AdminDashboardHeadless kpiStats={kpiStats as any} />;
}
