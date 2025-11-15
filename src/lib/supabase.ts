import { createClient } from '@supabase/supabase-js'

// Connection pool and timeout configuration
const CONNECTION_CONFIG = {
  // Connection pooling settings
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  },
  
  // Request timeout settings
  timeout: {
    // Global fetch timeout
    global: 30000,
    // Individual request timeouts
    get: 5000,
    post: 10000,
    put: 10000,
    delete: 5000,
  },
  
  // Retry configuration
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
    retryCondition: (error: any) => {
      // Retry on network errors or 5xx server errors
      return !error.status || error.status >= 500;
    },
  },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: `supabase-auth-token-${supabaseUrl}`,
  },
  global: {
    headers: {
      'x-application-name': 'therapy-platform',
      'x-client-version': process.env.npm_package_version || '1.0.0',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-application-name': 'therapy-platform-admin',
        'x-client-version': process.env.npm_package_version || '1.0.0',
      },
    },
    db: {
      schema: 'public',
    },
  }
)