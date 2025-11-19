import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Log warning if using placeholder values (only in development)
if (process.env.NODE_ENV === 'development' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.warn('⚠️  Supabase environment variables not set. Using placeholder values. Some features may not work.')
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    cookieOptions: {
      domain: process.env.NODE_ENV === 'production' ? '.ekabalance.com' : undefined,
    },
  },
  global: {
    headers: {
      'x-application-name': 'ekaacc-app',
    },
  },
  db: {
    schema: 'public',
  },
})

// Create admin client with service role key for server-side operations
// This client bypasses Row Level Security (RLS) - use with caution
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          'x-application-name': 'ekaacc-admin',
        },
      },
    })
  : supabase // Fallback to regular client if service role key is not available

// Helper function to get current user session
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  return user
}

// Helper function to get current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const user = await getCurrentUser()
  return user?.id || null
}

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

export default supabase