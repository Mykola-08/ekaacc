import { supabase } from '@/lib/platform/supabase'
import type { User } from '@supabase/supabase-js'

/**
 * Get current user from session (server-side)
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await (supabase.auth as any).getUser()
    
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

/**
 * Get current user with role information
 */
export async function getCurrentUserWithRole(): Promise<{
  user: User | null
  role: string | null
  isAdmin: boolean
} | null> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return null
    }

    // Get user role from database
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error getting user role:', error)
      return {
        user,
        role: null,
        isAdmin: false
      }
    }

    const role = userData?.role || 'user'
    const isAdmin = role === 'admin'

    return {
      user,
      role,
      isAdmin
    }
  } catch (error) {
    console.error('Error in getCurrentUserWithRole:', error)
    return null
  }
}