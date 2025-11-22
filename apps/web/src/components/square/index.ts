/**
 * Square Appointments Integration - Alpha Release
 * 
 * This module provides comprehensive integration with Square Appointments
 * for booking and customer synchronization.
 * 
 * ⚠️ ALPHA FEATURE: This integration is in early development.
 * Some features may be unstable or incomplete.
 */

// Feature flags
export {
  isSquareAppointmentsEnabled,
  isSquareSyncEnabled,
  isSquareImportEnabled,
  shouldShowAlphaWarning,
} from '@/lib/feature-flags';

// Service exports
export {
  squareAppointmentsService,
  type SyncOptions,
  type SyncResult,
} from '@/services/square-appointments-service';

// UI Components
export { SquareIntegrationPanel } from '@/components/square/square-integration-panel';
export { SquareAdminPanel } from '@/components/square/square-admin-panel';

// Types
export type {
  SquareBooking,
  SquareCustomer,
  SquareWebhookEvent,
  NormalizedBooking,
} from '@/types/square';

// Constants
export const SQUARE_ALPHA_WARNING = 'This Square Appointments integration is in alpha. Some features may be unstable.';
export const SQUARE_SETUP_DOCS = '/docs/SQUARE_APPOINTMENTS_SETUP.md';