'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectValue } from '@/components/keep';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SelectTrigger } from '@/components/ui/select';
import { forwardRef } from 'react';
;
;
;
;
;
;
;
import type { User } from '@/lib/types';
import { Search, Eye, Edit, UserX, UserCheck, Filter, Users, User as UserIcon, Shield, Activity } from 'lucide-react';

// --- Reusable Components for this page ---

export function StatCard({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

export function UserFilters({
    searchQuery,
    onSearchChange,
    roleFilter,
    onRoleChange,
    statusFilter,
    onStatusChange,
    onRefresh
}: {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    roleFilter: string;
    onRoleChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    onRefresh: () => void;
}) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 w-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={roleFilter} onValueChange={onRoleChange}>
                            <SelectTrigger className="w-[160px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="Patient">Patient</SelectItem>
                                <SelectItem value="Therapist">Therapist</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={onStatusChange}>
                            <SelectValue placeholder="Status"  />
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="deactivated">Deactivated</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={onRefresh} variant="outline" className="hidden md:inline-flex">
                            Refresh
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const getRoleBadgeVariant = (role: string) => {
    switch (role) {
        case 'Admin': return 'border';
        case 'Therapist': return 'background';
        default: return 'background';
    }
};

const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
        case 'active': return 'background';
        case 'suspended': return 'border';
        case 'pending': return 'background';
        case 'deactivated': return 'border';
        default: return 'background';
    }
};

interface UserTableProps {
    users: User[];
    selectedUserIds: string[];
    onSelectAll: (checked: boolean) => void;
    onSelectUser: (userId: string, checked: boolean) => void;
    onViewProfile: (user: User) => void;
    onEditUser: (user: User) => void;
    onToggleStatus: (user: User) => void;
}

export const UserTable = forwardRef<HTMLInputElement, UserTableProps>(({
    users,
    selectedUserIds,
    onSelectAll,
    onSelectUser,
    onViewProfile,
    onEditUser,
    onToggleStatus
}, ref) => {
    const allSelected = selectedUserIds.length === users.length && users.length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Users List</CardTitle>
                <CardContent className="p-0 pt-4">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <input type="checkbox" ref={ref} checked={allSelected} onChange={e => onSelectAll(e.target.checked)} />
                                    </TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <input type="checkbox" checked={selectedUserIds.includes(user.id)} onChange={e => onSelectUser(user.id, e.target.checked)} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt={user.name || ''} className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                                                        {user.initials}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium">{user.name || user.displayName}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(user.accountStatus)}>{user.accountStatus || 'active'}</Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-1 justify-end">
                                                <Button size="sm" variant="outline" onClick={() => onViewProfile(user)}><Eye className="h-4 w-4" /></Button>
                                                <Button size="sm" variant="outline" onClick={() => onEditUser(user)}><Edit className="h-4 w-4" /></Button>
                                                <Button size="sm" variant="outline" onClick={() => onToggleStatus(user)}>
                                                    {(user.accountStatus || 'active') === 'active' ? <UserX className="h-4 w-4 text-destructive" /> : <UserCheck className="h-4 w-4 text-green-500" />}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </CardHeader>
        </Card>
    );
});
UserTable.displayName = 'UserTable';


export function UsersPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
            </div>
            <Skeleton className="h-24" />
            <Skeleton className="h-96" />
        </div>
    );
}

export function NoUsersFound() {
    return (
        <Card className="flex flex-col items-center justify-center py-20">
            <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold">No Users Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </Card>
    );
}

export function BulkActions({ onSuspend, onActivate, selectedCount }: { onSuspend: () => void, onActivate: () => void, selectedCount: number }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Bulk Actions</CardTitle>
                    <p className="text-sm text-muted-foreground pt-1">{selectedCount} user(s) selected</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="default" className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={onSuspend} disabled={selectedCount === 0}>
                        <UserX className="mr-2 h-4 w-4" /> Suspend
                    </Button>
                    <Button onClick={onActivate} disabled={selectedCount === 0}>
                        <UserCheck className="mr-2 h-4 w-4" /> Activate
                    </Button>
                </div>
            </CardHeader>
        </Card>
    );
}

export const STATS_CONFIG = [
    { title: 'Total Users', key: 'total', icon: Users },
    { title: 'Active Users', key: 'active', icon: Activity },
    { title: 'Therapists', key: 'therapists', icon: UserIcon },
    { title: 'Admins', key: 'admins', icon: Shield },
];
