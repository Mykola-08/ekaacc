'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { listUsers, updateUserRole } from '@/app/actions/admin-users';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { 
  User as UserIcon, 
  Search, 
  RefreshCw, 
  MoreVertical, 
  Check, 
  Shield 
} from 'lucide-react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SYSTEM_ROLES } from '@/lib/platform/config/role-permissions';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function UserManagementHeadless() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const result = await listUsers();
    if (result.success && result.data) {
      setUsers(result.data);
    } else {
      toast({ title: 'Error', description: 'Failed to load users: ' + result.error, variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const originalUsers = [...users];
    // Optimistic update
    setUsers(users.map(u => u.id === userId ? { ...u, user_metadata: { ...u.user_metadata, role: newRole } } : u));
    
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      toast({ title: 'Success', description: 'User role updated' });
    } else {
      setUsers(originalUsers);
      toast({ title: 'Error', description: 'Failed to update role: ' + result.error, variant: 'destructive' });
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.id.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
            <h2 className="text-xl font-bold text-foreground">User Management</h2>
            <p className="text-sm text-muted-foreground">Manage standard user accounts and permissions.</p>
        </div>
        <button
            onClick={loadUsers}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-card text-foreground/90 border border-border rounded-xl hover:bg-muted/30 transition-colors shadow-sm disabled:opacity-50"
        >
            <RefreshCw className={cn("w-4 h-4", loading ? "animate-spin" : "")} />
            <span>Refresh</span>
        </button>
      </div>

       <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/80 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search users by email or ID..." 
            className="w-full pl-10 pr-4 py-3 bg-muted/30 border-transparent focus:bg-card focus:border-blue-500 rounded-2xl outline-none transition-all duration-200 font-medium text-foreground placeholder:text-muted-foreground/80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      <div className="overflow-hidden rounded-3xl ring-1 ring-gray-200 bg-card shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/30/50">
                <tr>
                    <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">User</th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Joined</th>
                    <th scope="col" className="relative py-4 pl-3 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
                {filteredUsers.length === 0 && !loading && (
                    <tr>
                        <td colSpan={4} className="py-10 text-center text-muted-foreground">No users found.</td>
                    </tr>
                )}
                {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30/50 transition-colors group">
                        <td className="whitespace-nowrap py-4 pl-6 pr-3">
                            <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                                    {user.email?.charAt(0).toUpperCase() || <UserIcon className="w-5 h-5" />}
                                </div>
                                <div className="ml-4">
                                    <div className="font-medium text-foreground">{user.email}</div>
                                    <div className="text-muted-foreground/80 text-xs font-mono">{user.id}</div>
                                </div>
                            </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground relative z-10 w-48">
                            <div className="w-40">
                                <Listbox 
                                    value={user.user_metadata?.role || 'User'} 
                                    onChange={(val) => handleRoleChange(user.id, val)}
                                >
                                    <div className="relative">
                                    <ListboxButton className="relative w-full cursor-default rounded-xl bg-card/50 py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6 hover:bg-card transition-colors">
                                        <span className="block truncate font-medium text-foreground/90">{user.user_metadata?.role || 'User'}</span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <Shield className="h-4 w-4 text-muted-foreground/80" aria-hidden="true" />
                                        </span>
                                    </ListboxButton>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-card py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {Object.keys(SYSTEM_ROLES).map((role) => (
                                            <ListboxOption
                                            key={role}
                                            className={({ active }) =>
                                                cn(
                                                active ? 'bg-blue-50 text-blue-900' : 'text-foreground',
                                                'relative cursor-default select-none py-2 pl-10 pr-4'
                                                )
                                            }
                                            value={role}
                                            >
                                            {({ selected }) => (
                                                <>
                                                <span className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}>
                                                    {role}
                                                </span>
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                    <Check className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                                </>
                                            )}
                                            </ListboxOption>
                                        ))}
                                        </ListboxOptions>
                                    </Transition>
                                    </div>
                                </Listbox>
                            </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                             {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                           <Menu as="div" className="relative inline-block text-left">
                                <MenuButton className="p-2 text-muted-foreground/80 hover:text-muted-foreground rounded-lg hover:bg-muted/30 outline-none">
                                    <MoreVertical className="w-5 h-5" />
                                </MenuButton>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <MenuItems className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-xl bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="p-1">
                                            <MenuItem>
                                                {({ active }) => (
                                                    <button className={cn(active ? 'bg-muted/30' : '', 'group flex w-full items-center rounded-lg px-2 py-2 text-sm text-foreground')}>
                                                        View Details
                                                    </button>
                                                )}
                                            </MenuItem>
                                             <MenuItem>
                                                {({ active }) => (
                                                    <button className={cn(active ? 'bg-red-50 text-red-700' : 'text-foreground', 'group flex w-full items-center rounded-lg px-2 py-2 text-sm')}>
                                                        Suspend User
                                                    </button>
                                                )}
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </Transition>
                           </Menu>
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
