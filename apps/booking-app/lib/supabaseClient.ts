import { createClient as createSharedClient } from '@repo/shared';

// Client for server components using SSR
// Uses API key authentication (not JWT)
export async function createClient() {
  return createSharedClient();
}
