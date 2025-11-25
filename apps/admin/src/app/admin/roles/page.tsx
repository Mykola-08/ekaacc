'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import {
  UserCog,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Shield,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Key,
  Lock
} from 'lucide-react';
import { format } from 'date-fns';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  group: string;
}

interface UserRoleAssignment {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  roleId: string;
  roleName: string;
  assignedBy: string;
  assignedAt: string;
  reason?: string;
}

const defaultPermissions: Permission[] = [
  // Admin permissions
  { id: 'admin.full_access', name: 'admin.full_access', description: 'Full admin access', group: 'Admin' },
  { id: 'admin.impersonate', name: 'admin.impersonate', description: 'Impersonate users', group: 'Admin' },
  { id: 'admin.settings', name: 'admin.settings', description: 'Manage system settings', group: 'Admin' },
  
  // User management
  { id: 'users.read', name: 'users.read', description: 'View users', group: 'Users' },
  { id: 'users.create', name: 'users.create', description: 'Create users', group: 'Users' },
  { id: 'users.update', name: 'users.update', description: 'Update users', group: 'Users' },
  { id: 'users.delete', name: 'users.delete', description: 'Delete users', group: 'Users' },
  { id: 'users.suspend', name: 'users.suspend', description: 'Suspend users', group: 'Users' },
  
  // CMS permissions
  { id: 'cms.read', name: 'cms.read', description: 'View CMS content', group: 'CMS' },
  { id: 'cms.create', name: 'cms.create', description: 'Create CMS content', group: 'CMS' },
  { id: 'cms.update', name: 'cms.update', description: 'Update CMS content', group: 'CMS' },
  { id: 'cms.delete', name: 'cms.delete', description: 'Delete CMS content', group: 'CMS' },
  { id: 'cms.publish', name: 'cms.publish', description: 'Publish CMS content', group: 'CMS' },
  
  // Products permissions
  { id: 'products.read', name: 'products.read', description: 'View products', group: 'Products' },
  { id: 'products.create', name: 'products.create', description: 'Create products', group: 'Products' },
  { id: 'products.update', name: 'products.update', description: 'Update products', group: 'Products' },
  { id: 'products.delete', name: 'products.delete', description: 'Delete products', group: 'Products' },
  
  // Services permissions
  { id: 'services.read', name: 'services.read', description: 'View services', group: 'Services' },
  { id: 'services.create', name: 'services.create', description: 'Create services', group: 'Services' },
  { id: 'services.update', name: 'services.update', description: 'Update services', group: 'Services' },
  { id: 'services.delete', name: 'services.delete', description: 'Delete services', group: 'Services' },
  
  // Bookings permissions
  { id: 'bookings.read', name: 'bookings.read', description: 'View bookings', group: 'Bookings' },
  { id: 'bookings.create', name: 'bookings.create', description: 'Create bookings', group: 'Bookings' },
  { id: 'bookings.update', name: 'bookings.update', description: 'Update bookings', group: 'Bookings' },
  { id: 'bookings.cancel', name: 'bookings.cancel', description: 'Cancel bookings', group: 'Bookings' },
  
  // Reports permissions
  { id: 'reports.read', name: 'reports.read', description: 'View reports', group: 'Reports' },
  { id: 'reports.create', name: 'reports.create', description: 'Create reports', group: 'Reports' },
  { id: 'reports.export', name: 'reports.export', description: 'Export reports', group: 'Reports' },
  
  // Therapist permissions
  { id: 'therapist.clients', name: 'therapist.clients', description: 'Manage own clients', group: 'Therapist' },
  { id: 'therapist.sessions', name: 'therapist.sessions', description: 'Manage own sessions', group: 'Therapist' },
  { id: 'therapist.notes', name: 'therapist.notes', description: 'Manage therapy notes', group: 'Therapist' },
  { id: 'therapist.availability', name: 'therapist.availability', description: 'Manage availability', group: 'Therapist' },
];

const defaultRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system administrator with all permissions',
    permissions: defaultPermissions.map(p => p.id),
    isSystem: true,
    userCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Therapist',
    description: 'Licensed therapist with client management capabilities',
    permissions: ['bookings.read', 'bookings.create', 'bookings.update', 'reports.read', 'reports.create', 'therapist.clients', 'therapist.sessions', 'therapist.notes', 'therapist.availability'],
    isSystem: true,
    userCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Content Manager',
    description: 'Manages website content and CMS',
    permissions: ['cms.read', 'cms.create', 'cms.update', 'cms.publish'],
    isSystem: true,
    userCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Reception',
    description: 'Front desk staff with booking management',
    permissions: ['users.read', 'bookings.read', 'bookings.create', 'bookings.update', 'bookings.cancel'],
    isSystem: true,
    userCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Patient',
    description: 'Standard patient account',
    permissions: ['bookings.read', 'bookings.create'],
    isSystem: true,
    userCount: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'VIP Patient',
    description: 'VIP patient with premium features',
    permissions: ['bookings.read', 'bookings.create', 'reports.read'],
    isSystem: true,
    userCount: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

const initialFormState = {
  name: '',
  description: '',
  permissions: [] as string[]
};

export default function RolesManagementPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions] = useState<Permission[]>(defaultPermissions);
  const [assignments, setAssignments] = useState<UserRoleAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [assignForm, setAssignForm] = useState({ userId: '', roleId: '', reason: '' });
  const [users, setUsers] = useState<{ id: string; email: string; name: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('*')
        .order('name', { ascending: true });

      if (rolesData && rolesData.length > 0) {
        setRoles(rolesData.map(r => ({
          id: r.id,
          name: r.name,
          description: r.description || '',
          permissions: r.permissions || [],
          isSystem: r.is_system ?? false,
          userCount: 0,
          createdAt: r.created_at,
          updatedAt: r.updated_at
        })));
      } else {
        setRoles(defaultRoles);
      }

      // Load users for assignment
      const { data: usersData } = await supabase
        .from('users')
        .select('id, email, name')
        .order('email', { ascending: true });

      if (usersData) {
        setUsers(usersData);
      }

      // Load role assignments
      const { data: assignmentsData } = await supabase
        .from('user_role_assignments')
        .select(`
          id,
          user_id,
          role_id,
          assigned_by,
          assigned_at,
          reason,
          users!user_role_assignments_user_id_fkey(email, name),
          user_roles!user_role_assignments_role_id_fkey(name)
        `)
        .order('assigned_at', { ascending: false });

      if (assignmentsData) {
        setAssignments(assignmentsData.map((a: any) => ({
          id: a.id,
          userId: a.user_id,
          userEmail: a.users?.email || 'Unknown',
          userName: a.users?.name || 'Unknown',
          roleId: a.role_id,
          roleName: a.user_roles?.name || 'Unknown',
          assignedBy: a.assigned_by,
          assignedAt: a.assigned_at,
          reason: a.reason
        })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ title: 'Info', description: 'Using demo data' });
      setRoles(defaultRoles);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveRole = async () => {
    setIsSaving(true);
    try {
      const roleData = {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
        is_system: false,
        updated_at: new Date().toISOString()
      };

      if (selectedRole) {
        const { error } = await supabase
          .from('user_roles')
          .update(roleData)
          .eq('id', selectedRole.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Role updated successfully' });
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert({
            ...roleData,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        toast({ title: 'Success', description: 'Role created successfully' });
      }

      setShowRoleDialog(false);
      setSelectedRole(null);
      setFormData(initialFormState);
      loadData();
    } catch (error) {
      console.error('Error saving role:', error);
      toast({ title: 'Error', description: 'Failed to save role', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      toast({ title: 'Error', description: 'Cannot delete system roles', variant: 'destructive' });
      return;
    }
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      const { error } = await supabase.from('user_roles').delete().eq('id', roleId);
      if (error) throw error;
      toast({ title: 'Success', description: 'Role deleted successfully' });
      loadData();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({ title: 'Error', description: 'Failed to delete role', variant: 'destructive' });
    }
  };

  const handleAssignRole = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_role_assignments')
        .upsert({
          user_id: assignForm.userId,
          role_id: assignForm.roleId,
          assigned_by: user?.id,
          assigned_at: new Date().toISOString(),
          reason: assignForm.reason
        });

      if (error) throw error;
      toast({ title: 'Success', description: 'Role assigned successfully' });
      setShowAssignDialog(false);
      setAssignForm({ userId: '', roleId: '', reason: '' });
      loadData();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({ title: 'Error', description: 'Failed to assign role', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to remove this role assignment?')) return;

    try {
      const { error } = await supabase.from('user_role_assignments').delete().eq('id', assignmentId);
      if (error) throw error;
      toast({ title: 'Success', description: 'Role assignment removed' });
      loadData();
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast({ title: 'Error', description: 'Failed to remove assignment', variant: 'destructive' });
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const permissionGroups = [...new Set(permissions.map(p => p.group))];

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Admin': return 'bg-red-500';
      case 'Therapist': return 'bg-blue-500';
      case 'Content Manager': return 'bg-purple-500';
      case 'Reception': return 'bg-green-500';
      case 'Patient': return 'bg-gray-500';
      case 'VIP Patient': return 'bg-amber-500';
      default: return 'bg-primary';
    }
  };

  return (
    <SettingsShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCog className="h-8 w-8 text-primary" />
          <SettingsHeader
            title="Role Management"
            description="Manage user roles, permissions, and access controls."
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="assignments">User Assignments</TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => { setSelectedRole(null); setFormData(initialFormState); setShowRoleDialog(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoles.map((role) => (
              <Card key={role.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(role.name)}>{role.name}</Badge>
                    {role.isSystem && (
                      <Badge variant="outline" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        System
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRole(role);
                        setFormData({
                          name: role.name,
                          description: role.description,
                          permissions: role.permissions
                        });
                        setShowRoleDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!role.isSystem && (
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{role.userCount} users</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <span>{role.permissions.length} permissions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Available Permissions</CardTitle>
              <CardDescription>All system permissions grouped by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {permissionGroups.map((group) => (
                  <div key={group}>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {group}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {permissions.filter(p => p.group === group).map((permission) => (
                        <div key={permission.id} className="p-2 rounded border text-sm">
                          <div className="font-medium">{permission.name.split('.')[1]}</div>
                          <div className="text-muted-foreground text-xs">{permission.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <div className="flex justify-between items-center mb-4">
            <CardTitle>User Role Assignments</CardTitle>
            <Button onClick={() => setShowAssignDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Assign Role
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Assigned By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No role assignments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{assignment.userName}</div>
                            <div className="text-sm text-muted-foreground">{assignment.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(assignment.roleName)}>{assignment.roleName}</Badge>
                        </TableCell>
                        <TableCell>{assignment.assignedBy}</TableCell>
                        <TableCell>{format(new Date(assignment.assignedAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{assignment.reason || '-'}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleRemoveAssignment(assignment.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
            <DialogDescription>
              Define role details and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Marketing Manager"
                disabled={selectedRole?.isSystem}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role's responsibilities"
                rows={2}
              />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="mt-2 space-y-4 max-h-[300px] overflow-y-auto border rounded p-4">
                {permissionGroups.map((group) => (
                  <div key={group}>
                    <h5 className="font-medium mb-2">{group}</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.filter(p => p.group === group).map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <Label htmlFor={permission.id} className="text-sm cursor-pointer">
                            {permission.description}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveRole} disabled={isSaving}>
              {isSaving ? 'Saving...' : selectedRole ? 'Update Role' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role to User</DialogTitle>
            <DialogDescription>
              Select a user and assign them a role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user">User</Label>
              <Select value={assignForm.userId} onValueChange={(value) => setAssignForm({ ...assignForm, userId: value })}>
                <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={assignForm.roleId} onValueChange={(value) => setAssignForm({ ...assignForm, roleId: value })}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                value={assignForm.reason}
                onChange={(e) => setAssignForm({ ...assignForm, reason: e.target.value })}
                placeholder="Reason for role assignment"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
            <Button onClick={handleAssignRole} disabled={isSaving || !assignForm.userId || !assignForm.roleId}>
              {isSaving ? 'Assigning...' : 'Assign Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsShell>
  );
}
