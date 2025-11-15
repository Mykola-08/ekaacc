'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, Bell, CalendarPlus } from 'lucide-react';
import { UserNav } from './user-nav';
import { NotificationCenter } from './notification-center';
import React from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { appUser: currentUser } = useAuth();
  const router = useRouter();

  const isClient = currentUser?.role === 'Patient';

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="flex h-16 items-center justify-between px-4 md:px-6 sticky top-0 z-30 glass-effect border-b"
    >
      {/* Left: Sidebar Toggle & Search */}
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg hover-lift"
            onClick={() => setOpenMobile(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="hidden md:flex">
          <SidebarTrigger className="rounded-lg" />
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anything..."
            className="pl-10 bg-background/50 border-border/50 rounded-lg focus:ring-2 focus:ring-primary/50 focus:bg-background"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {isClient && (
          <Button
            onClick={() => router.push('/sessions/booking')}
            className="hidden sm:flex gap-2 rounded-lg px-4 hover-lift bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg"
            size="sm"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>New Session</span>
          </Button>
        )}
        <div className="flex items-center gap-1">
          <NotificationCenter />
          <UserNav />
        </div>
      </div>
    </motion.header>
  );
}
