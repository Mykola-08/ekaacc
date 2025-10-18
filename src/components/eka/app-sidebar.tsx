'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Home,
  Package2,
  Users,
  Heart,
  CalendarDays,
  MessageSquare,
  Settings,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { currentUser } from '@/lib/data';

export function AppSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/sessions', icon: CalendarDays, label: 'Sessions' },
    { href: '/donations', icon: Heart, label: 'Donations' },
    { href: '/reports', icon: MessageSquare, label: 'Reports & Messages' },
  ];

  const bottomLinks = [
    { href: '/account', icon: Settings, label: 'Account' },
  ]

  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-4 lg:h-[64px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6 text-primary" />
            <span className="">EKA Account</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                  pathname === href && 'bg-muted text-primary'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mb-4">
            {bottomLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                    pathname === href && 'bg-muted text-primary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
          </nav>
            <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">{currentUser.initials}</span>
                </span>
                <div>
                    <p className="text-sm font-semibold">{currentUser.name}</p>
                    <Badge variant="secondary" className="text-xs">{currentUser.role}</Badge>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
