'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { listUsers, updateUserRole } from '@/app/actions/admin-users';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { User as UserIcon, Search, RefreshCw, MoreVertical, Check, Shield } from 'lucide-react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
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
      toast({
        title: 'Error',
        description: 'Failed to load users: ' + result.error,
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const originalUsers = [...users];
    // Optimistic update
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, user_metadata: { ...u.user_metadata, role: newRole } } : u
      )
    );

    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      toast({ title: 'Success', description: 'User role updated' });
    } else {
      setUsers(originalUsers);
      toast({
        title: 'Error',
        description: 'Failed to update role: ' + result.error,
        variant: 'destructive',
      });
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
        </div>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="bg-card text-foreground/90 border-border hover:bg-muted/30 flex items-center gap-2 rounded-lg border px-4 py-2.5 shadow-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn('h-4 w-4', loading ? 'animate-spin' : '')} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="group relative w-full sm:w-96">
        <Search className="text-muted-foreground/80 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transition-colors group-focus-within:text-primary" />
        <input
          type="text"
          placeholder="Search users by email or ID..."
          className="bg-muted/30 focus:bg-card text-foreground placeholder:text-muted-foreground/80 w-full rounded-lg border-transparent py-3 pr-4 pl-10 font-medium transition-all duration-200 outline-none focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-card overflow-hidden rounded-lg shadow-sm ring-1 ring-border">
        <div className="overflow-x-auto">
          <table className="divide-border min-w-full divide-y">
            <thead className="bg-muted/30/50">
              <tr>
                <th
                  scope="col"
                  className="text-muted-foreground py-4 pr-3 pl-6 text-left text-xs font-semibold tracking-wide uppercase"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="text-muted-foreground px-3 py-4 text-left text-xs font-semibold tracking-wide uppercase"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="text-muted-foreground px-3 py-4 text-left text-xs font-semibold tracking-wide uppercase"
                >
                  Joined
                </th>
                <th
                  scope="col"
                  className="text-muted-foreground relative py-4 pr-6 pl-3 text-right text-xs font-semibold tracking-wide uppercase"
                >
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
                <tr key={user.id} className="hover:bg-muted/30/50 group transition-colors">
                  <td className="py-4 pr-3 pl-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-muted to-muted font-semibold text-primary shadow-sm">
                        {user.email?.charAt(0).toUpperCase() || <UserIcon className="h-5 w-5" />}
                      </div>
                      <div className="ml-4">
                        <div className="text-foreground font-medium">{user.email}</div>
                        <div className="text-muted-foreground/80 font-mono text-xs">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted-foreground relative z-10 w-48 px-3 py-4 text-sm whitespace-nowrap">
                    <div className="w-40">
                      <Listbox
                        value={user.user_metadata?.role || 'User'}
                        onChange={(val) => handleRoleChange(user.id, val)}
                      >
                        <div className="relative">
                          <ListboxButton className="bg-card/50 hover:bg-card relative w-full cursor-default rounded-lg py-2 pr-10 pl-3 text-left shadow-sm ring-1 ring-border transition-colors ring-inset focus:ring-2 focus:ring-primary focus:outline-none sm:text-sm sm:leading-6">
                            <span className="text-foreground/90 block truncate font-medium">
                              {user.user_metadata?.role || 'User'}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <Shield
                                className="text-muted-foreground/80 h-4 w-4"
                                aria-hidden="true"
                              />
                            </span>
                          </ListboxButton>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <ListboxOptions className="bg-card ring-opacity-5 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg py-1 text-base shadow-sm ring-1 ring-black focus:outline-none sm:text-sm">
                              {Object.keys(SYSTEM_ROLES).map((role) => (
                                <ListboxOption
                                  key={role}
                                  className={({ active }) =>
                                    cn(
                                      active ? 'bg-primary/5 text-foreground' : 'text-foreground',
                                      'relative cursor-default py-2 pr-4 pl-10 select-none'
                                    )
                                  }
                                  value={role}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={cn(
                                          'block truncate',
                                          selected ? 'font-medium' : 'font-normal'
                                        )}
                                      >
                                        {role}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
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
                  <td className="text-muted-foreground px-3 py-4 text-sm whitespace-nowrap">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="relative py-4 pr-6 pl-3 text-right text-sm font-medium whitespace-nowrap">
                    <Menu as="div" className="relative inline-block text-left">
                      <MenuButton className="text-muted-foreground/80 hover:text-muted-foreground hover:bg-muted/30 rounded-lg p-2 outline-none">
                        <MoreVertical className="h-5 w-5" />
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
                        <MenuItems className="bg-card ring-opacity-5 absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-lg shadow-sm ring-1 ring-black focus:outline-none">
                          <div className="p-1">
                            <MenuItem>
                              {({ active }) => (
                                <button
                                  className={cn(
                                    active ? 'bg-muted/30' : '',
                                    'group text-foreground flex w-full items-center rounded-lg px-2 py-2 text-sm'
                                  )}
                                >
                                  View Details
                                </button>
                              )}
                            </MenuItem>
                            <MenuItem>
                              {({ active }) => (
                                <button
                                  className={cn(
                                    active ? 'bg-destructive/10 text-destructive' : 'text-foreground',
                                    'group flex w-full items-center rounded-lg px-2 py-2 text-sm'
                                  )}
                                >
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
