'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UserNav } from './user-nav';
import { NotificationCenter } from './notification-center';
import { useAuth } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  const { setOpenMobile } = useSidebar();
  const { user: currentUser } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="mx-auto flex h-14 items-center justify-between px-4 max-w-7xl">
        {/* Left: Menu + Brand */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setOpenMobile(true)}>
              <span className="sr-only">Open menu</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </Button>
          </div>
          <div className="hidden md:flex">
            <SidebarTrigger />
          </div>
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent">
            <Image src="/eka_logo.png" alt="EKA" width={28} height={28} className="rounded" />
            <span className="font-semibold tracking-tight">EKA</span>
          </button>
        </div>

        {/* Center: Search (desktop) */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9" />
          </div>
        </div>

        {/* Right: Auth / User */}
        <div className="flex items-center gap-2">
          {!currentUser ? (
            <>
              <Button variant="ghost" onClick={() => router.push('/login')}>Sign In</Button>
              <Button onClick={() => router.push('/onboarding')}>Get Started</Button>
            </>
          ) : (
            <>
              <NotificationCenter />
              <UserNav />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
