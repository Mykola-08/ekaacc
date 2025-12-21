import { createServerSupabaseClient } from '@repo/shared/server';

export async function createClient() {
  return createServerSupabaseClient({
    cookieDomain: process.env.NODE_ENV === 'production' ? '.ekabalance.com' : undefined,
  });
}
