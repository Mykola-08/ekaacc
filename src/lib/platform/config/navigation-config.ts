import {
  SystemRole,
  PermissionGroup,
  PermissionAction,
} from '@/lib/platform/config/role-permissions';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  description?: string;
  category: NavigationCategory;
  permissions: NavigationPermission[];
  children?: NavigationItem[];
  isExternal?: boolean;
  isBeta?: boolean;
  order: number;
  requiresSubscription?: boolean;
  metadata?: Record<string, any>;
}

export interface NavigationPermission {
  group: PermissionGroup;
  action: PermissionAction;
  conditions?: Record<string, any>;
}

export type NavigationCategory =
  | 'dashboard'
  | 'appointments'
  | 'patients'
  | 'therapy'
  | 'reports'
  | 'administration'
  | 'settings'
  | 'content'
  | 'analytics'
  | 'communication'
  | 'billing'
  | 'tools';

export interface NavigationConfig {
  items: NavigationItem[];
  categories: Record<
    NavigationCategory,
    {
      label: string;
      icon: string;
      order: number;
      description: string;
    }
  >;
}

export const NAVIGATION_CONFIG: NavigationConfig = {
  categories: {
    dashboard: {
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      order: 1,
      description: 'Overview and key metrics',
    },
    appointments: {
      label: 'Appointments',
      icon: 'Calendar',
      order: 2,
      description: 'Scheduling and booking management',
    },
    patients: {
      label: 'Patients',
      icon: 'Users',
      order: 3,
      description: 'Patient management and records',
    },
    therapy: {
      label: 'Therapy',
      icon: 'Heart',
      order: 4,
      description: 'Therapy tools and resources',
    },
    reports: {
      label: 'Reports',
      icon: 'FileText',
      order: 5,
      description: 'Analytics and reporting',
    },
    administration: {
      label: 'Administration',
      icon: 'Settings',
      order: 6,
      description: 'System administration',
    },
    settings: {
      label: 'Settings',
      icon: 'UserCog',
      order: 7,
      description: 'User preferences and configuration',
    },
    content: {
      label: 'Content',
      icon: 'FileEdit',
      order: 8,
      description: 'Content management',
    },
    analytics: {
      label: 'Analytics',
      icon: 'BarChart3',
      order: 9,
      description: 'Data analysis and insights',
    },
    communication: {
      label: 'Communication',
      icon: 'MessageSquare',
      order: 10,
      description: 'Messaging and notifications',
    },
    billing: {
      label: 'Billing',
      icon: 'CreditCard',
      order: 11,
      description: 'Payment and billing management',
    },
    tools: {
      label: 'Tools',
      icon: 'Wrench',
      order: 12,
      description: 'Additional tools and utilities',
    },
  },

  items: [
    // Dashboard Items
    {
      id: 'home',
      label: 'Home',
      href: '/home',
      icon: 'Home',
      category: 'dashboard',
      order: 1,
      permissions: [
        { group: 'patient_data', action: 'view_own' },
        { group: 'analytics', action: 'read' },
      ],
      metadata: { universal: true },
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'LayoutDashboard',
      category: 'dashboard',
      order: 2,
      permissions: [{ group: 'analytics', action: 'read' }],
    },
    {
      id: 'therapist-dashboard',
      label: 'Therapist Dashboard',
      href: '/therapist/dashboard',
      icon: 'UserCheck',
      category: 'dashboard',
      order: 3,
      permissions: [{ group: 'therapist_tools', action: 'read' }],
      metadata: { roleSpecific: 'Therapist' },
    },

    // Appointment Items
    {
      id: 'appointments',
      label: 'Appointments',
      href: '/appointments',
      icon: 'Calendar',
      category: 'appointments',
      order: 1,
      permissions: [{ group: 'appointment_management', action: 'read' }],
    },
    {
      id: 'booking',
      label: 'Book Session',
      href: '/sessions/booking',
      icon: 'CalendarPlus',
      category: 'appointments',
      order: 2,
      permissions: [{ group: 'appointment_management', action: 'create' }],
    },
    {
      id: 'therapist-bookings',
      label: 'Client Bookings',
      href: '/therapist/bookings',
      icon: 'CalendarCheck',
      category: 'appointments',
      order: 3,
      permissions: [
        { group: 'appointment_management', action: 'read', conditions: { assigned: true } },
      ],
      metadata: { roleSpecific: 'Therapist' },
    },
    {
      id: 'booking-links',
      label: 'Booking Links',
      href: '/therapist/booking-links',
      icon: 'Link',
      category: 'appointments',
      order: 4,
      permissions: [{ group: 'appointment_management', action: 'create' }],
      metadata: { roleSpecific: 'Therapist' },
    },

    // Patient Items
    {
      id: 'patients',
      label: 'Patients',
      href: '/patients',
      icon: 'Users',
      category: 'patients',
      order: 1,
      permissions: [{ group: 'user_management', action: 'read', conditions: { role: 'Patient' } }],
    },
    {
      id: 'clients',
      label: 'My Clients',
      href: '/therapist/clients',
      icon: 'UserCheck',
      category: 'patients',
      order: 2,
      permissions: [
        {
          group: 'user_management',
          action: 'read',
          conditions: { role: 'Patient', assigned: true },
        },
      ],
      metadata: { roleSpecific: 'Therapist' },
    },
    {
      id: 'person-profile',
      label: 'Person Profile',
      href: '/therapist/person',
      icon: 'User',
      category: 'patients',
      order: 3,
      permissions: [{ group: 'patient_data', action: 'view_own', conditions: { assigned: true } }],
      metadata: { roleSpecific: 'Therapist' },
    },

    // Therapy Items
    {
      id: 'sessions',
      label: 'Sessions',
      href: '/sessions',
      icon: 'Video',
      category: 'therapy',
      order: 1,
      permissions: [{ group: 'appointment_management', action: 'read' }],
    },
    {
      id: 'journal',
      label: 'Journal',
      href: '/wellness',
      icon: 'BookOpen',
      category: 'therapy',
      order: 2,
      permissions: [{ group: 'patient_data', action: 'view_own' }],
    },
    {
      id: 'goals',
      label: 'Goals',
      href: '/goals',
      icon: 'Target',
      category: 'therapy',
      order: 3,
      permissions: [{ group: 'patient_data', action: 'view_own' }],
    },
    {
      id: 'tools',
      label: 'Therapy Tools',
      href: '/tools',
      icon: 'Wrench',
      category: 'therapy',
      order: 4,
      permissions: [{ group: 'therapist_tools', action: 'read' }],
    },
    {
      id: 'templates',
      label: 'Templates',
      href: '/therapist/templates',
      icon: 'FileText',
      category: 'therapy',
      order: 5,
      permissions: [{ group: 'therapist_tools', action: 'read' }],
      metadata: { roleSpecific: 'Therapist' },
    },

    // Reports Items
    {
      id: 'reports',
      label: 'Reports',
      href: '/reports',
      icon: 'FileText',
      category: 'reports',
      order: 1,
      permissions: [{ group: 'analytics', action: 'read' }],
    },
    {
      id: 'progress-reports',
      label: 'Progress Reports',
      href: '/wellness?tab=progress',
      icon: 'TrendingUp',
      category: 'reports',
      order: 2,
      permissions: [{ group: 'patient_data', action: 'view_own' }],
    },
    {
      id: 'donations-reports',
      label: 'Donations',
      href: '/donations/reports',
      icon: 'Heart',
      category: 'reports',
      order: 3,
      permissions: [{ group: 'financial_management', action: 'read' }],
    },
    {
      id: 'ai-insights',
      label: 'AI Insights',
      href: '/ai-insights',
      icon: 'Brain',
      category: 'reports',
      order: 4,
      permissions: [{ group: 'analytics', action: 'read' }],
      isBeta: true,
    },

    // Administration Items
    {
      id: 'admin',
      label: 'Console',
      href: '/console',
      icon: 'Shield',
      category: 'administration',
      order: 1,
      permissions: [{ group: 'system_settings', action: 'manage' }],
    },
    {
      id: 'users',
      label: 'User Management',
      href: '/console/users',
      icon: 'Users',
      category: 'administration',
      order: 2,
      permissions: [{ group: 'user_management', action: 'manage' }],
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      href: '/console/subscriptions',
      icon: 'CreditCard',
      category: 'administration',
      order: 3,
      permissions: [{ group: 'product_management', action: 'manage' }],
    },
    {
      id: 'payments',
      label: 'Payments',
      href: '/console/payments',
      icon: 'DollarSign',
      category: 'administration',
      order: 4,
      permissions: [{ group: 'financial_management', action: 'manage' }],
    },
    {
      id: 'community-setup',
      label: 'Community Setup',
      href: '/console/community',
      icon: 'Users',
      category: 'administration',
      order: 5,
      permissions: [{ group: 'system_settings', action: 'update' }],
    },

    // Settings Items
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: 'Settings',
      category: 'settings',
      order: 1,
      permissions: [{ group: 'system_settings', action: 'read' }],
      metadata: { universal: true },
    },
    {
      id: 'myaccount',
      label: 'My Account',
      href: '/myaccount',
      icon: 'User',
      category: 'settings',
      order: 2,
      permissions: [{ group: 'patient_data', action: 'view_own' }],
      metadata: { universal: true },
    },
    {
      id: 'personalization',
      label: 'Personalization',
      href: '/personalization',
      icon: 'Palette',
      category: 'settings',
      order: 3,
      permissions: [{ group: 'system_settings', action: 'update' }],
    },
    {
      id: 'subscription-settings',
      label: 'Subscription',
      href: '/finances?tab=plans',
      icon: 'CreditCard',
      category: 'settings',
      order: 4,
      permissions: [{ group: 'product_management', action: 'read' }],
    },
    {
      id: 'loyalty',
      label: 'Loyalty Program',
      href: '/loyalty',
      icon: 'Award',
      category: 'settings',
      order: 5,
      permissions: [{ group: 'product_management', action: 'read' }],
      requiresSubscription: true,
    },
    {
      id: 'privacy-controls',
      label: 'Privacy Controls',
      href: '/privacy-controls',
      icon: 'Shield',
      category: 'settings',
      order: 6,
      permissions: [{ group: 'patient_data', action: 'view_own' }],
      metadata: { universal: true },
    },

    // Content Items
    {
      id: 'forms',
      label: 'Forms',
      href: '/forms',
      icon: 'FileText',
      category: 'content',
      order: 1,
      permissions: [{ group: 'content_management', action: 'read' }],
    },
    {
      id: 'therapists',
      label: 'Therapists',
      href: '/therapists',
      icon: 'UserSearch',
      category: 'content',
      order: 2,
      permissions: [{ group: 'content_management', action: 'read' }],
    },

    // Communication Items
    {
      id: 'messages',
      label: 'Messages',
      href: '/messages',
      icon: 'MessageSquare',
      category: 'communication',
      order: 1,
      permissions: [{ group: 'communication', action: 'read' }],
    },

    // Analytics Items
    {
      id: 'progress',
      label: 'Progress',
      href: '/progress',
      icon: 'TrendingUp',
      category: 'analytics',
      order: 1,
      permissions: [{ group: 'patient_data', action: 'view_own' }],
    },

    // Additional Tools
    {
      id: 'donation-seeker',
      label: 'Donation Seeker',
      href: '/donation-seeker',
      icon: 'Heart',
      category: 'tools',
      order: 1,
      permissions: [{ group: 'system_settings', action: 'read' }],
    },
    {
      id: 'verificator',
      label: 'Verificator',
      href: '/verificator',
      icon: 'CheckCircle',
      category: 'tools',
      order: 2,
      permissions: [{ group: 'system_settings', action: 'read' }],
    },
    {
      id: 'donations',
      label: 'Donations',
      href: '/donations',
      icon: 'Heart',
      category: 'tools',
      order: 3,
      permissions: [{ group: 'financial_management', action: 'read' }],
    },
  ],
};

// Helper functions for navigation filtering
export function getNavigationItemsByCategory(category: NavigationCategory): NavigationItem[] {
  return NAVIGATION_CONFIG.items.filter((item) => item.category === category);
}

export function getNavigationItemsByRole(role: SystemRole): NavigationItem[] {
  const normalizedRole = String(role).toLowerCase();

  return NAVIGATION_CONFIG.items.filter((item) => {
    // Check if item has role-specific metadata
    if (item.metadata?.roleSpecific) {
      const requiredRole = String(item.metadata.roleSpecific).toLowerCase();
      if (requiredRole !== normalizedRole) {
        return false;
      }
    }

    // Check if item is universal (accessible to all authenticated users)
    if (item.metadata?.universal) {
      return true;
    }

    // Check permissions
    return item.permissions.some((permission) => {
      // This will be checked by the permission service
      return true; // Return true here, actual permission check happens in the service
    });
  });
}

export function getFlattenedNavigationItems(items: NavigationItem[]): NavigationItem[] {
  const flattened: NavigationItem[] = [];

  items.forEach((item) => {
    flattened.push(item);
    if (item.children) {
      flattened.push(...getFlattenedNavigationItems(item.children));
    }
  });

  return flattened;
}

export function findNavigationItemById(id: string): NavigationItem | undefined {
  const flattened = getFlattenedNavigationItems(NAVIGATION_CONFIG.items);
  return flattened.find((item) => item.id === id);
}

export function findNavigationItemByHref(href: string): NavigationItem | undefined {
  const flattened = getFlattenedNavigationItems(NAVIGATION_CONFIG.items);
  return flattened.find((item) => item.href === href);
}
