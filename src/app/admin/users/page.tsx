'use client';

import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/keep';
import { useEffect, useState, useRef, useCallback } from 'react';
;
import { getDataService } from '@/services/data-service';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { UserProfileView } from '@/components/eka/user-profile-view';
import { UserEditDialog } from '@/components/eka/user-edit-dialog';
import { Users } from 'lucide-react';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import {
    StatCard,
    UserFilters,
    UserTable,
    UsersPageSkeleton,
    NoUsersFound,
    BulkActions,
    STATS_CONFIG
} from './components';

export default function UsersManagementPage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showProfileDialog, setShowProfileDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const selectAllRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const service = await getDataService();
            const allUsers = await service.getAllUsers();
            setUsers(allUsers || []);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load users',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filterUsers = useCallback(() => {
        let filtered = [...users];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(u =>
                u.name?.toLowerCase().includes(query) ||
                u.displayName?.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query) ||
                u.phoneNumber?.toLowerCase().includes(query)
            );
        }

        if (roleFilter !== 'all') {
            filtered = filtered.filter(u => u.role === roleFilter);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(u => (u.accountStatus || 'active') === statusFilter);
        }

        setFilteredUsers(filtered);
    }, [searchQuery, roleFilter, statusFilter, users]);

    useEffect(() => {
        filterUsers();
    }, [filterUsers]);


    const handleViewProfile = (user: User) => {
        setSelectedUser(user);
        setShowProfileDialog(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setShowEditDialog(true);
    };

    const handleSaveUser = async (updates: Partial<User>) => {
        if (!selectedUser) return;
        try {
            const service = await getDataService();
            await service.updateUser(selectedUser.id, updates);
            toast({ title: 'Success', description: 'User profile updated successfully' });
            await loadUsers();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update user profile', variant: 'destructive' });
            throw error;
        }
    };

    const handleToggleStatus = async (user: User) => {
        const newStatus = (user.accountStatus || 'active') === 'active' ? 'suspended' : 'active';
        try {
            const service = await getDataService();
            await service.updateUser(user.id, {
                accountStatus: newStatus,
                suspendedReason: newStatus === 'suspended' ? 'Suspended by admin' : undefined,
                suspendedUntil: newStatus === 'suspended' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
            });
            toast({ title: 'Success', description: `User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully` });
            await loadUsers();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update user status', variant: 'destructive' });
        }
    };

    const handleSelectUser = (userId: string, checked: boolean) => {
        setSelectedUserIds((prev) =>
            checked ? [...prev, userId] : prev.filter((id) => id !== userId)
        );
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedUserIds(checked ? filteredUsers.map(u => u.id) : []);
    };

    const handleBulkAction = async (action: 'suspend' | 'activate') => {
        const service = await getDataService();
        const updates = action === 'suspend'
            ? {
                accountStatus: 'suspended' as const,
                suspendedReason: 'Bulk suspended by admin',
                suspendedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
            : {
                accountStatus: 'active' as const,
                suspendedReason: undefined,
                suspendedUntil: undefined
            };

        try {
            await Promise.all(selectedUserIds.map(id => service.updateUser(id, updates)));
            toast({ title: `Bulk ${action}`, description: `Selected users ${action}ed.` });
            setSelectedUserIds([]);
            await loadUsers();
        } catch (error) {
            toast({ title: 'Error', description: `Failed to perform bulk ${action}`, variant: 'destructive' });
        }
    };

    const stats = {
        total: users.length,
        active: users.filter(u => (u.accountStatus || 'active') === 'active').length,
        therapists: users.filter(u => u.role === 'Therapist').length,
        patients: users.filter(u => u.role === 'Patient').length,
        admins: users.filter(u => u.role === 'Admin').length,
    };

    return (
        <SettingsShell>
            <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <SettingsHeader
                    title="User Management"
                    description="Oversee all user accounts, roles, and statuses from one place."
                />
            </div>

            {loading ? <UsersPageSkeleton /> : (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {STATS_CONFIG.map(stat => (
                            <StatCard key={stat.key} title={stat.title} value={stats[stat.key as keyof typeof stats].toString()} icon={stat.icon} />
                        ))}
                    </div>

                    <UserFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        roleFilter={roleFilter}
                        onRoleChange={setRoleFilter}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                        onRefresh={loadUsers}
                    />

                    {selectedUserIds.length > 0 && (
                        <BulkActions
                            onSuspend={() => handleBulkAction('suspend')}
                            onActivate={() => handleBulkAction('activate')}
                            selectedCount={selectedUserIds.length}
                        />
                    )}

                    {filteredUsers.length > 0 ? (
                        <UserTable
                            ref={selectAllRef}
                            users={filteredUsers}
                            selectedUserIds={selectedUserIds}
                            onSelectAll={handleSelectAll}
                            onSelectUser={handleSelectUser}
                            onViewProfile={handleViewProfile}
                            onEditUser={handleEditUser}
                            onToggleStatus={handleToggleStatus}
                        />
                    ) : (
                        <NoUsersFound />
                    )}
                </div>
            )}

            <Modal open={showProfileDialog} onOpenChange={setShowProfileDialog}>
                <ModalContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <ModalHeader>
                        <ModalTitle>User Profile</ModalTitle>
                    </ModalHeader>
                    {selectedUser && <UserProfileView user={selectedUser} viewerRole="Admin" />}
                </ModalContent>
            </Modal>

            {selectedUser && (
                <UserEditDialog
                    user={selectedUser}
                    open={showEditDialog}
                    onOpenChange={setShowEditDialog}
                    onSave={handleSaveUser}
                    viewerRole="Admin"
                />
            )}
        </SettingsShell>
    );
}