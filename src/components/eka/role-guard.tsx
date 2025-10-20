"use client";

import { useData } from "@/context/unified-data-context";
import { ReactNode } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Array<'Patient' | 'Therapist' | 'Admin'>;
  fallback?: ReactNode;
}

/**
 * Role-based access control component
 * Only renders children if current user has one of the allowed roles
 */
export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { currentUser } = useData();
  
  if (!currentUser || !allowedRoles.includes(currentUser.role as any)) {
    return <>{fallback}</>;
  }
  
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
