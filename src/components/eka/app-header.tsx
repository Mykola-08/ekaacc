
'use client';

import { Search, Menu, FileText, Calendar, ClipboardCheck } from 'lucide-react';
// ...existing code...
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
import { ThemeToggle } from './theme-toggle';
import { NotificationCenter } from './notification-center';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import React, { useState } from 'react';
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
          "flex h-[var(--header-h)] items-center gap-4 px-4 md:px-6 fixed left-0 w-full z-50 transition-all duration-300 ease-in-out glass border-b bg-background/90 backdrop-blur",
          "top-0"
        )}
      >
        {/* Attention CTAs as subtle accent pills to the right of NotificationCenter */}
        <NotificationCenter />
        {(needsPersonalization || needsDailyLog || (isTherapist && (hasUpcomingSessionToday || pendingReports > 0))) && (
          <div className="flex gap-2 items-center ml-2">
            {needsPersonalization && (
              <button
                onClick={() => setShowWelcomeForm(true)}
                className="rounded-full px-4 py-1.5 font-medium text-primary bg-primary/10 border border-primary/20 shadow-sm hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                style={{ minWidth: 200 }}
              >
                <span className="mr-2">🎁</span> Complete Welcome Personalization
              </button>
            )}
            {needsDailyLog && (
              <button
                onClick={() => setShowDailyForm(true)}
                className="rounded-full px-4 py-1.5 font-medium text-yellow-700 bg-yellow-100 border border-yellow-200 shadow-sm hover:bg-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
                style={{ minWidth: 160 }}
              >
                <span className="mr-2">📝</span> Log Daily Mood
              </button>
            )}
            {isTherapist && hasUpcomingSessionToday && (
              <button
                onClick={() => setShowPreSessionForm(true)}
                className="rounded-full px-4 py-1.5 font-medium text-blue-700 bg-blue-100 border border-blue-200 shadow-sm hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ minWidth: 200 }}
              >
                <ClipboardCheck className="mr-2 h-4 w-4 inline" />
                Complete Pre-Session Form
              </button>
            )}
            {isTherapist && pendingReports > 0 && (
              <button
                onClick={() => router.push('/therapist/dashboard')}
                className="rounded-full px-4 py-1.5 font-medium text-orange-700 bg-orange-100 border border-orange-200 shadow-sm hover:bg-orange-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300"
                style={{ minWidth: 180 }}
              >
                <FileText className="mr-2 h-4 w-4 inline" />
                {pendingReports} Reports Pending
              </button>
            )}
          </div>
        )}
        <div className="flex items-center">
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
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search EKA..."
                className="w-full appearance-none bg-background/50 pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
  <ThemeToggle />
  <UserNav />
      </motion.header>
    </>
  );
}
