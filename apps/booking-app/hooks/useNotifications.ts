import { useState, useCallback, useEffect } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export interface AppNotification {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  metadata: any;
  created_at: string;
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [newNotification, setNewNotification] = useState<AppNotification | null>(null);

  const handleUpdate = useCallback((payload: RealtimePostgresChangesPayload<AppNotification>) => {
    if (payload.eventType === 'INSERT') {
      const newNotif = payload.new;
      setNewNotification(newNotif);
      setNotifications(prev => [newNotif, ...prev]);
    }
  }, []);

  useRealtimeSubscription<AppNotification>({
    table: 'app_notifications',
    filter: userId ? `recipient_id=eq.${userId}` : undefined,
    enabled: !!userId,
    callback: handleUpdate,
  });

  // Fetch initial notifications
  useEffect(() => {
    if (!userId) return;
    const fetchNotifs = async () => {
        const supabase = createClient();
        const { data } = await supabase
            .from('app_notifications')
            .select('*')
            .eq('recipient_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);
        
        if (data) setNotifications(data as AppNotification[]);
    };
    fetchNotifs();
  }, [userId]);

  return { notifications, newNotification, setNotifications };
}
