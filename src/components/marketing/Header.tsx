'use client';

import * as React from 'react';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Notification01Icon,
  UserCircle02Icon,
  Login01Icon,
  DashboardSquare01Icon,
} from '@hugeicons/core-free-icons';

const IconSearch = (props: any) => <HugeiconsIcon icon={Search01Icon} {...props} />;
const IconBell = (props: any) => <HugeiconsIcon icon={Notification01Icon} {...props} />;
const IconUserCircle = (props: any) => <HugeiconsIcon icon={UserCircle02Icon} {...props} />;
const IconLogin = (props: any) => <HugeiconsIcon icon={Login01Icon} {...props} />;
const IconDashboard = (props: any) => <HugeiconsIcon icon={DashboardSquare01Icon} {...props} />;

export function Header() {
  // Use a simple client-side check for auth state via cookie or context if available,
  // but for marketing header, static "Login" is often enough, or "Dashboard" if we assume session.
  // We can check if a cookie exists roughly or just provide both/one.
  // For now, let's just provide a Login button that goes to /login.

  return (
    <header className="app-shell-header">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-primary -ml-1 transition-colors" />
        <Separator orientation="vertical" className="h-4" />
        <Link
          href="/"
          className="text-foreground/80 hover:text-primary text-sm font-semibold tracking-tight transition-colors"
        >
          EKA Balance
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary hidden sm:inline-flex"
        >
          <Link href="/login">Login</Link>
        </Button>

        <Button asChild variant="default" size="sm" className="rounded-full px-4 shadow-sm">
          <Link href="/book" className="flex items-center gap-2">
            <span>Book</span>
            <IconLogin size={16} />
          </Link>
        </Button>
      </div>
    </header>
  );
}
