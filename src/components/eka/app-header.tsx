'use client';

import Link from 'next/link';
import {
  Bell,
  Home,
  LineChart,
  Package2,
  Search,
  Users,
  Heart,
  CalendarDays,
  MessageSquare,
  Settings,
  Menu,
  Briefcase,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserNav } from './user-nav';
import { SidebarTrigger } from '../ui/sidebar';

export function AppHeader() {
  const navLinks = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/sessions', icon: CalendarDays, label: 'Sessions' },
    { href: '/donations', icon: Heart, label: 'Donations' },
    { href: '/reports', icon: MessageSquare, label: 'Reports & Messages' },
    { href: '/therapist/dashboard', icon: Briefcase, label: "Therapist"},
    { href: '/account', icon: Settings, label: 'Account' },
  ];

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-transparent px-4 lg:h-[64px] lg:px-6 sticky top-0 z-30 glass">
       <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search EKA..."
              className="w-full appearance-none bg-background/80 pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
       <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
      <UserNav />
    </header>
  );
}
