'use client';

import React, { useState, Fragment } from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { supabase } from '@/lib/platform/supabase';
import { useToast } from '@/hooks/platform/ui/use-toast';
import {
  UserPlus,
  Edit,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Check,
  ChevronDown,
  Trash2,
  Calendar,
  Clock,
} from 'lucide-react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

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

  // Mock data for now since actual backend connection might need Supabase types
  const fetchUsers = async () => {
    setLoading(false);
    // In a real scenario, we'd fetch from Supabase here like in the original file
    // For redesign purposes, we'll keep the UI strict
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

  const statusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 ring-green-600/20';
      case 'suspended':
        return 'text-red-600 bg-red-50 ring-red-600/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 ring-yellow-600/20';
      default:
        return 'text-muted-foreground bg-muted/30 ring-gray-600/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-foreground text-xl font-bold">User Roles</h2>
          <p className="text-muted-foreground text-sm">Manage user access and permissions.</p>
        </div>
        <button
          onClick={() => setIsAssignDialogOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-white shadow-lg shadow-gray-200 transition-colors hover:bg-gray-800"
        >
          <UserPlus className="h-4 w-4" />
          <span>Assign Role</span>
        </button>
      </div>

      <div className="group relative w-full sm:w-96">
        <Search className="text-muted-foreground/80 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transition-colors group-focus-within:text-blue-500" />
        <input
          type="text"
          placeholder="Search users..."
          className="bg-muted/30 focus:bg-card text-foreground placeholder:text-muted-foreground/80 w-full rounded-[20px] border-transparent py-3 pr-4 pl-10 font-medium transition-all duration-200 outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-card overflow-hidden rounded-[20px] ring-1 ring-gray-200">
        <div className="overflow-x-auto">
          <table className="divide-border min-w-full divide-y">
            <thead className="bg-muted/30/50">
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
                <tr key={user.id} className="hover:bg-muted/30/50 transition-colors">
                  <td className="py-4 pr-3 pl-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-foreground font-medium">{user.name}</div>
                        <div className="text-muted-foreground text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium tracking-wider text-blue-700 uppercase ring-1 ring-blue-700/10 ring-inset'
                      )}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset',
                        statusColor(user.accountStatus)
                      )}
                    >
                      {user.accountStatus}
                    </span>
                  </td>
                  <td className="text-muted-foreground px-3 py-4 text-sm whitespace-nowrap">
                    {new Date(user.lastLoginAt).toLocaleDateString()}
                  </td>
                  <td className="relative py-4 pr-6 pl-3 text-right text-sm font-medium whitespace-nowrap">
                    <button className="text-muted-foreground/80 rounded-lg p-2 transition-colors hover:bg-blue-50 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Transition appear show={isAssignDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsAssignDialogOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="bg-card w-full max-w-md transform overflow-hidden rounded-[20px] p-8 text-left align-middle shadow-2xl transition-all">
                  <DialogTitle as="h3" className="text-foreground text-xl leading-6 font-bold">
                    Assign Role
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-muted-foreground text-sm">
                      Grant specific permissions to a user.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                    <div>
                      <label className="text-foreground/90 mb-1 block text-sm font-medium">
                        User ID
                      </label>
                      <input
                        {...register('userId')}
                        className="border-border bg-muted/30 w-full rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Select user..."
                      />
                      {errors.userId && (
                        <p className="mt-1 text-xs text-red-500">{errors.userId.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-foreground/90 mb-1 block text-sm font-medium">
                        Role
                      </label>
                      <select
                        {...register('role')}
                        className="border-border bg-muted/30 w-full rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select a role</option>
                        <option value="admin">Admin</option>
                        <option value="therapist">Therapist</option>
                        <option value="user">User</option>
                      </select>
                      {errors.role && (
                        <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-foreground/90 mb-1 block text-sm font-medium">
                        Reason
                      </label>
                      <textarea
                        {...register('reason')}
                        rows={3}
                        className="border-border bg-muted/30 w-full rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Why is this role being assigned?"
                      />
                      {errors.reason && (
                        <p className="mt-1 text-xs text-red-500">{errors.reason.message}</p>
                      )}
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                      <button
                        type="button"
                        className="text-foreground/90 hover:bg-muted inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                        onClick={() => setIsAssignDialogOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-gray-200/50 transition-colors hover:bg-gray-800"
                      >
                        Assign Role
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
