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
  Clock
} from 'lucide-react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
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
  isActive: z.boolean().optional()
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

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<RoleAssignmentFormData>({
    resolver: zodResolver(roleAssignmentSchema),
    defaultValues: {
      isActive: true
    }
  });

  // Mock data for now since actual backend connection might need Supabase types
  const fetchUsers = async () => {
      setLoading(false);
      // In a real scenario, we'd fetch from Supabase here like in the original file
      // For redesign purposes, we'll keep the UI strict
      setUsers([
          { 
              id: '1', email: 'john@example.com', name: 'John Doe', role: 'admin', isActive: true, 
              assignedAt: new Date().toISOString(), assignedBy: 'system', lastLoginAt: new Date().toISOString(), accountStatus: 'active' 
          },
          { 
              id: '2', email: 'jane@example.com', name: 'Jane Smith', role: 'user', isActive: true, 
              assignedAt: new Date().toISOString(), assignedBy: 'system', lastLoginAt: new Date().toISOString(), accountStatus: 'active' 
          }
      ]);
  };
  
  React.useEffect(() => {
        fetchUsers();
  }, []);

  const onSubmit = async (data: RoleAssignmentFormData) => {
    toast({ title: "Role Assignment", description: "This feature is mocked for the redesign." });
    setIsAssignDialogOpen(false);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 ring-green-600/20';
      case 'suspended': return 'text-red-600 bg-red-50 ring-red-600/20';
      case 'pending': return 'text-yellow-600 bg-yellow-50 ring-yellow-600/20';
      default: return 'text-muted-foreground bg-muted/30 ring-gray-600/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
            <h2 className="text-xl font-bold text-foreground">User Roles</h2>
            <p className="text-sm text-muted-foreground">Manage user access and permissions.</p>
        </div>
        <button
            onClick={() => setIsAssignDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
        >
            <UserPlus className="w-4 h-4" />
            <span>Assign Role</span>
        </button>
      </div>

       <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/80 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search users..." 
            className="w-full pl-10 pr-4 py-3 bg-muted/30 border-transparent focus:bg-card focus:border-blue-500 rounded-2xl outline-none transition-all duration-200 font-medium text-foreground placeholder:text-muted-foreground/80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      <div className="overflow-hidden rounded-3xl ring-1 ring-gray-200 bg-card">
          <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/30/50">
                    <tr>
                        <th className="py-4 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">User</th>
                        <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</th>
                        <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                        <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last Login</th>
                        <th className="relative py-4 pl-3 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-muted/30/50 transition-colors">
                            <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-medium text-foreground">{user.name}</div>
                                        <div className="text-muted-foreground text-xs">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4">
                                <span className={cn("inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium ring-1 ring-inset bg-blue-50 text-blue-700 ring-blue-700/10 uppercase tracking-wider")}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4">
                                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize", statusColor(user.accountStatus))}>
                                    {user.accountStatus}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                                {new Date(user.lastLoginAt).toLocaleDateString()}
                            </td>
                           <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                                <button className="text-muted-foreground/80 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                                    <Edit className="w-4 h-4" />
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
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-card p-8 text-left align-middle shadow-2xl transition-all">
                  <DialogTitle as="h3" className="text-xl font-bold leading-6 text-foreground">
                    Assign Role
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Grant specific permissions to a user.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-foreground/90 mb-1">User ID</label>
                        <input
                            {...register('userId')}
                            className="w-full rounded-xl border-border bg-muted/30 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Select user..." 
                        />
                        {errors.userId && <p className="text-xs text-red-500 mt-1">{errors.userId.message}</p>}
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-foreground/90 mb-1">Role</label>
                        <select
                            {...register('role')}
                            className="w-full rounded-xl border-border bg-muted/30 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Select a role</option>
                            <option value="admin">Admin</option>
                            <option value="therapist">Therapist</option>
                            <option value="user">User</option>
                        </select>
                        {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-foreground/90 mb-1">Reason</label>
                        <textarea
                             {...register('reason')}
                             rows={3}
                             className="w-full rounded-xl border-border bg-muted/30 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                             placeholder="Why is this role being assigned?"
                        />
                         {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>}
                     </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                        type="button"
                        className="inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/90 hover:bg-muted transition-colors"
                        onClick={() => setIsAssignDialogOpen(false)}
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        className="inline-flex justify-center rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200/50"
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
