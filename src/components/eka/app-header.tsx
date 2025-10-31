'use client';

import { Search, Menu, Bell, CalendarPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
import { NotificationCenter } from './notification-center';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';
import { useAuth } from '@/context/auth-context';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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
      className="flex h-16 items-center justify-between px-4 md:px-6 sticky top-0 z-30 bg-transparent"
    >
      {/* Left: Sidebar Toggle & Search on Mobile */}
      <div className="flex items-center gap-2">
        <div className="md:hidden">
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
        <div className="hidden md:flex">
          <SidebarTrigger />
        </div>
        <div className="relative md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 bg-gray-100/80 dark:bg-gray-800/80 border-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-800 rounded-full"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {isClient && (
          <Button
            onClick={() => router.push('/sessions/booking')}
            className="hidden sm:flex gap-2 rounded-full px-4 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>New Session</span>
          </Button>
        )}
        <NotificationCenter />
        <UserNav />
      </div>
    </motion.header>
  );
}
