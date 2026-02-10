'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  Menu,
  Home,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Target,
  Settings,
  LogOut,
  BarChart3,
  CreditCard,
  Bell,
  User,
  Heart,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

const navigationItems = [
  {
    name: 'Home',
    href: '/home',
    icon: Home,
    roles: ['user', 'patient', 'therapist', 'admin'],
  },
  {
    name: 'Sessions',
    href: '/sessions',
    icon: Calendar,
    roles: ['user', 'patient', 'therapist'],
  },
  {
    name: 'Clients',
    href: '/therapist/clients',
    icon: Users,
    roles: ['therapist'],
  },
  {
    name: 'Progress',
    href: '/progress',
    icon: Target,
    roles: ['user', 'patient', 'therapist'],
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    roles: ['user', 'patient', 'therapist'],
  },
  {
    name: 'Finances',
    href: '/finances?tab=billing',
    icon: CreditCard,
    roles: ['user', 'patient', 'therapist'],
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    roles: ['user', 'patient', 'therapist'],
  },
  {
    name: 'Profile',
    href: '/myaccount',
    icon: User,
    roles: ['user', 'patient', 'therapist', 'admin'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['user', 'patient', 'therapist', 'admin'],
  },
];

interface MobileNavigationProps {
  className?: string;
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useSimpleAuth();

  const userRole = user?.role?.name || 'user';

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <div className={cn('md:hidden', className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Heart className="text-primary-foreground h-4 w-4" />
              </div>
              EKA Wellness
            </SheetTitle>
          </SheetHeader>

          <div className="flex h-full flex-col py-4">
            {/* User Info */}
            {user && (
              <div className="bg-muted mb-4 flex items-center gap-3 rounded-lg p-4">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <User className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{user.profile?.full_name || user.email}</p>
                  <p className="text-muted-foreground text-sm capitalize">{user.role?.name}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="mt-4 border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
