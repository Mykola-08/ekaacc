// Notification types and configuration for all user roles

export type NotificationType = 
  | 'session_reminder'
  | 'session_confirmed'
  | 'session_cancelled'
  | 'session_completed'
  | 'new_report'
  | 'report_updated'
  | 'donation_received'
  | 'donation_request_approved'
  | 'new_message'
  | 'therapist_assigned'
  | 'appointment_available'
  | 'payment_received'
  | 'payment_failed'
  | 'subscription_expiring'
  | 'subscription_renewed'
  | 'new_exercise_assigned'
  | 'goal_achieved'
  | 'milestone_reached'
  | 'form_reminder'
  | 'admin_alert'
  | 'system_maintenance'
  | 'account_suspended'
  | 'account_activated'
  | 'new_client_assigned'
  | 'client_note_added'
  | 'audit_log_alert';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationCategory = 
  | 'sessions'
  | 'reports'
  | 'donations'
  | 'messages'
  | 'payments'
  | 'system'
  | 'admin';

export interface NotificationConfig {
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  icon: string;
  color: string;
  sound?: boolean;
  vibrate?: boolean;
  desktop?: boolean;
  email?: boolean;
  sms?: boolean;
}

export interface UserNotificationSettings {
  userId: string;
  enabledChannels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
    desktop: boolean;
  };
  categorySettings: {
    [key in NotificationCategory]: {
      enabled: boolean;
      sound: boolean;
      priority: NotificationPriority;
    };
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;
    days: number[]; // 0-6, Sunday to Saturday
  };
  preferences: {
    groupSimilar: boolean;
    showPreviews: boolean;
    markReadOnClick: boolean;
    autoDeleteAfterDays: number;
  };
}

export const defaultNotificationSettings: UserNotificationSettings = {
  userId: '',
  enabledChannels: {
    inApp: true,
    email: true,
    sms: false,
    push: true,
    desktop: true,
  },
  categorySettings: {
    sessions: { enabled: true, sound: true, priority: 'high' },
    reports: { enabled: true, sound: false, priority: 'medium' },
    donations: { enabled: true, sound: true, priority: 'medium' },
    messages: { enabled: true, sound: true, priority: 'high' },
    payments: { enabled: true, sound: true, priority: 'high' },
    system: { enabled: true, sound: false, priority: 'medium' },
    admin: { enabled: true, sound: true, priority: 'urgent' },
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
    days: [0, 1, 2, 3, 4, 5, 6],
  },
  preferences: {
    groupSimilar: true,
    showPreviews: true,
    markReadOnClick: true,
    autoDeleteAfterDays: 30,
  },
};

// Role-specific notification configurations
export const patientNotificationConfig: NotificationConfig[] = [
  {
    type: 'session_reminder',
    category: 'sessions',
    priority: 'high',
    title: 'Session Reminder',
    icon: 'Calendar',
    color: 'blue',
    sound: true,
    email: true,
  },
  {
    type: 'session_confirmed',
    category: 'sessions',
    priority: 'medium',
    title: 'Session Confirmed',
    icon: 'CheckCircle',
    color: 'green',
    sound: true,
    email: true,
  },
  {
    type: 'new_report',
    category: 'reports',
    priority: 'medium',
    title: 'New Report Available',
    icon: 'FileText',
    color: 'purple',
    email: true,
  },
  {
    type: 'donation_received',
    category: 'donations',
    priority: 'medium',
    title: 'Donation Received',
    icon: 'Heart',
    color: 'pink',
    sound: true,
    email: true,
  },
  {
    type: 'new_exercise_assigned',
    category: 'sessions',
    priority: 'medium',
    title: 'New Exercise Assigned',
    icon: 'Dumbbell',
    color: 'orange',
  },
  {
    type: 'goal_achieved',
    category: 'sessions',
    priority: 'medium',
    title: 'Goal Achieved!',
    icon: 'Trophy',
    color: 'gold',
    sound: true,
  },
  {
    type: 'subscription_expiring',
    category: 'payments',
    priority: 'high',
    title: 'Subscription Expiring Soon',
    icon: 'AlertTriangle',
    color: 'yellow',
    email: true,
  },
];

export const therapistNotificationConfig: NotificationConfig[] = [
  {
    type: 'new_client_assigned',
    category: 'sessions',
    priority: 'high',
    title: 'New Client Assigned',
    icon: 'UserPlus',
    color: 'blue',
    sound: true,
    email: true,
  },
  {
    type: 'session_reminder',
    category: 'sessions',
    priority: 'high',
    title: 'Upcoming Session',
    icon: 'Calendar',
    color: 'blue',
    sound: true,
  },
  {
    type: 'session_cancelled',
    category: 'sessions',
    priority: 'high',
    title: 'Session Cancelled',
    icon: 'XCircle',
    color: 'red',
    sound: true,
    email: true,
  },
  {
    type: 'client_note_added',
    category: 'reports',
    priority: 'medium',
    title: 'Client Note Added',
    icon: 'FileEdit',
    color: 'purple',
  },
  {
    type: 'new_message',
    category: 'messages',
    priority: 'high',
    title: 'New Message',
    icon: 'MessageSquare',
    color: 'blue',
    sound: true,
  },
  {
    type: 'form_reminder',
    category: 'reports',
    priority: 'medium',
    title: 'Form Completion Reminder',
    icon: 'ClipboardList',
    color: 'orange',
  },
];

export const adminNotificationConfig: NotificationConfig[] = [
  {
    type: 'admin_alert',
    category: 'admin',
    priority: 'urgent',
    title: 'Admin Alert',
    icon: 'AlertTriangle',
    color: 'red',
    sound: true,
    email: true,
    sms: true,
  },
  {
    type: 'audit_log_alert',
    category: 'admin',
    priority: 'high',
    title: 'Audit Log Alert',
    icon: 'Shield',
    color: 'red',
    sound: true,
    email: true,
  },
  {
    type: 'account_suspended',
    category: 'admin',
    priority: 'high',
    title: 'Account Suspended',
    icon: 'UserX',
    color: 'red',
    email: true,
  },
  {
    type: 'payment_failed',
    category: 'payments',
    priority: 'high',
    title: 'Payment Failed',
    icon: 'CreditCard',
    color: 'red',
    email: true,
  },
  {
    type: 'system_maintenance',
    category: 'system',
    priority: 'medium',
    title: 'System Maintenance Scheduled',
    icon: 'Settings',
    color: 'gray',
    email: true,
  },
  {
    type: 'new_message',
    category: 'messages',
    priority: 'medium',
    title: 'New Support Message',
    icon: 'MessageSquare',
    color: 'blue',
  },
];

export function getNotificationConfigForRole(role: 'Patient' | 'Therapist' | 'Admin'): NotificationConfig[] {
  switch (role) {
    case 'Patient':
      return patientNotificationConfig;
    case 'Therapist':
      return therapistNotificationConfig;
    case 'Admin':
      return adminNotificationConfig;
    default:
      return patientNotificationConfig;
  }
}

export function getCategoryColor(category: NotificationCategory): string {
  const colors = {
    sessions: 'text-blue-500',
    reports: 'text-purple-500',
    donations: 'text-pink-500',
    messages: 'text-green-500',
    payments: 'text-yellow-500',
    system: 'text-gray-500',
    admin: 'text-red-500',
  };
  return colors[category] || 'text-gray-500';
}

export function getPriorityBadgeVariant(priority: NotificationPriority): 'background' | 'border' | 'base' {
  switch (priority) {
    case 'urgent':
      return 'border';
    case 'high':
      return 'background';
    case 'medium':
      return 'base';
    case 'low':
      return 'base';
    default:
      return 'base';
  }
}
