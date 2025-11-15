'use client';

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Label, Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, Select, SelectContent, SelectItem, SelectValue, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/keep';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Users, Calendar, DollarSign, Activity, TrendingUp, UserCheck, UserX, Shield, Database, Settings } from 'lucide-react';

import { getDataService } from '@/services/data-service';
import type { User, Session } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
;
;
;
;
;
;
;
;

// --- Reusable Components ---

function StatCard({ title, value, change, icon: Icon }: { title: string, value: string, change: string, icon: React.ElementType }) {
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

function RecentUsersCard({ users, onEdit }: { users: User[], onEdit: (user: User) => void }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Recent Users</CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.displayName || user.email}</TableCell>
                                <TableCell>
                                    <Badge color={user.role === 'Admin' ? 'error' : user.role === 'Therapist' ? 'warning' : 'secondary'}>
                                        {user.role || 'Patient'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" onClick={() => onEdit(user)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function SessionOverviewCard({ completed, upcoming, canceled }: { completed: number, upcoming: number, canceled: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Session Overview</CardTitle>
                <CardDescription>Session statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950">
                    <p className="text-sm font-medium">Completed</p>
                    <p className="text-xl font-bold">{completed}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                    <p className="text-sm font-medium">Upcoming</p>
                    <p className="text-xl font-bold">{upcoming}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950">
                    <p className="text-sm font-medium">Canceled</p>
                    <p className="text-xl font-bold">{canceled}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function QuickActionsCard() {
    const actions = [
        { href: "/admin/users", icon: Users, label: "Manage Users" },
        { href: "/admin/subscriptions", icon: DollarSign, label: "Subscriptions" },
        { href: "/admin/community-setup", icon: Database, label: "Community" },
        { href: "/admin/settings", icon: Settings, label: "System Settings" },
    ];
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {actions.map(action => (
                    <Button key={action.href} variant="outline" className="h-24 flex-col gap-2" onClick={() => window.location.href = action.href}>
                        <action.icon className="h-6 w-6" />
                        <span>{action.label}</span>
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
}

function AdminDashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
            </div>
            <Skeleton className="h-48" />
        </div>
    );
}

// --- Main Page Component ---

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editRole, setEditRole] = useState<'Patient' | 'Therapist' | 'Admin'>('Patient');
  const { toast } = useToast();

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const service = await getDataService();
      const [usersData, sessionsData] = await Promise.all([
        service.getAllUsers(),
        service.getSessions()
      ]);
      setUsers(usersData || []);
      setSessions(sessionsData || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load dashboard data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

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
      toast({ title: 'Success', description: `User role updated to ${editRole}` });
      setShowEditDialog(false);
      await loadDashboardData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update user role', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalUsers: users.length,
    therapists: users.filter(u => u.role === 'Therapist').length,
    totalSessions: sessions.length,
    upcomingSessions: sessions.filter(s => s.status === 'Upcoming').length,
    completedSessions: sessions.filter(s => s.status === 'Completed').length,
    canceledSessions: sessions.filter(s => s.status === 'Canceled').length,
    recentUsers: users.slice(0, 5),
  };

  const adminStats = [
    { title: 'Total Users', value: stats.totalUsers.toString(), change: `${stats.therapists} therapists`, icon: Users },
    { title: 'Total Sessions', value: stats.totalSessions.toString(), change: `${stats.upcomingSessions} upcoming`, icon: Calendar },
    { title: 'Active Therapists', value: stats.therapists.toString(), change: 'on the platform', icon: UserCheck },
    { title: 'System Status', value: 'Operational', change: 'All services running', icon: Activity },
  ];

  return (
    <SettingsShell>
        <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <SettingsHeader
                title="Admin Dashboard"
                description="System management and oversight."
            />
        </div>
        
        {loading ? <AdminDashboardSkeleton /> : (
            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {adminStats.map((stat) => <StatCard key={stat.title} {...stat} />)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentUsersCard users={stats.recentUsers} onEdit={handleEditUser} />
                    <SessionOverviewCard 
                        completed={stats.completedSessions}
                        upcoming={stats.upcomingSessions}
                        canceled={stats.canceledSessions}
                    />
                </div>

                <QuickActionsCard />
            </div>
        )}

        <Modal open={showEditDialog} onOpenChange={setShowEditDialog}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Edit User Role</ModalTitle>
                    <ModalDescription>Change the role for {selectedUser?.displayName || selectedUser?.email}</ModalDescription>
                </ModalHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={editRole} onValueChange={(value: any) => setEditRole(value)}>
                            <SelectValue placeholder="Select role"  />
                            <SelectContent>
                                <SelectItem value="Patient">Patient</SelectItem>
                                <SelectItem value="Therapist">Therapist</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleUpdateUserRole} disabled={loading}>
                        {loading ? 'Updating...' : 'Update Role'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </SettingsShell>
  );
}
