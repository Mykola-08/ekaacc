'use server';

// The Square SDK changed its exports in recent major versions. This module
// is maintained only for backwards-compatibility and is marked as deprecated
// in the codebase. To avoid type and runtime issues after upgrading the
// `square` package we keep this file as a safe no-op. Real integrations
// should be implemented in server-side functions or the payments backend.

/**
 * @deprecated Use server-side functions or Firestore-backed webhooks to access Square data.
 */
export async function getSquareBookings(userPhoneNumber?: string): Promise<any[]> {
  // Intentionally return an empty result to avoid runtime errors after dependency upgrades.
  console.warn('getSquareBookings is deprecated. Use server-side Square integration instead.');
  return [];
}
