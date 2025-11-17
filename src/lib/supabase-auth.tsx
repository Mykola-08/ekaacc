/**
 * This file re-exports the auth context to maintain backward compatibility.
 * All auth functionality is now centralized in @/context/auth-context.
 * This prevents duplicate auth provider issues.
 */
'use client'

export { AuthProvider, useAuth } from '@/context/auth-context'