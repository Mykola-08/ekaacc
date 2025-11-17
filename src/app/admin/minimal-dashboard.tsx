'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Users, Calendar, DollarSign, Activity, TrendingUp, UserCheck, UserX, Shield } from 'lucide-react';
import { getDataService } from '@/services/data-service';
import type { User, Session } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

function MinimalStatCard({ 
  title, 
  value, 
  change, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  change: string; 
  icon: React.ElementType 
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className="h-5 w-5 text-gray-600" />
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{change}</p>
      </div>
    </Card>
  );
}

function MinimalRecentUsers({ users }: { users: User[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/admin/users'}
        >
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {users.slice(0, 5).map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name || user.email}</p>
                <p className="text-sm text-gray-600">{user.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MinimalRecentSessions({ sessions }: { sessions: Session[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/admin/sessions'}
        >
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {sessions.slice(0, 5).map((session) => (
          <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{session.therapist}</p>
              <p className="text-sm text-gray-600">{session.type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {session.date ? format(new Date(session.date), 'MMM d, yyyy') : 'N/A'}
              </p>
              <p className="text-sm text-gray-600">{session.status}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function MinimalAdminDashboard() {
  const { toast } = useToast();
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
      const dataService = getDataService();
      const [users, sessions] = await Promise.all([
        dataService.getAllUsers(),
        dataService.getAllSessions()
      ]);

      const totalUsers = users.length;
      const activeUsers = users.filter(u => u.lastActive && 
        new Date(u.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      const totalSessions = sessions.length;
      const totalRevenue = sessions.reduce((sum, session) => sum + (session.price || 0), 0);

      const recentUsers = users
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 10);

      const recentSessions = sessions
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
        .slice(0, 10);

      setStats({
        totalUsers,
        activeUsers,
        totalSessions,
        totalRevenue,
        recentUsers,
        recentSessions
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of platform activity and user management</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="md"
            onClick={() => window.location.href = '/admin/create-user'}
          >
            <Users className="w-4 h-4 mr-2" />
            Create User
          </Button>
          <Button 
            variant="default" 
            size="md"
            onClick={() => window.location.href = '/admin/settings'}
          >
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MinimalStatCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          change="All registered users"
          icon={Users}
        />
        <MinimalStatCard
          title="Active Users"
          value={stats.activeUsers.toString()}
          change="Active in last 7 days"
          icon={UserCheck}
        />
        <MinimalStatCard
          title="Total Sessions"
          value={stats.totalSessions.toString()}
          change="All completed sessions"
          icon={Calendar}
        />
        <MinimalStatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change="Total platform revenue"
          icon={DollarSign}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MinimalRecentUsers users={stats.recentUsers} />
        <MinimalRecentSessions sessions={stats.recentSessions} />
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button 
            variant="outline" 
            size="md"
            className="w-full"
            onClick={() => window.location.href = '/admin/users'}
          >
            <Users className="w-4 h-4 mr-2" />
            Manage Users
          </Button>
          <Button 
            variant="outline" 
            size="md"
            className="w-full"
            onClick={() => window.location.href = '/admin/subscriptions'}
          >
            <Activity className="w-4 h-4 mr-2" />
            Subscriptions
          </Button>
          <Button 
            variant="outline" 
            size="md"
            className="w-full"
            onClick={() => window.location.href = '/admin/payments'}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Payments
          </Button>
          <Button 
            variant="outline" 
            size="md"
            className="w-full"
            onClick={() => window.location.href = '/admin/settings'}
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </Button>
        </div>
      </Card>
    </div>
  );
}