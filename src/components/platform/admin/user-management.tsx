'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/platform/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/platform/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/platform/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/platform/ui/select';
import { Switch } from '@/components/platform/ui/switch';
import { User as UserIcon, Shield, Mail, Calendar } from 'lucide-react';

interface User {
  id: string;
  email: string;
  created_at: string;
  user_profiles:
    | {
        full_name: string | null;
        username: string | null;
        avatar_url: string | null;
      }[]
    | null;
  user_role_assignments: {
    user_roles: {
      name: string;
      description: string | null;
    };
  }[];
}

interface UserManagementProps {
  className?: string;
}

export function UserManagement({ className }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('auth.users')
        .select(
          `
          id,
          email,
          created_at,
          user_profiles(
            full_name,
            username,
            avatar_url
          ),
          user_role_assignments(
            user_roles(
              name,
              description
            )
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      // Transform the data to match the User interface
      const transformedUsers = (data || []).map((user) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        user_profiles: user.user_profiles || null,
        user_role_assignments:
          user.user_role_assignments?.map((assignment: any) => ({
            user_roles: assignment.user_roles,
          })) || [],
      }));
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRoleId: string) => {
    try {
      // Remove existing role assignments
      await supabase.from('user_role_assignments').delete().eq('user_id', userId);

      // Add new role assignment
      await supabase.from('user_role_assignments').insert({
        user_id: userId,
        role_id: newRoleId,
      });

      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      case 'user':
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Loading users...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>Manage system users and their roles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">Total users: {users.length}</div>
            <Button variant="outline" size="sm" onClick={fetchUsers}>
              Refresh
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const profile = user.user_profiles;
                  const roleAssignment = user.user_role_assignments[0];
                  const currentRole = roleAssignment?.user_roles?.name || 'user';

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profile?.[0]?.avatar_url || undefined} />
                            <AvatarFallback>
                              {profile?.[0]?.full_name?.charAt(0) ||
                                user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {profile?.[0]?.full_name || 'Unknown User'}
                            </div>
                            {profile?.[0]?.username && (
                              <div className="text-muted-foreground text-sm">
                                @{profile?.[0]?.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="text-muted-foreground h-4 w-4" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(currentRole)}>{currentRole}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={currentRole}
                          onValueChange={async (newRole) => {
                            // Get role ID
                            const { data: role } = await supabase
                              .from('user_roles')
                              .select('id')
                              .eq('name', newRole)
                              .single();

                            if (role) {
                              await updateUserRole(user.id, role.id);
                            }
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {users.length === 0 && (
            <div className="text-muted-foreground py-8 text-center">No users found</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
