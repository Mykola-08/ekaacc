'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Edit01Icon, Search01Icon, UserAdd01Icon } from '@hugeicons/core-free-icons';

const roleAssignmentSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  role: z.string().min(1, 'Role is required'),
  reason: z.string().min(1, 'Reason is required'),
  expiresAt: z.string().optional(),
  isActive: z.boolean().optional(),
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

export function RoleManagementPanelHeadless() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RoleAssignmentFormData>({
    resolver: zodResolver(roleAssignmentSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const fetchUsers = async () => {
    setLoading(false);
    setUsers([
      {
        id: '1',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'admin',
        isActive: true,
        assignedAt: new Date().toISOString(),
        assignedBy: 'system',
        lastLoginAt: new Date().toISOString(),
        accountStatus: 'active',
      },
      {
        id: '2',
        email: 'jane@example.com',
        name: 'Jane Smith',
        role: 'user',
        isActive: true,
        assignedAt: new Date().toISOString(),
        assignedBy: 'system',
        lastLoginAt: new Date().toISOString(),
        accountStatus: 'active',
      },
    ]);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data: RoleAssignmentFormData) => {
    toast({ title: 'Role Assignment', description: 'This feature is mocked for the redesign.' });
    setIsAssignDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-foreground text-xl font-semibold">User Roles</h2>
          <p className="text-muted-foreground text-sm">Manage user access and permissions.</p>
        </div>
        <Button onClick={() => setIsAssignDialogOpen(true)}>
          <HugeiconsIcon icon={UserAdd01Icon} className="size-4" />
          Assign Role
        </Button>
      </div>

      <div className="relative w-full sm:w-96">
        <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search users..."
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
                  Status
                </th>
                <th className="text-muted-foreground px-3 py-4 text-left text-xs font-semibold tracking-wide uppercase">
                  Last Login
                </th>
                <th className="text-muted-foreground relative py-4 pr-6 pl-3 text-right text-xs font-semibold tracking-wide uppercase">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-border bg-card divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                  <td className="py-4 pr-3 pl-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-foreground font-medium">{user.name}</div>
                        <div className="text-muted-foreground text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className="bg-primary/5 text-primary ring-primary/10 inline-flex items-center rounded-[calc(var(--radius)*0.8)] px-2 py-1 text-xs font-medium tracking-wider uppercase ring-1 ring-inset">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <StatusBadge status={user.accountStatus} />
                  </td>
                  <td className="text-muted-foreground px-3 py-4 text-sm whitespace-nowrap">
                    {new Date(user.lastLoginAt).toLocaleDateString()}
                  </td>
                  <td className="relative py-4 pr-6 pl-3 text-right text-sm font-medium whitespace-nowrap">
                    <Button variant="ghost" size="icon">
                      <HugeiconsIcon icon={Edit01Icon} className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>Grant specific permissions to a user.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input {...register('userId')} placeholder="Select user..." />
              {errors.userId && (
                <p className="text-destructive text-xs">{errors.userId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select onValueChange={(val) => setValue('role', val)} value={watch('role')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="therapist">Therapist</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-destructive text-xs">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                {...register('reason')}
                rows={3}
                placeholder="Why is this role being assigned?"
              />
              {errors.reason && (
                <p className="text-destructive text-xs">{errors.reason.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Assign Role</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
