import { createServiceRoleClient, withRetry } from '@repo/shared/server';

// Service role client (server-side only). DO NOT expose service key to client bundles.
// Uses API key authentication (not JWT)
export const supabaseServer = createServiceRoleClient({
  appName: 'eka-booking-app',
  schema: 'public',
});

// Export withRetry from shared package
export { withRetry };

// Legacy export for backward compatibility
export async function createClient() {
  return supabaseServer;
}
