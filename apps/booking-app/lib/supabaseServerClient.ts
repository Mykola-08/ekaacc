import { createClient } from '@supabase/supabase-js';

// Service role client (server-side only). DO NOT expose service key to client bundles.
// Uses API key authentication (not JWT)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rbnfyxhewsivofvwdpuk.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmZ5eGhld3Npdm9mdndkcHVrIiwicm9zZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA1NjM0NCwiZXhwIjoyMDc4NjMyMzQ0fQ.5gzhfCb4GwDII-H6SFjhGegKa-Pk_aDxrOQkVVaGuMA';

export const supabaseServer = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'x-application-name': 'eka-booking-app'
    }
  },
  db: {
    schema: 'public'
  }
});

// Retry wrapper for critical database operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      
      // Don't retry if it's a user error (4xx)
      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = String((err as any).code);
        if (errorCode.startsWith('4')) {
          throw err;
        }
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }
  
  throw lastError;
}

// Log database queries in development
if (process.env.NODE_ENV === 'development' && process.env.DEBUG_DB === 'true') {
  console.log('🔍 Database query logging enabled');
}
