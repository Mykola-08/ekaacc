'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { SystemRole, hasPermission } from '@/lib/role-permissions';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Shield,
  Package,
  BarChart3,
  CreditCard,
  MessageSquare,
  BookOpen,
  Award,
  Building,
  Palette,
  DollarSign
} from 'lucide-react';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: SystemRole[];
  permission?: {
    group: string;
    action: string;
  };
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Sessions',
    href: '/sessions',
    icon: Calendar,
    roles: ['Patient', 'VIP Patient', 'Therapist', 'Admin']
  },
  {
    title: 'Progress',
    href: '/progress',
    icon: BarChart3,
    roles: ['Patient', 'VIP Patient', 'Therapist', 'Admin']
  },
  {
    title: 'Journal',
    href: '/journal',
    icon: FileText,
    roles: ['Patient', 'VIP Patient', 'Therapist', 'Admin']
  },
  {
    title: 'Exercises',
    href: '/tools',
    icon: BookOpen,
    roles: ['Patient', 'VIP Patient', 'Therapist', 'Admin']
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    roles: ['Patient', 'VIP Patient', 'Therapist', 'Admin']
  },
  {
    title: 'Therapists',
    href: '/therapists',
    icon: Users,
    roles: ['Patient', 'VIP Patient', 'Admin']
  },
  {
    title: 'Admin',
    href: '/admin',
    icon: Shield,
    roles: ['Admin'],
    badge: 'Admin'
  },
  {
    title: 'Therapist Dashboard',
    href: '/therapist',
    icon: Award,
    roles: ['Therapist', 'Admin']
  },
  {
    title: 'Reception',
    href: '/reception',
    icon: Building,
    roles: ['Reception', 'Admin']
  },
  {
    title: 'Content',
    href: '/content',
    icon: Palette,
    roles: ['Content Manager', 'Admin'],
    permission: { group: 'content_management', action: 'read' }
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['Marketing', 'Admin'],
    permission: { group: 'analytics', action: 'read' }
  },
  {
    title: 'Finance',
    href: '/finance',
    icon: DollarSign,
    roles: ['Accountant', 'Admin'],
    permission: { group: 'financial_management', action: 'read' }
  },
  {
    title: 'Products',
    href: '/products',
    icon: Package,
    roles: ['Admin'],
    permission: { group: 'product_management', action: 'read' }
  },
  {
    title: 'Subscriptions',
    href: '/subscriptions',
    icon: CreditCard,
    roles: ['Patient', 'VIP Patient', 'Admin']
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  }
];

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const isVisible = (item: NavigationItem): boolean => {
    if (!user) return false;

    // Check role-based access
    if (item.roles && !item.roles.includes(user.role as SystemRole)) {
      return false;
    }

    // Check permission-based access
    if (item.permission && !hasPermission(user.role, item.permission.group as any, item.permission.action as any)) {
      return false;
    }

    return true;
  };

  const visibleItems = navigationItems.filter(isVisible);

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground squircle-interactive touch-target hover-enhanced focus-aa-compliant",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Role-specific sections */}
        {user && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">
              Your Role: {user.role}
            </h2>
            <div className="space-y-1">
              {user.role === 'VIP Patient' && (
                <div className="text-xs text-muted-foreground px-3 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-3 w-3 text-yellow-500" />
                    <span>VIP Benefits Active</span>
                  </div>
                  <ul className="space-y-1 text-xs">
                    <li>• Priority booking</li>
                    <li>• VIP-only content</li>
                    <li>• Direct messaging</li>
                  </ul>
                </div>
              )}
              
              {user.role === 'Therapist' && (
                <div className="text-xs text-muted-foreground px-3 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-3 w-3 text-blue-500" />
                    <span>Therapist Tools</span>
                  </div>
                  <ul className="space-y-1 text-xs">
                    <li>• Patient management</li>
                    <li>• Session notes</li>
                    <li>• Progress reports</li>
                  </ul>
                </div>
              )}
              
              {user.role === 'Admin' && (
                <div className="text-xs text-muted-foreground px-3 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-3 w-3 text-red-500" />
                    <span>Admin Access</span>
                  </div>
                  <ul className="space-y-1 text-xs">
                    <li>• Full system access</li>
                    <li>• User management</li>
                    <li>• System configuration</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const isVisible = (item: NavigationItem): boolean => {
    if (!user) return false;

    if (item.roles && !item.roles.includes(user.role as SystemRole)) {
      return false;
    }

    if (item.permission && !hasPermission(user.role, item.permission.group as any, item.permission.action as any)) {
      return false;
    }

    return true;
  };

  const visibleItems = navigationItems.filter(isVisible);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="fixed left-0 top-0 h-full w-80 bg-background shadow-lg" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <button 
              onClick={onClose}
              className="squircle-button touch-target hover-enhanced focus-aa-compliant p-2"
              aria-label="Close navigation"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground squircle-interactive touch-target hover-enhanced focus-aa-compliant",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}