
'use client';

import { Search, Menu, FileText, Calendar, ClipboardCheck } from 'lucide-react';
// ...existing code...
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
import { ThemeToggle } from './theme-toggle';
import { NotificationCenter } from './notification-center';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useData } from '@/context/unified-data-context';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WelcomePersonalizationForm, DailyMoodLogForm, SessionAssessmentForm } from '@/components/eka/forms';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { currentUser, sessions } = useData();
  const router = useRouter();
  const [showWelcomeForm, setShowWelcomeForm] = useState(false);
  const [showDailyForm, setShowDailyForm] = useState(false);
  const [showPreSessionForm, setShowPreSessionForm] = useState(false);
  const [persona, setPersona] = useState<string>('Patient');

  // Check if forms are completed (assume personalizationCompleted and a dailyLogCompleted flag)
  const needsPersonalization = currentUser && !currentUser.personalizationCompleted;
  // For demo: check if user has a property 'dailyLogCompleted' (customize as needed)
  const needsDailyLog = currentUser && !(currentUser as any).dailyLogCompleted;

  // Therapist-specific checks
  const isTherapist = currentUser?.role === 'Therapist';
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  });
  const hasUpcomingSessionToday = todaySessions.length > 0;
  const pendingReports = 3; // This would come from the database in a real implementation

  return (
    <>
      <WelcomePersonalizationForm
        open={showWelcomeForm}
        onClose={() => setShowWelcomeForm(false)}
        onSubmit={() => setShowWelcomeForm(false)}
      />
      <DailyMoodLogForm
        open={showDailyForm}
        onClose={() => setShowDailyForm(false)}
        onSubmit={() => setShowDailyForm(false)}
      />
      {isTherapist && (
        <SessionAssessmentForm
          open={showPreSessionForm}
          onClose={() => setShowPreSessionForm(false)}
          onSubmit={() => setShowPreSessionForm(false)}
          patientName="Client"
          sessionType="pre"
        />
      )}
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "flex h-[var(--header-h)] items-center px-4 md:px-6 fixed left-0 w-full z-50 transition-all duration-300 ease-in-out glass border-b bg-background/90 backdrop-blur",
          "top-0"
        )}
      >
        {/* Left: collapse trigger (desktop) and mobile trigger */}
        <div className="flex items-center">
          {/* Desktop: left-aligned collapse button */}
          <div className="hidden md:flex mr-3">
            <SidebarTrigger />
          </div>
          {/* Mobile: keep sidebar trigger visible on small screens */}
          <div className="flex md:hidden">
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setOpenMobile(true)}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Sidebar</span>
              </Button>
            ) : (
              <SidebarTrigger />
            )}
          </div>
        </div>

        {/* Centered group: search (desktop) */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-3">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search EKA..."
                className="w-80 appearance-none bg-background/50 pl-8 shadow-none"
              />
            </div>
          </form>
        </div>

        {/* Right aligned group: Profile / Theme / Notifications */}
        <div className="ml-auto flex items-center gap-3">
          <UserNav />
          <ThemeToggle />
          <NotificationCenter />
        </div>
      </motion.header>
    </>
  );
}
