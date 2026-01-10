/**
 * Supabase Authentication Hook
 * Re-exports the useAuth hook from auth-context for backwards compatibility
 */

export { useAuth, AuthProvider } from '@/context/platform/auth-context'
export type { AuthUser, AuthState, LoginCredentials, SignUpCredentials } from '@/types/platform/auth'
