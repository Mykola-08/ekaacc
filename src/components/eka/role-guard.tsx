"use client";

import { useData } from "@/context/unified-data-context";
import { ReactNode, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Array<'Patient' | 'Therapist' | 'Admin'>;
  fallback?: ReactNode;
}

/**
 * Role-based access control component
 * Redirects to home if current user is not authorized
 */
export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { currentUser } = useData();
  const router = useRouter();

  const allowed = useMemo(() => {
    const effective = currentUser?.role;
    return !!effective && allowedRoles.includes(effective as any);
  }, [currentUser, allowedRoles]);

  useEffect(() => {
    if (!allowed) {
      // automatic redirect for unauthorized users
      try { router.replace('/'); } catch (e) { /* ignore in non-router contexts */ }
    }
  }, [allowed, router]);

  if (!allowed) return <>{fallback}</>;

  return <>{children}</>;
}

/**
 * Hook for checking if current user has a specific role
 */
export function useHasRole(role: 'Patient' | 'Therapist' | 'Admin'): boolean {
  const { currentUser } = useData();
  return currentUser?.role === role;
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
  const { currentUser } = useData();
  return currentUser?.role === 'Admin' || currentUser?.role === 'Therapist';
}
