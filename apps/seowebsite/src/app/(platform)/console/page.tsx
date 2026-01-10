"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Users, Calendar, DollarSign, Activity, Shield, Eye } from 'lucide-react';
import { UserImpersonationDialog } from '@/components/platform/admin/user-impersonation';
import { useAuth } from '@/context/platform/auth-context';
import { getDataService } from '@/services/data-service';
import type { User, Session } from '@/lib/platform/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { useToast } from '@/hooks/platform/use-toast';

function StatCard({ title, value, change, icon: Icon }: { title: string; value: string; change: string; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}

function RecentUsers({ users }: { users: User[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Users
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/console/users'}>
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.slice(0, 5).map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user.name || user.email}</p>
                  <Badge variant="secondary" className="text-xs mt-1">{user.role}</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                </p>
              </div>
            </motion.div>
          ))}
          {users.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No users found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentSessions({ sessions }: { sessions: Session[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Sessions
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/sessions'}>
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.slice(0, 5).map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div>
                <p className="font-medium">{session.therapist}</p>
                <p className="text-sm text-muted-foreground">{session.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {session.date ? format(new Date(session.date), 'MMM d, yyyy') : 'N/A'}
                </p>
                <Badge variant="outline">{session.status}</Badge>
              </div>
            </motion.div>
          ))}
          {sessions.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No sessions found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, hasPermission, startImpersonation } = useAuth();
  const [showImpersonationDialog, setShowImpersonationDialog] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    totalRevenue: 0,
    recentUsers: [] as User[],
    recentSessions: [] as Session[]
  });
  const [isLoading, setIsLoading] = useState(true);

  const canImpersonate = user && (
    hasPermission('admin.impersonate') ||
    hasPermission('admin.full_access') ||
    user.role?.name?.toLowerCase() === 'admin'
  );

  const handleImpersonate = async (targetUserId: string, reason: string) => {
    const { error } = await startImpersonation(targetUserId, reason);
    if (error) {
      toast({ title: 'Impersonation Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Impersonation Started', description: 'You are now viewing the platform as the selected user' });
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      const dataService = await getDataService();
      const [users, sessions] = await Promise.all([
        dataService.getAllUsers(),
        dataService.getSessions()
      ]);

      const totalUsers = users.length;
      const activeUsers = users.filter((u: any) => u.lastActive && new Date(u.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
      const totalSessions = sessions.length;
      const totalRevenue = sessions.reduce((sum: number, session: any) => sum + (session.price || 0), 0);

      const recentUsers = users.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 10);
      const recentSessions = sessions.sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, 10);

      setStats({ totalUsers, activeUsers, totalSessions, totalRevenue, recentUsers, recentSessions });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({ title: 'Error', description: 'Failed to load dashboard data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Overview of platform activity and user management</p>
        </div>
        <div className="flex gap-2">
          {canImpersonate && (
            <Button variant="outline" onClick={() => setShowImpersonationDialog(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Impersonate User
            </Button>
          )}
          <Button variant="outline" onClick={() => window.location.href = '/admin/users'}>
            <Users className="w-4 h-4 mr-2" />
            Manage Users
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.totalUsers.toString()} change="All registered users" icon={Users} />
        <StatCard title="Active Users" value={stats.activeUsers.toString()} change="Active in last 7 days" icon={Activity} />
        <StatCard title="Total Sessions" value={stats.totalSessions.toString()} change="All time" icon={Calendar} />
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} change="All time earnings" icon={DollarSign} />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentUsers users={stats.recentUsers} />
        <RecentSessions sessions={stats.recentSessions} />
      </div>

      {/* Impersonation Dialog */}
      {canImpersonate && (
        <UserImpersonationDialog
          open={showImpersonationDialog}
          onOpenChange={setShowImpersonationDialog}
          onImpersonate={handleImpersonate}
        />
      )}
    </div>
  );
}
