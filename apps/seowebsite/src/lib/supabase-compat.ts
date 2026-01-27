
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

import { SupabaseClient } from '@supabase/supabase-js';

const createSupabaseClient = (): SupabaseClient<Database> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    return createClient<Database>(supabaseUrl, supabaseKey);
  }

  // Return a proxy that logs errors when accessed, preventing immediate crash
  // but ensuring the error is caught by ErrorBoundary when used
  console.error('Supabase initialization failed: Missing environment variables');

  return new Proxy({} as any, {
    get: (_, prop) => {
      // Allow auth.onAuthStateChange to run safely (returning a dummy subscription)
      if (prop === 'auth') {
        return {
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
          getSession: () => Promise.resolve({ data: { session: null } }),
          getUser: () => Promise.resolve({ data: { user: null } }),
          signInWithOAuth: () => Promise.reject(new Error('Missing Supabase credentials')),
          signOut: () => Promise.resolve(),
        } as any;
      }

      // Safe fallback for database operations
      if (prop === 'from') {
        return () => {
          const createChain = () => {
            const chainStub = {
              select: createChain,
              insert: createChain,
              update: createChain,
              delete: createChain,
              eq: createChain,
              neq: createChain,
              gt: createChain,
              lt: createChain,
              gte: createChain,
              lte: createChain,
              like: createChain,
              ilike: createChain,
              is: createChain,
              in: createChain,
              contains: createChain,
              order: createChain,
              limit: createChain,
              single: () => Promise.resolve({ data: null, error: { message: 'Missing Supabase credentials' } }),
              maybeSingle: () => Promise.resolve({ data: null, error: null }),
              then: (resolve: any) => Promise.resolve({ data: [], error: { message: 'Missing Supabase credentials' } }).then(resolve)
            };
            return chainStub;
          };
          return createChain();
        };
      }

      // Safe fallback for storage
      if (prop === 'storage') {
        return {
            from: () => ({
                upload: () => Promise.reject(new Error('Missing Supabase credentials')),
                getPublicUrl: () => ({ data: { publicUrl: '' } })
            })
        }
      }

      console.warn(`Attempting to access supabase.${String(prop)} with missing environment variables`);
      return undefined;
    }
  }) as SupabaseClient<Database>;
};

export const supabase = createSupabaseClient();
