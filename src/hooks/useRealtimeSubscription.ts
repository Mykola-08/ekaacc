import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeSubscriptionProps<T extends Record<string, unknown>> {
  table: string;
  schema?: string;
  event?: RealtimeEvent;
  filter?: string;
  callback: (payload: RealtimePostgresChangesPayload<T>) => void;
  enabled?: boolean;
}

export function useRealtimeSubscription<
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  table,
  schema = 'public',
  event = '*',
  filter,
  callback,
  enabled = true,
}: UseRealtimeSubscriptionProps<T>) {
  const supabase = createClient();

  useEffect(() => {
    if (!enabled) return;

    const channelName = `${schema}:${table}${filter ? `:${filter}` : ''}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event,
          schema,
          table,
          filter,
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          callback(payload);
        }
      )
      .subscribe((status: string) => {
        if (status === 'CHANNEL_ERROR') {
          console.error(`Failed to subscribe to ${channelName}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, schema, event, filter, enabled, JSON.stringify(callback)]);
}
