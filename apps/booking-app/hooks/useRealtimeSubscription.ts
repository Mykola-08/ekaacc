import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeSubscriptionProps<T extends { [key: string]: any }> {
  table: string;
  schema?: string;
  event?: RealtimeEvent;
  filter?: string;
  callback: (payload: RealtimePostgresChangesPayload<T>) => void;
  enabled?: boolean;
}

export function useRealtimeSubscription<T extends { [key: string]: any } = any>({
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
    
    console.log(`Subscribing to realtime channel: ${channelName}`);

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
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to ${channelName}`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`Failed to subscribe to ${channelName}`);
        }
      });

    return () => {
      console.log(`Unsubscribing from realtime channel: ${channelName}`);
      supabase.removeChannel(channel);
    };
  }, [table, schema, event, filter, enabled, JSON.stringify(callback)]);
}
