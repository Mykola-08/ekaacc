'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RoleBadge } from '@/components/role-guard';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const roleAssignmentSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  role: z.string().min(1, 'Role is required'),
  reason: z.string().min(1, 'Reason is required'),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true)
});

type RoleAssignmentFormData = z.infer<typeof roleAssignmentSchema>;

interface UserWithRole {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  assignedAt: string;
  assignedBy: string;
  lastLoginAt: string;
  accountStatus: 'active' | 'suspended' | 'pending' | 'deactivated';
}

interface RoleAssignmentLog {
  id: string;
  userId: string;
  userEmail: string;
  oldRole: string | null;
  newRole: string;
  assignedBy: string;
  assignedByEmail: string;
  reason: string;
  createdAt: string;
}

export function RoleManagementPanel() {
  const { user: currentUser, hasPermission } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [roleLogs, setRoleLogs] = useState<RoleAssignmentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);

  const form = useForm<RoleAssignmentFormData>({
    resolver: zodResolver(roleAssignmentSchema),
    defaultValues: {
      isActive: true
    }
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users with their current roles
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          name,
          account_status,
          last_login_at,
          user_roles!inner (
            role,
            is_active,
            assigned_at,
            assigned_by
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const usersWithRoles: UserWithRole[] = data?.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name || 'Unknown',
        role: user.user_roles?.[0]?.role || 'Patient',
        isActive: user.user_roles?.[0]?.is_active ?? true,
        assignedAt: user.user_roles?.[0]?.assigned_at || '',
        assignedBy: user.user_roles?.[0]?.assigned_by || '',
        lastLoginAt: user.last_login_at || '',
        accountStatus: user.account_status || 'pending'
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('role_assignments_log')
        .select(`
          *,
          user:users!role_assignments_log_user_id_fkey(email),
          assignedByUser:users!role_assignments_log_assigned_by_fkey(email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const logs: RoleAssignmentLog[] = data?.map(log => ({
        id: log.id,
        userId: log.user_id,
        userEmail: log.user?.email || 'Unknown',
        oldRole: log.old_role,
        newRole: log.new_role,
        assignedBy: log.assigned_by,
        assignedByEmail: log.assignedByUser?.email || 'Unknown',
        reason: log.reason,
        createdAt: log.created_at
      })) || [];

      setRoleLogs(logs);
    } catch (error) {
      console.error('Error fetching role logs:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleRoleAssignment = async (data: RoleAssignmentFormData) => {
    try {
      if (!currentUser?.id) return;

      // Log the role assignment
      const { error: logError } = await supabase
        .from('role_assignments_log')
        .insert({
          user_id: data.userId,
          old_role: selectedUser?.role || null,
          new_role: data.role,
          assigned_by: currentUser.id,
          reason: data.reason,
          metadata: {
            isActive: data.isActive,
            expiresAt: data.expiresAt
          }
        });

      if (logError) throw logError;

      // Update user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: data.userId,
          role: data.role,
          is_active: data.isActive,
          assigned_by: currentUser.id,
          assigned_at: new Date().toISOString(),
          expires_at: data.expiresAt || null
        });

      if (roleError) throw roleError;

      toast({
        title: 'Success',
        description: 'Role assigned successfully'
      });

      setIsAssignDialogOpen(false);
      setSelectedUser(null);
      form.reset();
      
      // Refresh data
      fetchUsers();
      fetchRoleLogs();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign role',
        variant: 'destructive'
      });
    }
  };

  const handleDeactivateUser = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoleLogs();
  }, []);

  if (!hasPermission('user_management', 'read')) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access role management.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions across the system
          </p>
        </div>
        {hasPermission('user_management', 'create') && (
          <Button onClick={() => setIsAssignDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Assign Role
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="role">Filter by Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Therapist">Therapist</SelectItem>
                  <SelectItem value="Reception">Reception</SelectItem>
                  <SelectItem value="Patient">Patient</SelectItem>
                  <SelectItem value="VIP Patient">VIP Patient</SelectItem>
                  <SelectItem value="Corporate Client">Corporate Client</SelectItem>
                  <SelectItem value="Content Manager">Content Manager</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Accountant">Accountant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users & Roles</CardTitle>
          <CardDescription>
            View and manage user role assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <RoleBadge role={user.role as any} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className={user.isActive ? 'text-green-700' : 'text-red-700'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {hasPermission('user_management', 'update') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsAssignDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {hasPermission('user_management', 'update') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeactivateUser(user.id, user.isActive)}
                            >
                              {user.isActive ? (
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role Assignment Log */}
      <Card>
        <CardHeader>
          <CardTitle>Role Assignment History</CardTitle>
          <CardDescription>
            Recent role changes and assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roleLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No role assignment history available
              </p>
            ) : (
              roleLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {log.userEmail}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {log.oldRole ? `${log.oldRole} → ${log.newRole}` : `Assigned as ${log.newRole}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      By {log.assignedByEmail} • {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Reason:</p>
                    <p className="text-sm">{log.reason}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Role Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to {selectedUser?.name || 'selected user'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRoleAssignment)} className="space-y-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={selectedUser?.id || field.value}
                      disabled={!!selectedUser}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Therapist">Therapist</SelectItem>
                        <SelectItem value="Reception">Reception</SelectItem>
                        <SelectItem value="Patient">Patient</SelectItem>
                        <SelectItem value="VIP Patient">VIP Patient</SelectItem>
                        <SelectItem value="Corporate Client">Corporate Client</SelectItem>
                        <SelectItem value="Content Manager">Content Manager</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Accountant">Accountant</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Assignment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter reason for role assignment..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Active Role
                      </FormLabel>
                      <FormDescription>
                        User can access resources based on this role
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Assign Role</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}