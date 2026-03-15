'use client';

import React, { useState, useEffect } from 'react';
import { Search, Shield, AlertTriangle, Eye, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InlineFeedback } from '@/components/ui/inline-feedback';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { supabase } from '@/lib/platform/supabase';

interface User {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: {
    name: string;
    description: string | null;
  };
  created_at: string;
  last_active: string | null;
}

interface UserImpersonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImpersonate: (userId: string, reason: string) => Promise<void>;
}

export function UserImpersonationDialog({
  open,
  onOpenChange,
  onImpersonate,
}: UserImpersonationDialogProps) {
  const { feedback, setError, reset } = useMorphingFeedback();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [impersonationReason, setImpersonationReason] = useState('');
  const [isImpersonating, setIsImpersonating] = useState(false);

  // Fetch users for impersonation
  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
        return;
      }

      const formattedUsers = data.map((user: any) => ({
        id: user.auth_id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: {
          name: user.role || 'client',
          description: null,
        },
        created_at: user.created_at,
        last_active: user.last_active,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImpersonate = async () => {
    if (!selectedUser || !impersonationReason.trim()) {
      setError('Please select a user and provide a reason for impersonation');
      return;
    }

    setIsImpersonating(true);
    try {
      await onImpersonate(selectedUser.id, impersonationReason);
      onOpenChange(false);
      setSelectedUser(null);
      setImpersonationReason('');
    } catch (error) {
      console.error('Impersonation error:', error);
      setError('Failed to start impersonation');
    } finally {
      setIsImpersonating(false);
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'therapist':
        return 'default';
      case 'user':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Impersonation
          </DialogTitle>
          <DialogDescription>
            Select a user to impersonate. This action will be logged for security purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You are about to impersonate another user. All actions taken during impersonation will
              be logged. Make sure to provide a valid reason for this action.
            </AlertDescription>
          </Alert>

          <div className="">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search users by email, username, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-75 rounded-2xl border">
              <div className="p-4">
                {loading ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="text-muted-foreground">Loading users...</div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="text-muted-foreground">No users found</div>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <Card
                      key={user.id}
                      className={`cursor-pointer transition-colors ${
                        selectedUser?.id === user.id ? 'ring-primary ring-2' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>
                              {getInitials(user.full_name, user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate font-medium">
                                {user.full_name || user.username || user.email}
                              </p>
                              <Badge variant={getRoleBadgeColor(user.role?.name)}>
                                {user.role?.name}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground truncate text-sm">{user.email}</p>
                            <p className="text-muted-foreground text-xs">
                              Member since {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {selectedUser?.id === user.id && <Eye className="text-primary h-5 w-5" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {selectedUser && (
            <div className="">
              <Label htmlFor="reason">Reason for Impersonation *</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a detailed reason for impersonating this user..."
                value={impersonationReason}
                onChange={(e) => setImpersonationReason(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedUser(null);
              setImpersonationReason('');
            }}
            disabled={isImpersonating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImpersonate}
            disabled={!selectedUser || !impersonationReason.trim() || isImpersonating}
          >
            {isImpersonating ? (
              <>
                <div className="border-primary-foreground mr-2 h-4 w-4 animate-spin rounded-full border-b-2" />
                Starting Impersonation...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Start Impersonation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ImpersonationBannerProps {
  impersonation: {
    originalUserEmail?: string;
    targetUserEmail?: string;
    originalUserId?: string;
    targetUserId?: string;
    reason?: string;
    startedAt: string;
  };
  onEndImpersonation: () => void;
}

export function ImpersonationBanner({
  impersonation,
  onEndImpersonation,
}: ImpersonationBannerProps) {
  const [isEnding, setIsEnding] = useState(false);

  const handleEndImpersonation = async () => {
    setIsEnding(true);
    try {
      await onEndImpersonation();
    } catch (error) {
      console.error('Error ending impersonation:', error);
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <div className="border-warning/30 bg-warning/20 border-b px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-warning h-5 w-5" />
          <div className="text-sm">
            <span className="text-warning font-medium">
              Impersonating: {impersonation.targetUserEmail || impersonation.targetUserId || 'User'}
            </span>
            <span className="text-warning ml-2">
              (Original: {impersonation.originalUserEmail || 'Admin'})
            </span>
            {impersonation.reason && (
              <span className="text-warning ml-2">• Reason: {impersonation.reason}</span>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEndImpersonation}
          disabled={isEnding}
          className="border-warning/40 text-warning hover:bg-warning/10"
        >
          {isEnding ? (
            <>
              <div className="border-warning mr-2 h-3 w-3 animate-spin rounded-full border-b-2" />
              Ending...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-3 w-3" />
              End Impersonation
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
