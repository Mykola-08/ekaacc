'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import {
  addRolePermission,
  removeRolePermission,
  setUserPermissionOverride,
  removeUserPermissionOverride,
  getUserPermissionOverrides,
  updateUserRole,
  type RolePermissionRow,
  type UserPermissionOverride,
} from '@/server/permissions/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// ─── Types ─────────────────────────────────────────────────────────

interface PermissionMatrixProps {
  rolePermissions: RolePermissionRow[];
  roles: string[];
  groups: string[];
  actions: string[];
  users: { auth_id: string; full_name: string | null; email: string | null; role: string | null }[];
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  super_admin: 'Super Admin',
  therapist: 'Therapist',
  client: 'Client',
  patient: 'Patient',
  reception: 'Reception',
};

const GROUP_LABELS: Record<string, string> = {
  user_management: 'Users',
  content_management: 'Content',
  product_management: 'Products',
  appointment_management: 'Appointments',
  financial_management: 'Finances',
  patient_data: 'Patient Data',
  therapist_tools: 'Therapist Tools',
  system_settings: 'System',
  academy_management: 'Academy',
  analytics: 'Analytics',
  communication: 'Communication',
};

// ─── Component ─────────────────────────────────────────────────────

export function PermissionMatrixClient({
  rolePermissions,
  roles,
  groups,
  actions: allActions,
  users,
}: PermissionMatrixProps) {
  const [selectedRole, setSelectedRole] = useState(roles[0] || 'admin');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [userOverrides, setUserOverrides] = useState<UserPermissionOverride[]>([]);
  const [isPending, startTransition] = useTransition();

  // Build a lookup set for current permissions: "role:group.action"
  const permLookup = useMemo(() => {
    const set = new Set<string>();
    for (const rp of rolePermissions) {
      set.add(`${rp.role}:${rp.permission_group}.${rp.action}`);
    }
    return set;
  }, [rolePermissions]);

  // Permission ID lookup: "role:group.action" -> id
  const permIdLookup = useMemo(() => {
    const map = new Map<string, string>();
    for (const rp of rolePermissions) {
      map.set(`${rp.role}:${rp.permission_group}.${rp.action}`, rp.id);
    }
    return map;
  }, [rolePermissions]);

  const hasPerm = useCallback(
    (role: string, group: string, action: string) =>
      permLookup.has(`${role}:${group}.${action}`),
    [permLookup]
  );

  // Filter relevant actions per group (only show actions that at least one role has)
  const groupActions = useMemo(() => {
    const ga: Record<string, string[]> = {};
    for (const group of groups) {
      const relevantActions = allActions.filter((action) =>
        roles.some((role) => hasPerm(role, group, action))
      );
      ga[group] = relevantActions.length > 0 ? relevantActions : ['read', 'create', 'update', 'delete'];
    }
    return ga;
  }, [groups, allActions, roles, hasPerm]);

  // Toggle a role permission
  const toggleRolePerm = (role: string, group: string, action: string) => {
    startTransition(async () => {
      const key = `${role}:${group}.${action}`;
      if (permLookup.has(key)) {
        const id = permIdLookup.get(key);
        if (!id) return;
        const res = await removeRolePermission(id);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(`Removed ${group}.${action} from ${role}`);
        }
      } else {
        const res = await addRolePermission(role, group, action);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(`Added ${group}.${action} to ${role}`);
        }
      }
    });
  };

  // Load user overrides
  const loadUserOverrides = (userId: string) => {
    setSelectedUser(userId);
    if (!userId) {
      setUserOverrides([]);
      return;
    }
    startTransition(async () => {
      try {
        const overrides = await getUserPermissionOverrides(userId);
        setUserOverrides(overrides);
      } catch {
        toast.error('Failed to load user permissions');
      }
    });
  };

  const toggleUserOverride = (
    userId: string,
    group: string,
    action: string,
    currentlyGranted: boolean | null
  ) => {
    startTransition(async () => {
      if (currentlyGranted !== null) {
        // Find the override to toggle or remove
        const existing = userOverrides.find(
          (o) => o.permission_group === group && o.action === action
        );
        if (existing) {
          const res = await removeUserPermissionOverride(existing.id);
          if (res.error) {
            toast.error(res.error);
          } else {
            toast.success('Override removed');
            loadUserOverrides(userId);
          }
          return;
        }
      }
      // Set the override
      const res = await setUserPermissionOverride(
        userId,
        group,
        action,
        !currentlyGranted
      );
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Override saved');
        loadUserOverrides(userId);
      }
    });
  };

  const changeUserRole = (userId: string, newRole: string) => {
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Role updated');
      }
    });
  };

  return (
    <Tabs defaultValue="roles" className="space-y-4">
      <TabsList>
        <TabsTrigger value="roles">Role Permissions</TabsTrigger>
        <TabsTrigger value="users">User Overrides</TabsTrigger>
      </TabsList>

      {/* ─── Role Permissions Matrix ────────────────────────────────── */}
      <TabsContent value="roles" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Role Matrix</CardTitle>
                <CardDescription>
                  Toggle which permissions each role has.
                </CardDescription>
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABELS[role] || role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-35">Permission Group</TableHead>
                  {(groupActions[groups[0]] || allActions).length > 0 &&
                    ['read', 'create', 'update', 'delete', 'manage', 'publish', 'view_own', 'view_all', 'assign', 'export']
                      .filter((a) => allActions.includes(a))
                      .map((action) => (
                        <TableHead key={action} className="text-center text-xs w-20">
                          {action.replace('_', ' ')}
                        </TableHead>
                      ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group}>
                    <TableCell className="font-medium text-xs">
                      {GROUP_LABELS[group] || group}
                    </TableCell>
                    {['read', 'create', 'update', 'delete', 'manage', 'publish', 'view_own', 'view_all', 'assign', 'export']
                      .filter((a) => allActions.includes(a))
                      .map((action) => (
                        <TableCell key={action} className="text-center">
                          <Switch
                            checked={hasPerm(selectedRole, group, action)}
                            onCheckedChange={() =>
                              toggleRolePerm(selectedRole, group, action)
                            }
                            disabled={isPending}
                            className="scale-75"
                          />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* All Roles Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Overview</CardTitle>
            <CardDescription>
              Quick comparison of core permissions across all roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-35">Group</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role} className="text-center text-xs">
                      {ROLE_LABELS[role] || role}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group}>
                    <TableCell className="font-medium text-xs">
                      {GROUP_LABELS[group] || group}
                    </TableCell>
                    {roles.map((role) => {
                      const count = allActions.filter((a) =>
                        hasPerm(role, group, a)
                      ).length;
                      return (
                        <TableCell key={role} className="text-center">
                          {count > 0 ? (
                            <Badge variant="secondary" className="text-xs">
                              {count}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ─── User Overrides ─────────────────────────────────────────── */}
      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">User Permissions</CardTitle>
                <CardDescription>
                  Override permissions for individual users or change their role.
                </CardDescription>
              </div>
              <Select value={selectedUser} onValueChange={loadUserOverrides}>
                <SelectTrigger className="w-60">
                  <SelectValue placeholder="Select a user…" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.auth_id} value={u.auth_id}>
                      {u.full_name || u.email || u.auth_id.slice(0, 8)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          {selectedUser && (
            <CardContent className="space-y-4">
              {/* Role assignment */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Role:</span>
                <Select
                  value={
                    users.find((u) => u.auth_id === selectedUser)?.role ||
                    'client'
                  }
                  onValueChange={(val) => changeUserRole(selectedUser, val)}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Overrides table */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Overrides take priority over role permissions. Toggle to grant
                  or revoke specific permissions for this user.
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-35">Group</TableHead>
                      <TableHead className="w-25">Action</TableHead>
                      <TableHead className="text-center w-20">Role Default</TableHead>
                      <TableHead className="text-center w-20">Override</TableHead>
                      <TableHead className="w-20" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.map((group) =>
                      allActions.map((action) => {
                        const userRole =
                          users.find((u) => u.auth_id === selectedUser)
                            ?.role || 'client';
                        const roleHas = hasPerm(userRole, group, action);
                        const override = userOverrides.find(
                          (o) =>
                            o.permission_group === group &&
                            o.action === action
                        );
                        const effective = override
                          ? override.is_granted
                          : roleHas;

                        return (
                          <TableRow key={`${group}.${action}`}>
                            <TableCell className="text-xs">
                              {GROUP_LABELS[group] || group}
                            </TableCell>
                            <TableCell className="text-xs">
                              {action.replace('_', ' ')}
                            </TableCell>
                            <TableCell className="text-center">
                              {roleHas ? (
                                <Badge variant="secondary" className="text-xs">
                                  Yes
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  No
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {override ? (
                                <Badge
                                  variant={
                                    override.is_granted
                                      ? 'default'
                                      : 'destructive'
                                  }
                                  className="text-xs"
                                >
                                  {override.is_granted
                                    ? 'Granted'
                                    : 'Revoked'}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  —
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                disabled={isPending}
                                onClick={() =>
                                  toggleUserOverride(
                                    selectedUser,
                                    group,
                                    action,
                                    override ? override.is_granted : null
                                  )
                                }
                              >
                                {override ? 'Remove' : effective ? 'Revoke' : 'Grant'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
}
