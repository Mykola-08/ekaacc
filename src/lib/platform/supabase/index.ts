import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'env-missing';
const supabaseServiceRoleKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

// Singleton instances to prevent multiple clients
let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

// Create a single supabase client for interacting with your database
function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: typeof window !== 'undefined', // Only persist on client
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'x-application-name': 'ekaacc-app',
      },
    },
    db: {
      schema: 'public',
    },
  });

  return supabaseInstance;
}

export const supabase = getSupabaseClient();

// Create admin client with service role key for server-side operations
// This client bypasses Row Level Security (RLS) - use with caution
function getSupabaseAdminClient(): SupabaseClient {
  if (supabaseAdminInstance) return supabaseAdminInstance;

  const adminKey = supabaseServiceRoleKey || supabaseAnonKey;

  supabaseAdminInstance = createClient(supabaseUrl, adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-application-name': supabaseServiceRoleKey ? 'ekaacc-admin' : 'ekaacc-admin-readonly',
      },
    },
  });

  return supabaseAdminInstance;
}

export const supabaseAdmin = getSupabaseAdminClient();

// Helper function to get current user session
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await (supabase.auth as any).getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
};

// Helper function to get current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  return user?.id || null;
};

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const {
    data: { session },
  } = await (supabase.auth as any).getSession();
  return !!session;
};

export default supabase;
