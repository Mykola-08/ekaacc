"use client";

import { useAuth } from "@/context/auth-context";
import { ReactNode, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Array<'Patient' | 'Therapist' | 'Admin'>;
  fallback?: ReactNode;
}

function parseRolesFromUser(currentUser: any): string[] {
  if (!currentUser) return [];
  // If user has an explicit roles array
  if (Array.isArray(currentUser.roles) && currentUser.roles.length) return currentUser.roles.map(String);
  // If role is string, allow comma/pipe/semicolon-separated values
  if (typeof currentUser.role === 'string') return currentUser.role.split(/[,|;]+/).map((s: string) => s.trim()).filter(Boolean);
  return [String(currentUser.role)];
}

/**
 * Role-based access control component
 * Waits until unified data is loaded, then checks persona override (localStorage)
 * and compares against allowedRoles. Will only redirect after loading finishes.
 */
export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { appUser: currentUser, loading } = useAuth();
  const router = useRouter();

  const effectiveRoles = useMemo(() => {
    // persona override from localStorage (dev/demo)
    if (typeof window !== 'undefined') {
      try {
        const p = localStorage.getItem('eka_persona');
        if (p) return [p];
      } catch (e) { /* ignore */ }
    }
    return parseRolesFromUser(currentUser);
  }, [currentUser]);

  const allowed = useMemo(() => {
    if (!effectiveRoles || effectiveRoles.length === 0) return false;
    return effectiveRoles.some(r => allowedRoles.includes(r as any));
  }, [effectiveRoles, allowedRoles]);

  useEffect(() => {
    // Don't redirect while data is loading (prevents flash/incorrect redirect)
    if (loading) return;
    if (!allowed) {
      try { router.replace('/'); } catch (e) { /* ignore in non-router contexts */ }
    }
  }, [allowed, loading, router]);

  if (loading) return <>{fallback}</>;
  if (!allowed) return <>{fallback}</>;

  return <>{children}</>;
}

/**
 * Hook for checking if current user has a specific role
 */
export function useHasRole(role: 'Patient' | 'Therapist' | 'Admin'): boolean {
  const { appUser: currentUser } = useAuth();
  const roles = parseRolesFromUser(currentUser);
  return roles.includes(role);
}

/**
 * Hook for checking if current user is admin
 */
export function useIsAdmin(): boolean {
  return useHasRole('Admin');
}

/**
 * Hook for checking if current user is therapist
 */
export function useIsTherapist(): boolean {
  return useHasRole('Therapist');
}

/**
 * Hook for checking if current user is admin or therapist
 */
export function useIsStaff(): boolean {
  const { appUser: currentUser } = useAuth();
  const roles = parseRolesFromUser(currentUser);
  return roles.includes('Admin') || roles.includes('Therapist');
}
