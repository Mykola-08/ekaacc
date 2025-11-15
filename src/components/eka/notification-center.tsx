'use client';

import { Badge, Button, Dropdown, DropdownAction, DropdownContent, Tabs, TabsContent, TabsItem, TabsList } from '@/components/keep';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, X, Settings as SettingsIcon, Filter } from 'lucide-react';
;
;
;
;
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/supabase-auth';
import { 
  NotificationType, 
  NotificationCategory, 
  NotificationPriority,
  getNotificationConfigForRole,
  getCategoryColor,
  getPriorityBadgeVariant
} from '@/lib/notification-types';
;

type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
};

import fxService from '@/lib/fx-service';

export function NotificationCenter() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filterCategory, setFilterCategory] = useState<NotificationCategory | 'all'>('all');
  const { appUser: currentUser } = useAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list:any = await fxService.listNotifications();
        if (mounted && list && list.length) {
          setNotifications(list.map((n:any) => ({ 
            id: n.id, 
            title: n.title, 
            message: n.body || '', 
            type: n.type || 'system_maintenance', 
            category: n.category || 'system',
            priority: n.priority || 'medium',
            read: !!n.seen, 
            timestamp: new Date(n.createdAt),
            actionUrl: n.actionUrl
          })));
          return;
        }
      } catch (e) {
        // fallback to demo list
      }
      // fallback demo items based on user role
      if (mounted && currentUser) {
        const roleBasedNotifications = getRoleBasedDemoNotifications(currentUser.role);
        setNotifications(roleBasedNotifications);
      }
    })();
    return () => { mounted = false; };
  }, [currentUser]);

  const getRoleBasedDemoNotifications = (role: 'Patient' | 'Therapist' | 'Admin'): Notification[] => {
    if (role === 'Admin') {
      return [
        {
          id: '1',
          title: 'Audit Log Alert',
          message: 'Unusual activity detected in user account system',
          type: 'audit_log_alert',
          category: 'admin',
          priority: 'urgent',
          read: false,
          timestamp: new Date(Date.now() - 1800000),
        },
        {
          id: '2',
          title: 'System Maintenance',
          message: 'Scheduled maintenance tonight at 2:00 AM',
          type: 'system_maintenance',
          category: 'system',
          priority: 'high',
          read: false,
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '3',
          title: 'Payment Failed',
          message: 'Payment processing failed for subscription renewal',
          type: 'payment_failed',
          category: 'payments',
          priority: 'high',
          read: true,
          timestamp: new Date(Date.now() - 7200000),
        },
      ];
    } else if (role === 'Therapist') {
      return [
        {
          id: '1',
          title: 'New Client Assigned',
          message: 'John Smith has been assigned to you',
          type: 'new_client_assigned',
          category: 'sessions',
          priority: 'high',
          read: false,
          timestamp: new Date(Date.now() - 1800000),
        },
        {
          id: '2',
          title: 'Upcoming Session',
          message: 'Session with Mary Johnson starts in 30 minutes',
          type: 'session_reminder',
          category: 'sessions',
          priority: 'high',
          read: false,
          timestamp: new Date(Date.now() - 900000),
        },
        {
          id: '3',
          title: 'Client Note Added',
          message: 'New note added by patient Sarah Williams',
          type: 'client_note_added',
          category: 'reports',
          priority: 'medium',
          read: true,
          timestamp: new Date(Date.now() - 7200000),
        },
      ];
    } else {
      return [
        {
          id: '1',
          title: 'Upcoming Session',
          message: 'Your massage therapy session is tomorrow at 2:00 PM',
          type: 'session_reminder',
          category: 'sessions',
          priority: 'high',
          read: false,
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '2',
          title: 'New Report Available',
          message: 'Your therapist has added a new progress report',
          type: 'new_report',
          category: 'reports',
          priority: 'medium',
          read: false,
          timestamp: new Date(Date.now() - 7200000),
        },
        {
          id: '3',
          title: 'Donation Received',
          message: 'Thank you! A donation of €50 was received',
          type: 'donation_received',
          category: 'donations',
          priority: 'medium',
          read: true,
          timestamp: new Date(Date.now() - 86400000),
        },
      ];
    }
  };

  const filteredNotifications = filterCategory === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === filterCategory);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // persist seen state where available
    try { fxService.markSeen && fxService.markSeen(id).catch(() => {}); } catch (e) { /* ignore */ }
  };

  const markAllAsRead = () => {
    const unread = notifications.filter((n) => !n.read).map((n) => n.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // persist seen state for all
    try {
      if (fxService.markSeen) {
        unread.forEach((id) => { fxService.markSeen(id).catch(() => {}); });
      }
    } catch (e) { /* ignore */ }
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationColor = (category: NotificationCategory) => {
    return getCategoryColor(category);
  };

  const getCategoryCount = (category: NotificationCategory) => {
    return notifications.filter(n => n.category === category && !n.read).length;
  };

  return (
    <Dropdown>
      <DropdownAction asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownAction>
      <DropdownContent align="end" className="w-96">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => router.push('/account/notifications')}
              title="Notification Settings"
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs value={filterCategory} onValueChange={(v) => setFilterCategory(v as NotificationCategory | 'all')} className="w-full">
          <TabsList className="w-full justify-start px-2 py-1 h-auto bg-muted/50">
            <TabsItem value="all" className="text-xs px-2 py-1">
              All {unreadCount > 0 && `(${unreadCount})`}
            </TabsItem>
            {currentUser?.role === 'Admin' && (
              <TabsItem value="admin" className="text-xs px-2 py-1">
                Admin {getCategoryCount('admin') > 0 && `(${getCategoryCount('admin')})`}
              </TabsItem>
            )}
            <TabsItem value="sessions" className="text-xs px-2 py-1">
              Sessions {getCategoryCount('sessions') > 0 && `(${getCategoryCount('sessions')})`}
            </TabsItem>
            <TabsItem value="reports" className="text-xs px-2 py-1">
              Reports {getCategoryCount('reports') > 0 && `(${getCategoryCount('reports')})`}
            </TabsItem>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-96">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 hover:bg-muted/50 transition-colors cursor-pointer',
                    !notification.read && 'bg-primary/5'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            getNotificationColor(notification.category)
                          )}
                        />
                        <p className="font-medium text-sm">
                          {notification.title}
                        </p>
                        <Badge variant={getPriorityBadgeVariant(notification.priority)} className="text-xs py-0 px-1 h-4">
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleDateString()} at{' '}
                        {notification.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownContent>
    </Dropdown>
  );
}
