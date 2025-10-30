'use client';

import { Search, Menu, Bell, CalendarPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
import { NotificationCenter } from './notification-center';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';
import { useData } from '@/context/unified-data-context';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { currentUser } = useData();
  const router = useRouter();

  const isClient = currentUser?.role === 'Patient';

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-16 items-center justify-between px-4 md:px-6 fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b"
    >
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex">
          <SidebarTrigger />
        </div>
        <div className="flex md:hidden">
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setOpenMobile(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          ) : (
            <SidebarTrigger />
          )}
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search EKA..."
            className="pl-10 bg-background/50 border-muted"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Book Session CTA - Only for clients */}
        {isClient && (
          <Button
            onClick={() => router.push('/sessions/booking')}
            className="hidden md:flex gap-2 rounded-full px-5 shadow-sm"
            size="sm"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>Book Session</span>
          </Button>
        )}

        {/* Notifications */}
        <NotificationCenter />

        {/* User Menu */}
        <UserNav />
      </div>
    </motion.header>
  );
}
