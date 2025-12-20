import { createServerSupabaseClient } from '@repo/shared';

export async function createClient() {
  return createServerSupabaseClient({
    cookieDomain: process.env.NODE_ENV === 'production' ? '.ekabalance.com' : undefined,
  });
}
