"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';
import { PageHeaderSkeleton, StatsSkeleton, UserListSkeleton } from '@/components/eka/loading-skeletons';
import type { User } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await fxService.getUsers();
      setUsers(allUsers || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast({ title: 'Error', description: 'Failed to load users', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string) => {
    if (!editRole) {
      toast({ title: 'Error', description: 'Please select a role', variant: 'destructive' });
      return;
    }
    try {
      await fxService.updateUserRole(userId, editRole);
      toast({ title: 'Success', description: 'User role updated' });
      setEditingId(null);
      setEditRole('');
      await loadUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast({ title: 'Error', description: 'Failed to update user role', variant: 'destructive' });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      case 'Therapist': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return '👑';
      case 'Therapist': return '👨‍⚕️';
      default: return '👤';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <PageHeaderSkeleton />
        <StatsSkeleton />
        <Card className="shadow-lg border-border/50">
          <div className="p-6">
            <UserListSkeleton />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-background rounded-xl p-6 border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure user roles and permissions
            </p>
          </div>
          <Button 
            onClick={loadUsers} 
            variant="outline" 
            disabled={loading}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'Admin').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Therapists</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'Therapist').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patients</p>
              <p className="text-2xl font-bold">{users.filter(u => !u.role || u.role === 'Patient').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users List */}
      <Card className="shadow-lg border-border/50">
        <div className="p-6">
          {!loading && users.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-muted-foreground font-medium">No users found</p>
            </div>
          )}
          {!loading && users.length > 0 && (
            <div className="space-y-4">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xl font-semibold group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {editingId === user.id ? (
                      <>
                        <select 
                          className="text-sm px-3 py-2 border rounded-lg bg-background hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                        >
                          <option value="">Select role</option>
                          <option value="Admin">👑 Admin</option>
                          <option value="Therapist">👨‍⚕️ Therapist</option>
                          <option value="Patient">👤 Patient</option>
                        </select>
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateRole(user.id)}
                          className="shadow-sm hover:shadow-md transition-shadow"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setEditingId(null)}
                          className="hover:bg-destructive/5 hover:border-destructive/50 hover:text-destructive transition-colors"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className={`text-sm font-semibold px-3 py-1.5 rounded-lg border ${getRoleBadgeColor(user.role || 'Patient')}`}>
                          {getRoleIcon(user.role || 'Patient')} {user.role || 'Patient'}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => { setEditingId(user.id); setEditRole(user.role || 'Patient'); }}
                          className="hover:bg-primary/5 hover:border-primary/50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Role
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
