
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package2,
  Users,
  Heart,
  CalendarDays,
  FileText,
  Settings,
  Briefcase,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { useUserContext } from '@/context/user-context';
import { SidebarContent, SidebarHeader } from '../ui/sidebar';
import { useUser } from '@/firebase';

export function AppSidebar() {
  const pathname = usePathname();
  const { user: firebaseUser } = useUser();
  const { currentUser } = useUserContext();


  const userLinks = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/sessions', icon: CalendarDays, label: 'Sessions' },
    { href: '/therapies', icon: Sparkles, label: 'Therapies'},
    { href: '/donations', icon: Heart, label: 'Donations' },
    { href: '/reports', icon: FileText, label: 'Reports' },
  ];

  const therapistLinks = [
    { href: '/therapist/dashboard', icon: Briefcase, label: "Therapist Dashboard"}
  ]

  const bottomLinks = [
    { href: '/account', icon: Settings, label: 'Account' },
  ]

  if (!currentUser) return null;

  const showTherapistLinks = currentUser.role === 'Therapist' || currentUser.role === 'Admin';
  const showUserLinks = currentUser.role !== 'Therapist';


  return (
    <>
      <SidebarHeader className="flex h-16 items-center border-b px-4 lg:h-[64px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6 text-primary" />
          <span className="group-data-[state=collapsed]:hidden">EKA Account</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-auto py-2">
        {showUserLinks && (
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground group-data-[state=collapsed]:hidden">CLIENT</p>
            {userLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                  pathname.startsWith(href) && 'bg-muted text-primary'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="group-data-[state=collapsed]:hidden">{label}</span>
              </Link>
            ))}
          </nav>
        )}
        {showUserLinks && showTherapistLinks && <Separator className="my-2" />}
        {showTherapistLinks && (
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground group-data-[state=collapsed]:hidden">THERAPIST</p>
          {therapistLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                pathname.startsWith(href) && 'bg-muted text-primary'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="group-data-[state=collapsed]:hidden">{label}</span>
            </Link>
          ))}
        </nav>
        )}
      </SidebarContent>
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
                <span className="group-data-[state=collapsed]:hidden">{label}</span>
              </Link>
            ))}
        </nav>
          <div className="flex items-center gap-3 group-data-[state=collapsed]:justify-center">
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">{currentUser.initials}</span>
              </span>
              <div className="group-data-[state=collapsed]:hidden">
                  <p className="text-sm font-semibold">{currentUser.name}</p>
                  <Badge variant="secondary" className="text-xs">{currentUser.role}</Badge>
              </div>
          </div>
      </div>
    </>
  );
}
