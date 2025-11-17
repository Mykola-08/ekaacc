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
      className="flex items-center justify-between px-8 sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border"
    >
      {/* Left: Brand & Search */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <div className="md:hidden">
          <Button
            variant="outline"
            size="icon"
            className="squircle-button hover-enhanced"
            onClick={() => setOpenMobile(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="hidden md:flex">
          <SidebarTrigger className="squircle-button hover-enhanced" />
        </div>
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search everything..."
            className="squircle-input pl-12 pr-4 bg-muted/30 border-0 focus:ring-1 focus:ring-primary/20 focus:bg-background/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right: Actions & Navigation */}
      <div className="flex items-center gap-3">
        {/* Navigation Buttons */}
        <nav className="hidden md:flex items-center gap-2">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="ghost"
            className="nav-button-secondary"
          >
            Dashboard
          </Button>
          <Button
            onClick={() => router.push('/goals')}
            variant="ghost"
            className="nav-button-secondary"
          >
            Goals
          </Button>
          <Button
            onClick={() => router.push('/journal')}
            variant="ghost"
            className="nav-button-secondary"
          >
            Journal
          </Button>
        </nav>

        {isClient && (
          <Button
            onClick={() => router.push('/sessions/booking')}
            variant="default"
            className="nav-button-primary hidden sm:flex items-center gap-2"
          >
            <CalendarPlus className="h-4 w-4" />
            <span className="font-medium">New Session</span>
          </Button>
        )}
        
        {/* Authentication & User Actions */}
        <div className="flex items-center gap-2">
          {!currentUser ? (
            <>
              <Button
                onClick={() => router.push('/login')}
                variant="ghost"
                className="auth-button-secondary"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push('/onboarding')}
                variant="default"
                className="auth-button-primary"
              >
                Get Started
              </Button>
            </>
          ) : (
            <>
              <NotificationCenter />
              <UserNav />
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
