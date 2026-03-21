'use client';

import React, { useState, useEffect } from 'react';
import { listUsers, updateUserRole } from '@/app/actions/admin-users';
import { InlineFeedback } from '@/components/ui/inline-feedback';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SYSTEM_ROLES } from '@/lib/platform/config/role-permissions';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Refresh01Icon,
  MoreVerticalIcon,
  UserIcon,
} from '@hugeicons/core-free-icons';

export function UserManagementHeadless() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { feedback, setSuccess, setError, reset } = useMorphingFeedback();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const result = await listUsers();
    if (result.success && result.data) {
      setUsers(result.data);
    } else {
      setError('Failed to load users');
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const originalUsers = [...users];
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, user_metadata: { ...u.user_metadata, role: newRole } } : u
      )
    );

    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      setSuccess('User role updated');
    } else {
      setUsers(originalUsers);
      setError('Failed to update role');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || user.id.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-foreground text-xl font-semibold">User Management</h2>
          <p className="text-muted-foreground text-sm">
            Manage standard user accounts and permissions.
          </p>
          <InlineFeedback
            status={feedback.status}
            message={feedback.message}
            onDismiss={reset}
            className="mt-2"
          />
        </div>
        <Button variant="outline" onClick={loadUsers} disabled={loading}>
          <HugeiconsIcon
            icon={Refresh01Icon}
            className={cn('size-4', loading ? 'animate-spin' : '')}
          />
          Refresh
        </Button>
      </div>

      <div className="relative w-full sm:w-96">
        <HugeiconsIcon
          icon={Search01Icon}
          className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
        <Input
          placeholder="Search users by email or ID..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-card ring-border overflow-hidden rounded-[calc(var(--radius)*0.8)] ring-1">
        <div className="overflow-x-auto">
          <table className="divide-border min-w-full divide-y">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-muted-foreground py-4 pr-3 pl-6 text-left text-xs font-semibold tracking-wide uppercase">
                  User
                </th>
                <th className="text-muted-foreground px-3 py-4 text-left text-xs font-semibold tracking-wide uppercase">
                  Role
                </th>
                <th className="text-muted-foreground px-3 py-4 text-left text-xs font-semibold tracking-wide uppercase">
                  Joined
                </th>
                <th className="text-muted-foreground relative py-4 pr-6 pl-3 text-right text-xs font-semibold tracking-wide uppercase">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-border bg-card divide-y">
              {filteredUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="text-muted-foreground py-10 text-center">
                    No users found.
                  </td>
                </tr>
              )}
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50 group transition-colors">
                  <td className="py-4 pr-3 pl-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="border-background from-muted to-muted text-primary flex size-10 shrink-0 items-center justify-center rounded-full border-2 bg-linear-to-br font-semibold">
                        {user.email?.charAt(0).toUpperCase() || (
                          <HugeiconsIcon icon={UserIcon} className="size-5" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-foreground font-medium">{user.email}</div>
                        <div className="text-muted-foreground font-mono text-xs">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="relative z-10 w-48 px-3 py-4 text-sm whitespace-nowrap">
                    <div className="w-40">
                      <Select
                        value={user.user_metadata?.role || 'User'}
                        onValueChange={(val) => handleRoleChange(user.id, val)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(SYSTEM_ROLES).map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                  <td className="text-muted-foreground px-3 py-4 text-sm whitespace-nowrap">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="relative py-4 pr-6 pl-3 text-right text-sm font-medium whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <HugeiconsIcon icon={MoreVerticalIcon} className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          Suspend User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
