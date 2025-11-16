import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

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

// Lazy initialization to prevent module-level errors
let supabaseInstance: SupabaseClient | null = null
let adminInstance: SupabaseClient | null = null

// Client-side safe environment variable getter
const getEnvVar = (name: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: use process.env directly
    return process.env[name] || ''
  } else {
    // Client-side: Next.js should replace these, but add extra safety
    const globalEnv = (typeof global !== 'undefined' ? global : window) as any
    
    // Try multiple ways to get the env var
    return (
      process.env[name] ||
      globalEnv[name] ||
      globalEnv.process?.env?.[name] ||
      ''
    )
  }
}

// Get environment variables with hardcoded fallbacks
const getSupabaseConfig = () => {
  const url = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || 'https://rbnfyxhewsivofvwdpuk.supabase.co'
  const anonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmZ5eGhld3Npdm9mdndkcHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTYzNDQsImV4cCI6MjA3ODYzMjM0NH0.beEFcpqzV7obLX0McrR-lK7V37RE0RbRTpVEKcub_Ko'
  const serviceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmZ5eGhld3Npdm9mdndkcHVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA1NjM0NCwiZXhwIjoyMDc4NjMyMzQ0fQ.5gzhfCb4GwDII-H6SFjhGegKa-Pk_aDxrOQkVVaGuMA'
  
  return { url, anonKey, serviceKey }
}

// Lazy initialization function
const initializeSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    const { url, anonKey } = getSupabaseConfig()
    
    if (!url || !anonKey) {
      console.error('Supabase configuration missing:', { hasUrl: !!url, hasKey: !!anonKey })
      throw new Error('Supabase URL and anon key are required')
    }
    
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
          storageKey: `supabase-auth-token-${url}`,
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
      
      if (typeof window !== 'undefined') {
        console.log('Supabase client initialized successfully')
      }
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      throw error
    }
  }
  
  return supabaseInstance
}

// Create a proxy that delays initialization until first use
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = initializeSupabase()
    return (client as any)[prop]
  },
  set(target, prop, value) {
    const client = initializeSupabase()
    ;(client as any)[prop] = value
    return true
  }
})

// Admin client with lazy initialization
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    if (!adminInstance) {
      const { url, serviceKey } = getSupabaseConfig()
      
      if (!url || !serviceKey) {
        console.error('Supabase admin configuration missing:', { hasUrl: !!url, hasServiceKey: !!serviceKey })
        throw new Error('Supabase URL and service key are required for admin client')
      }
      
      adminInstance = createClient(url, serviceKey, {
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
      })
    }
    
    return (adminInstance as any)[prop]
  }
})