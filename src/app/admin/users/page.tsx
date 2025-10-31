'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getDataService } from '@/services/data-service';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { UserProfileView } from '@/components/eka/user-profile-view';
import { UserEditDialog } from '@/components/eka/user-edit-dialog';
import { Search, Eye, Edit, UserX, UserCheck, Filter, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, roleFilter, statusFilter, users]);

  const loadUsers = async () => {
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
  };

  const filterUsers = () => {
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
  };

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
      
      toast({
        title: 'Success',
        description: 'User profile updated successfully'
      });
      
      await loadUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user profile',
        variant: 'destructive'
      });
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
      
      toast({
        title: 'Success',
        description: `User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`
      });
      
      await loadUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive'
      });
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

  const handleBulkSuspend = async () => {
    const service = await getDataService();
    await Promise.all(selectedUserIds.map(id => service.updateUser(id, {
      accountStatus: 'suspended',
      suspendedReason: 'Bulk suspended by admin',
      suspendedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })));
    toast({ title: 'Bulk Suspend', description: 'Selected users suspended.' });
    setSelectedUserIds([]);
    await loadUsers();
  };

  const handleBulkActivate = async () => {
    const service = await getDataService();
    await Promise.all(selectedUserIds.map(id => service.updateUser(id, {
      accountStatus: 'active',
      suspendedReason: undefined,
      suspendedUntil: undefined
    })));
    toast({ title: 'Bulk Activate', description: 'Selected users activated.' });
    setSelectedUserIds([]);
    await loadUsers();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Therapist': return 'bg-info/10 text-info border-info/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'suspended': return 'destructive';
      case 'pending': return 'secondary';
      case 'deactivated': return 'outline';
      default: return 'default';
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user profiles, roles, and permissions
          </p>
        </div>
        <Button onClick={() => loadUsers()} variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.patients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Therapists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{stats.therapists}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="deactivated">Deactivated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button disabled={selectedUserIds.length === 0} onClick={handleBulkSuspend} variant="destructive">Suspend Selected</Button>
            <Button disabled={selectedUserIds.length === 0} onClick={handleBulkActivate} variant="default">Activate Selected</Button>
            {/* Add more bulk actions here */}
          </div>
          <div className="text-xs text-muted-foreground mt-2">{selectedUserIds.length} users selected</div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No users found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <input type="checkbox" ref={selectAllRef} checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0} onChange={e => handleSelectAll(e.target.checked)} />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Profile</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const typedUser = user as import('@/lib/types').User;
                    return (
                      <TableRow key={typedUser.id}>
                        <TableCell>
                          <input type="checkbox" checked={selectedUserIds.includes(typedUser.id)} onChange={e => handleSelectUser(typedUser.id, e.target.checked)} />
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer">
                                  {typedUser.avatarUrl ? (
                                    <img src={typedUser.avatarUrl} alt={typedUser.name || ''} className="w-8 h-8 rounded-full" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                                      {typedUser.initials}
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium flex items-center gap-1">
                                      {typedUser.name || typedUser.displayName}
                                      <Info className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    {typedUser.profileCompleteness !== undefined && (
                                      <div className="text-xs text-muted-foreground">
                                        Profile {typedUser.profileCompleteness}% complete
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs p-4">
                                <div className="font-semibold text-base mb-1">{typedUser.name || typedUser.displayName}</div>
                                <div className="text-xs mb-2">Role: {typedUser.role}</div>
                                {typedUser.birthday && (
                                  <div className="text-xs mb-1">Birthday: {new Date(typedUser.birthday).toLocaleDateString()}</div>
                                )}
                                {typedUser.preferences && (
                                  <div className="text-xs mb-1">Preferences:
                                    <ul className="ml-2 list-disc">
                                      {typedUser.preferences.favoriteDrink && (<li>Drink: {typedUser.preferences.favoriteDrink}</li>)}
                                      {typedUser.preferences.likesTea !== undefined && (<li>Likes Tea: {typedUser.preferences.likesTea ? 'Yes' : 'No'}</li>)}
                                      {typedUser.preferences.likesCoffee !== undefined && (<li>Likes Coffee: {typedUser.preferences.likesCoffee ? 'Yes' : 'No'}</li>)}
                                      {typedUser.preferences.hobbies && typedUser.preferences.hobbies.length > 0 && (<li>Hobbies: {typedUser.preferences.hobbies.join(', ')}</li>)}
                                      {typedUser.preferences.favoriteActivities && typedUser.preferences.favoriteActivities.length > 0 && (<li>Activities: {typedUser.preferences.favoriteActivities.join(', ')}</li>)}
                                    </ul>
                                  </div>
                                )}
                                {typedUser.therapistProfile?.specializations && (
                                  <div className="text-xs mb-1">Specializations: {typedUser.therapistProfile.specializations.join(', ')}</div>
                                )}
                                {typedUser.therapistProfile?.certifications && (
                                  <div className="text-xs mb-1">Certifications: {typedUser.therapistProfile.certifications.join(', ')}</div>
                                )}
                                {typedUser.accountStatus && (
                                  <div className="text-xs mb-1">Status: {typedUser.accountStatus}</div>
                                )}
                                {/* Admins see therapist-only info */}
                                {typedUser.therapistVisible && (
                                  <div className="mt-2">
                                    <div className="font-semibold text-xs mb-1">Therapist-Only Info</div>
                                    {typedUser.therapistVisible.birthday && (
                                      <div className="text-xs mb-1">Birthday: {new Date(typedUser.therapistVisible.birthday).toLocaleDateString()}</div>
                                    )}
                                    {typedUser.therapistVisible.preferences && (
                                      <div className="text-xs mb-1">Preferences:
                                        <ul className="ml-2 list-disc">
                                          {typedUser.therapistVisible.preferences.favoriteDrink && (<li>Drink: {typedUser.therapistVisible.preferences.favoriteDrink}</li>)}
                                          {typedUser.therapistVisible.preferences.likesTea !== undefined && (<li>Likes Tea: {typedUser.therapistVisible.preferences.likesTea ? 'Yes' : 'No'}</li>)}
                                          {typedUser.therapistVisible.preferences.likesCoffee !== undefined && (<li>Likes Coffee: {typedUser.therapistVisible.preferences.likesCoffee ? 'Yes' : 'No'}</li>)}
                                          {typedUser.therapistVisible.preferences.hobbies && typedUser.therapistVisible.preferences.hobbies.length > 0 && (<li>Hobbies: {typedUser.therapistVisible.preferences.hobbies.join(', ')}</li>)}
                                          {typedUser.therapistVisible.preferences.favoriteActivities && typedUser.therapistVisible.preferences.favoriteActivities.length > 0 && (<li>Activities: {typedUser.therapistVisible.preferences.favoriteActivities.join(', ')}</li>)}
                                        </ul>
                                      </div>
                                    )}
                                    {typedUser.therapistVisible.additionalNotes && (
                                      <div className="text-xs mb-1">Notes: {typedUser.therapistVisible.additionalNotes}</div>
                                    )}
                                  </div>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.accountStatus)}>
                            {user.accountStatus || 'active'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.role === 'Therapist' && user.therapistProfile?.specializations && (
                            <div className="text-xs text-muted-foreground">
                              {user.therapistProfile.specializations.slice(0, 2).join(', ')}
                              {user.therapistProfile.specializations.length > 2 && '...'}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewProfile(user)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant={(user.accountStatus || 'active') === 'active' ? 'destructive' : 'default'}
                              onClick={() => handleToggleStatus(user)}
                            >
                              {(user.accountStatus || 'active') === 'active' ? (
                                <><UserX className="h-4 w-4 mr-1" />Suspend</>
                              ) : (
                                <><UserCheck className="h-4 w-4 mr-1" />Activate</>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile View Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedUser && (
            <UserProfileView user={selectedUser} viewerRole="Admin" />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      {selectedUser && (
        <UserEditDialog
          user={selectedUser}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={handleSaveUser}
          viewerRole="Admin"
        />
      )}
    </div>
  );
}