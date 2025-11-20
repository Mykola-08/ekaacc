'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Users, Calendar, DollarSign, Activity, TrendingUp, UserCheck, UserX, Shield, Eye } from 'lucide-react';
import { UserImpersonationDialog } from '@/components/admin/user-impersonation';
import { useAuth } from '@/context/auth-context';
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
    <Card className="p-6 border-muted hover:border-border transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold text-primary">{value}</p>
        <p className="text-sm text-muted-foreground">{change}</p>
      </div>
    </Card>
  );
}

function MinimalRecentUsers({ users }: { users: User[] }) {
  return (
    <Card className="p-6 border-muted hover:border-border transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Recent Users</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/admin/users'}
        >
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {users.slice(0, 5).map((user, idx) => (
          <motion.div 
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg border border-muted hover:border-border transition-all duration-300"
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
      </div>
    </Card>
  );
}

function MinimalRecentSessions({ sessions }: { sessions: Session[] }) {
  return (
    <Card className="p-6 border-muted hover:border-border transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Recent Sessions</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/admin/sessions'}
        >
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {sessions.slice(0, 5).map((session, idx) => (
          <motion.div 
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg border border-muted hover:border-border transition-all duration-300"
          >
            <div>
              <p className="font-medium">{session.therapist}</p>
              <p className="text-sm text-muted-foreground">{session.type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
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
    user.role.name === 'admin'
  );

  const handleImpersonate = async (targetUserId: string, reason: string) => {
    const { error } = await startImpersonation(targetUserId, reason);
    if (error) {
      toast({
        title: 'Impersonation Failed',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Impersonation Started',
        description: 'You are now viewing the platform as the selected user'
      });
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
      const activeUsers = users.filter((u: any) => u.lastActive && 
        new Date(u.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      const totalSessions = sessions.length;
      const totalRevenue = sessions.reduce((sum: number, session: any) => sum + (session.price || 0), 0);

      const recentUsers = users
        .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 10);

      const recentSessions = sessions
        .sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
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
        <div className="text-center space-y-4">
          <div className="eka-spinner w-12 h-12 mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
            </div>
            <p className="text-xl text-muted-foreground">Overview of platform activity and user management</p>
          </div>
          <div className="flex gap-2">
            {canImpersonate && (
              <Button 
                variant="outline" 
                size="default"
                onClick={() => setShowImpersonationDialog(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Impersonate User
              </Button>
            )}
            <Button 
              variant="outline" 
              size="default"
              onClick={() => window.location.href = '/admin/create-user'}
            >
              <Users className="w-4 h-4 mr-2" />
              Create User
            </Button>
            <Button 
              variant="default" 
              size="default"
              onClick={() => window.location.href = '/admin/settings'}
            >
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { title: "Total Users", value: stats.totalUsers.toString(), change: "All registered users", icon: Users },
            { title: "Active Users", value: stats.activeUsers.toString(), change: "Active in last 7 days", icon: UserCheck },
            { title: "Total Sessions", value: stats.totalSessions.toString(), change: "All completed sessions", icon: Calendar },
            { title: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, change: "Total platform revenue", icon: DollarSign }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <MinimalStatCard {...stat} />
            </motion.div>
          ))}
        </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <MinimalRecentUsers users={stats.recentUsers} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <MinimalRecentSessions sessions={stats.recentSessions} />
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="p-6 border-muted hover:border-border transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button 
                variant="outline" 
                size="default"
                className="w-full"
                onClick={() => window.location.href = '/admin/users'}
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button 
                variant="outline" 
                size="default"
                className="w-full"
                onClick={() => window.location.href = '/admin/subscriptions'}
              >
                <Activity className="w-4 h-4 mr-2" />
                Subscriptions
          </Button>
          <Button 
            variant="outline" 
            size="default"
            className="w-full"
            onClick={() => window.location.href = '/admin/payments'}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Payments
          </Button>
          <Button 
            variant="outline" 
            size="default"
            className="w-full"
            onClick={() => window.location.href = '/admin/settings'}
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </Button>
        </div>
      </Card>

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