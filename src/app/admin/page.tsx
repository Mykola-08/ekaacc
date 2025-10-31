'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDataService } from '@/services/data-service';
import { User, Session } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Users, Calendar, DollarSign, Activity, TrendingUp, UserCheck, UserX, Shield, Database, Settings } from 'lucide-react';
import { AnimatedCard } from '@/components/eka/animated-card';
import { StatCard } from '@/components/eka/dashboard/stat-card';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editRole, setEditRole] = useState<'Patient' | 'Therapist' | 'Admin'>('Patient');
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const service = await getDataService();
      const [usersData, sessionsData] = await Promise.all([
        service.getAllUsers(),
        service.getSessions()
      ]);
      setUsers(usersData || []);
      setSessions(sessionsData || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.role || 'Patient');
    setShowEditDialog(true);
  };

  const handleUpdateUserRole = async () => {
    if (!selectedUser || !editRole) return;
    setLoading(true);
    try {
      const service = await getDataService();
      await service.updateUser(selectedUser.id, { role: editRole });
      toast({
        title: 'Success',
        description: `User role updated to ${editRole}`
      });
      setShowEditDialog(false);
      await loadDashboardData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;
  const therapists = users.filter(u => u.role === 'Therapist').length;
  const patients = users.filter(u => u.role === 'Patient').length;
  const totalSessions = sessions.length;
  const upcomingSessions = sessions.filter(s => s.status === 'Upcoming').length;
  const completedSessions = sessions.filter(s => s.status === 'Completed').length;
  const canceledSessions = sessions.filter(s => s.status === 'Canceled').length;
  const recentUsers = users.slice(0, 10);

  const adminStats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      change: `${patients} patients`,
      icon: Users,
    },
    {
      title: 'Total Sessions',
      value: totalSessions.toString(),
      change: `${upcomingSessions} upcoming`,
      changeType: 'increase' as const,
      icon: Calendar,
    },
    {
      title: 'Therapists',
      value: therapists.toString(),
      change: 'Active staff',
      icon: UserCheck,
    },
    {
      title: 'System Status',
      value: 'Operational',
      change: 'All services running',
      changeType: 'increase' as const,
      icon: Activity,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-8 p-6">
        <div className="text-center py-12">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">System management and oversight</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/settings">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat, index) => (
          <AnimatedCard key={stat.title} delay={index * 100}>
            <StatCard {...stat} />
          </AnimatedCard>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <AnimatedCard delay={400} asChild>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Users
              </CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.displayName || user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'destructive' : user.role === 'Therapist' ? 'default' : 'secondary'}>
                          {user.role || 'Patient'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => handleEditUser(user)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Session Overview */}
        <AnimatedCard delay={500} asChild>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Session Overview
              </CardTitle>
              <CardDescription>Session statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
                <div>
                  <p className="text-sm text-muted-foreground">Sessions Completed</p>
                  <p className="text-2xl font-bold text-success">{completedSessions}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{upcomingSessions}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950">
                <div>
                  <p className="text-sm text-muted-foreground">Canceled</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{canceledSessions}</p>
                </div>
                <UserX className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Quick Actions */}
      <AnimatedCard delay={600} asChild>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Manage Users</span>
                </Button>
              </Link>
              <Link href="/admin/sessions">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>View Sessions</span>
                </Button>
              </Link>
              <Link href="/admin/subscriptions">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span>Subscriptions</span>
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Settings className="h-6 w-6" />
                  <span>Settings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.displayName || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={editRole} onValueChange={(value: any) => setEditRole(value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Patient">Patient</SelectItem>
                  <SelectItem value="Therapist">Therapist</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateUserRole} disabled={loading}>
              {loading ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
