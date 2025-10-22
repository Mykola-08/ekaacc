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
  const totalSessions = sessions.length;
  const upcomingSessions = sessions.filter(s => s.status === 'Upcoming').length;
  const completedSessions = sessions.filter(s => s.status === 'Completed').length;
  const canceledSessions = sessions.filter(s => s.status === 'Canceled').length;
  const recentUsers = users.slice(0, 10);

  if (loading) {
    return <div className="p-6 space-y-6"><div className="text-center py-12">Loading...</div></div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, sessions, and subscriptions</p>
        </div>
        <Link href="/admin/subscriptions">
          <Button>Manage Subscriptions</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalUsers}</div><p className="text-xs text-muted-foreground mt-1">All users</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalSessions}</div><p className="text-xs text-muted-foreground mt-1">All time</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{upcomingSessions}</div><p className="text-xs text-muted-foreground mt-1">Sessions</p></CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Users</CardTitle><CardDescription>Latest user registrations</CardDescription></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || user.displayName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                    <TableCell><Badge variant="outline">{user.role || 'Patient'}</Badge></TableCell>
                    <TableCell><Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>Edit Role</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Session Overview</CardTitle><CardDescription>Session statistics</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Upcoming</p>
                  <p className="text-2xl font-bold text-green-600">{upcomingSessions}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{completedSessions}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Canceled</p>
                  <p className="text-2xl font-bold text-red-600">{canceledSessions}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User Role</DialogTitle><DialogDescription>Update the role for {selectedUser?.name || selectedUser?.displayName}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>User</Label><div className="text-sm font-medium">{selectedUser?.name || selectedUser?.displayName}</div><div className="text-xs text-muted-foreground">{selectedUser?.email}</div></div>
            <div className="space-y-2"><Label htmlFor="role">Role</Label><Select value={editRole} onValueChange={(v) => setEditRole(v as 'Patient' | 'Therapist' | 'Admin')}><SelectTrigger id="role"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Patient">Patient</SelectItem><SelectItem value="Therapist">Therapist</SelectItem><SelectItem value="Admin">Admin</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button><Button onClick={handleUpdateUserRole} disabled={loading}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
