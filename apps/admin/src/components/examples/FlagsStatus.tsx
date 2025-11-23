import React from 'react';
import { StatsigProvider, useStatsig } from '../providers/StatsigProvider';
import { getAllFlags } from '@/services/featureFlags';

// Server component wrapper to prefetch flags and pass to client provider
export async function PrefetchedFlags({ userId }: { userId?: string }) {
  const flags = await getAllFlags({ userId: userId || 'anonymous' });
  return (
    <StatsigProvider userID={userId} initialFlags={flags as unknown as Record<string, boolean>}>
      <FlagsStatus />
    </StatsigProvider>
  );
}

function FlagsStatus() {
  const { flags, ready } = useStatsig();
  if (!ready) return <div>Loading feature flags...</div>;
  return (
    <div className="text-xs text-muted-foreground space-y-1">
      {Object.entries(flags).map(([k, v]) => (
        <div key={k}>{k}: {v ? 'on' : 'off'}</div>
      ))}
    </div>
  );
}