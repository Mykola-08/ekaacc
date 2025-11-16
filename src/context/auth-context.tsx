'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SystemRole, hasPermission, PermissionGroup, PermissionAction, CustomRole } from '@/lib/role-permissions';
import { User } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface AuthUser extends User {
  role: SystemRole;
  permissions: string[];
  customRoles?: CustomRole[];
  isActive: boolean;
  lastRoleChange?: string;
  roleAssignedBy?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'linkedin' | 'twitter') => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (group: PermissionGroup, action: PermissionAction, conditions?: Record<string, any>) => boolean;
  canAccessResource: (resource: string, action: PermissionAction, context?: Record<string, any>) => boolean;
  refreshUser: () => Promise<void>;
  updateUserRole: (userId: string, newRole: SystemRole, assignedBy: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkPermission = useCallback((
    group: PermissionGroup,
    action: PermissionAction,
    conditions?: Record<string, any>
  ): boolean => {
    if (!user) return false;
    return hasPermission(user.role, group, action, conditions);
  }, [user]);

  const checkResourceAccess = useCallback((
    resource: string,
    action: PermissionAction,
    context?: Record<string, any>
  ): boolean => {
    if (!user) return false;
    
    // Map resource to permission group
    const resourceToGroup: Record<string, PermissionGroup> = {
      'users': 'user_management',
      'appointments': 'appointment_management',
      'content': 'content_management',
      'products': 'product_management',
      'payments': 'financial_management',
      'settings': 'system_settings',
      'patient_data': 'patient_data',
      'therapist_tools': 'therapist_tools',
      'analytics': 'analytics',
      'messages': 'communication'
    };
    
    const group = resourceToGroup[resource];
    if (!group) return false;
    
    return checkPermission(group, action, context);
  }, [checkPermission]);

  const fetchUserWithRole = async (userId: string): Promise<AuthUser | null> => {
    try {
      // Fetch user data with role information from public.users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          user_roles!inner (
            role,
            is_active,
            assigned_at,
            assigned_by
          )
        `)
        .eq('id', userId)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      // If no user data found, create a basic user from auth data
      if (!userData) {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!authData.user) return null;

        return {
          id: authData.user.id,
          email: authData.user.email!,
          displayName: authData.user.user_metadata?.displayName || authData.user.email!,
          role: 'Patient',
          isActive: true,
          customRoles: [],
          permissions: []
        };
      }

      // Fetch custom roles if any
      const { data: customRoles } = await supabase
        .from('custom_roles')
        .select('*')
        .eq('is_active', true);

      return {
        ...userData,
        role: userData.user_roles?.[0]?.role || 'Patient',
        isActive: userData.user_roles?.[0]?.is_active ?? true,
        lastRoleChange: userData.user_roles?.[0]?.assigned_at,
        roleAssignedBy: userData.user_roles?.[0]?.assigned_by,
        customRoles: customRoles || [],
        permissions: [] // Will be populated based on role
      };
    } catch (error) {
      console.error('Error fetching user with role:', error);
      return null;
    }
  };

  const refreshUser = async () => {
    if (!user?.id) return;
    
    try {
      const refreshedUser = await fetchUserWithRole(user.id);
      if (refreshedUser) {
        setUser(refreshedUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from auth');

      const userWithRole = await fetchUserWithRole(authData.user.id);
      if (!userWithRole) throw new Error('User role not found');

      setUser(userWithRole);
      
      toast({
        title: 'Success',
        description: 'Signed in successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      setError(null);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from auth');

      // The trigger should create the user in public.users, but let's make sure
      // Wait a bit for the trigger to execute
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Assign default Patient role to new users
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'Patient',
          is_active: true,
          assigned_at: new Date().toISOString(),
        });

      if (roleError) {
        console.error('Error assigning default role:', roleError);
        // Don't throw here, as the user was created successfully
      }

      const userWithRole = await fetchUserWithRole(authData.user.id);
      if (userWithRole) {
        setUser(userWithRole);
      }
      
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'linkedin' | 'twitter') => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      
      // The OAuth flow will redirect the user, so we don't need to do anything here
      // The auth state change listener will handle the rest
      
      toast({
        title: 'Redirecting...',
        description: `Redirecting to ${provider} login...`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : `${provider} login failed`;
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      
      toast({
        title: 'Success',
        description: 'Signed out successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign out failed';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: SystemRole, assignedBy: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole,
          assigned_by: assignedBy,
          assigned_at: new Date().toISOString(),
          is_active: true
        });

      if (error) throw error;

      // Refresh current user if it's the same user
      if (user?.id === userId) {
        await refreshUser();
      }

      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user role';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userWithRole = await fetchUserWithRole(session.user.id);
          setUser(userWithRole);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userWithRole = await fetchUserWithRole(session.user.id);
        setUser(userWithRole);
        
        // Handle OAuth users who don't have a role yet
        if (!userWithRole) {
          // Create default Patient role for OAuth users
          try {
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: session.user.id,
                role: 'Patient',
                is_active: true,
                assigned_at: new Date().toISOString(),
              });

            if (roleError) {
              console.error('Error assigning default role to OAuth user:', roleError);
            } else {
              // Fetch the user again with the new role
              const updatedUser = await fetchUserWithRole(session.user.id);
              setUser(updatedUser);
            }
          } catch (error) {
            console.error('Error handling OAuth user role assignment:', error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    hasPermission: checkPermission,
    canAccessResource: checkResourceAccess,
    refreshUser,
    updateUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}