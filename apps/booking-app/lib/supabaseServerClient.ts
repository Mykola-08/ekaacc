import { createClient } from '@supabase/supabase-js';

// Service role client (server-side only). DO NOT expose service key to client bundles.
// Uses API key authentication (not JWT)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rbnfyxhewsivofvwdpuk.supabase.co';
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  throw new Error('SUPABASE_SECRET_KEY is not defined');
}

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
