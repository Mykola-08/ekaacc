'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  AlertTriangle,
  Package,
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Overview',
    href: '/console',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/console/users',
    icon: Users,
  },
  {
    title: 'Services',
    href: '/console/services',
    icon: Package,
  },
  {
    title: 'Payments',
    href: '/console/payments',
    icon: CreditCard,
  },
  {
    title: 'Community',
    href: '/console/community',
    icon: MessageSquare,
  },
  {
    title: 'Error Logs',
    href: '/console/errors',
    icon: AlertTriangle,
  },
  {
    title: 'Settings',
    href: '/console/settings',
    icon: Settings,
  },
];

export function AdminSidebarContent({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col py-4">
      <div className="px-6 pt-2 pb-6">
        <h2 className="text-foreground px-2 text-xl font-semibold tracking-tight">EKA STUDIO</h2>
      </div>
      <div className="scrollbar-none flex-1 space-y-1 overflow-x-hidden overflow-y-auto px-4">
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/console' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClick}
              prefetch={true}
              className={cn(
                'flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground bg-transparent'
              )}
            >
              <item.icon
                className={cn(
                  'h-[18px] w-[18px] stroke-[2.5px]',
                  isActive ? 'text-primary-foreground' : 'text-current'
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </div>
      <div className="border-border/50 mt-auto border-t px-6 pt-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
            AD
          </div>
          <div className="min-w-0">
            <p className="text-foreground truncate text-sm font-medium">Admin User</p>
            <p className="text-muted-foreground truncate text-xs">admin@eka.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'bg-card border-border hidden w-70 shrink-0 flex-col overflow-hidden rounded-lg border md:flex',
        className
      )}
    >
      <AdminSidebarContent />
    </aside>
  );
}
