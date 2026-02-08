/**
 * Feature flag system for managing alpha/beta features
 */

export interface FeatureFlags {
  squareAppointments: {
    enabled: boolean;
    syncEnabled: boolean;
    webhooksEnabled: boolean;
    importEnabled: boolean;
    alphaWarning: boolean;
  };
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  squareAppointments: {
    enabled: process.env.NEXT_PUBLIC_SQUARE_APPOINTMENTS_ENABLED === 'true',
    syncEnabled: process.env.NEXT_PUBLIC_SQUARE_SYNC_ENABLED === 'true',
    webhooksEnabled: process.env.NEXT_PUBLIC_SQUARE_WEBHOOKS_ENABLED === 'true',
    importEnabled: process.env.NEXT_PUBLIC_SQUARE_IMPORT_ENABLED === 'true',
    alphaWarning: true, // Always show alpha warning for Square features
  },
};

export function getFeatureFlags(): FeatureFlags {
  // In production, this could be fetched from a remote config service
  return DEFAULT_FEATURE_FLAGS;
}

export function isSquareAppointmentsEnabled(): boolean {
  return getFeatureFlags().squareAppointments.enabled;
}

export function isSquareSyncEnabled(): boolean {
  const flags = getFeatureFlags();
  return flags.squareAppointments.enabled && flags.squareAppointments.syncEnabled;
}

export function isSquareImportEnabled(): boolean {
  const flags = getFeatureFlags();
  return flags.squareAppointments.enabled && flags.squareAppointments.importEnabled;
}

export function shouldShowAlphaWarning(): boolean {
  return getFeatureFlags().squareAppointments.alphaWarning;
}
