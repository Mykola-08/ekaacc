'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/components/ui/morphing-toaster';
import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function NotificationsListener(): any {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { newNotification } = useNotifications(userId);

  useEffect(() => {
    const getUserId = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (!newNotification) return;

    // Custom toast content based on type
    const getIcon = (type: string) => {
      switch (type) {
        case 'success':
          return <CheckCircle className="h-5 w-5 text-emerald-500" />;
        case 'error':
          return <XCircle className="h-5 w-5 text-red-500" />;
        case 'warning':
          return <AlertTriangle className="h-5 w-5 text-amber-500" />;
        default:
          return <Info className="h-5 w-5 text-primary" />;
      }
    };

    const opts = {
      description: newNotification.message,
      duration: 5000,
    };

    switch (newNotification.type) {
      case 'success':
        toast.success(newNotification.title, opts);
        break;
      case 'error':
        toast.error(newNotification.title, opts);
        break;
      case 'warning':
        toast.warning(newNotification.title, opts);
        break;
      default:
        toast.info(newNotification.title, opts);
    }

    // Optionally perform other actions like playing a sound
  }, [newNotification]);

  return null; // This component handles side effects only
}
