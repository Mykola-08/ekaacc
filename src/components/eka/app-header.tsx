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
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const isClient = currentUser?.role === 'Patient';

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="apple-header flex items-center justify-between px-8 sticky top-0 z-30"
    >
      {/* Left: Brand & Search */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <div className="md:hidden">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg hover:bg-muted/50"
            onClick={() => setOpenMobile(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="hidden md:flex">
          <SidebarTrigger className="rounded-lg" />
        </div>
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search everything..."
            className="pl-12 pr-4 py-2.5 bg-muted/30 border-0 rounded-xl focus:ring-1 focus:ring-primary/20 focus:bg-background/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {isClient && (
          <Button
            onClick={() => router.push('/sessions/booking')}
            variant="default"
            size="sm"
            className="hidden sm:flex items-center gap-2 rounded-xl px-4"
          >
            <CalendarPlus className="h-4 w-4" />
            <span className="font-medium">New Session</span>
          </Button>
        )}
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <UserNav />
        </div>
      </div>
    </motion.header>
  );
}
