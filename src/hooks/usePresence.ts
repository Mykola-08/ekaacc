import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase/client';

interface PresenceState {
  [key: string]: unknown;
}

interface UsePresenceProps {
  roomName: string;
  user: {
    id: string;
    [key: string]: unknown;
  } | null;
  enabled?: boolean;
}

export function usePresence({ roomName, user, enabled = true }: UsePresenceProps) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceState[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!enabled || !user) return;

    const channel = supabase.channel(roomName);

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = Object.values(newState).flat() as PresenceState[];
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, () => {
        // User joined
      })
      .on('presence', { event: 'leave' }, () => {
        // User left
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
            ...user,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [roomName, user?.id, enabled]);

  return { onlineUsers };
}

