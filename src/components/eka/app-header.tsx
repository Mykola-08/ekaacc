'use client';

import { Search, Menu, Plus, UserPlus, CalendarPlus, FileClock, BookPlus, SmilePlus, AreaChart, ShieldCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
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
  const [persona, setPersona] = useState<string | null>(null);

  useEffect(() => {
    const p = localStorage.getItem('eka_persona');
    setPersona(p);
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      setPersona(detail);
    };
    window.addEventListener('eka_persona_change', handler as EventListener);
    return () => window.removeEventListener('eka_persona_change', handler as EventListener);
  }, []);

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

  const effectiveRole = persona || currentUser?.role;
  const isAdminRole = effectiveRole === 'Admin';
  const isTherapistRole = effectiveRole === 'Therapist';
  const isClientRole = !isAdminRole && !isTherapistRole;

  const QuickActions = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Plus className="h-5 w-5" />
          <span className="sr-only">Quick Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isTherapistRole && (
            <>
              <DropdownMenuItem onSelect={() => router.push('/therapist/clients')}>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>New Client</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push('/therapist/bookings')}>
                <CalendarPlus className="mr-2 h-4 w-4" />
                <span>Schedule Appointment</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileClock className="mr-2 h-4 w-4" />
                <span>Review Reports</span>
              </DropdownMenuItem>
            </>
          )}
          {isClientRole && (
            <>
              <DropdownMenuItem onSelect={() => router.push('/journal')}>
                <BookPlus className="mr-2 h-4 w-4" />
                <span>New Journal Entry</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SmilePlus className="mr-2 h-4 w-4" />
                <span>Log Mood</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push('/sessions/booking')}>
                <CalendarPlus className="mr-2 h-4 w-4" />
                <span>Book a Session</span>
              </DropdownMenuItem>
            </>
          )}
          {isAdminRole && (
            <>
              <DropdownMenuItem onSelect={() => router.push('/admin/users')}>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Create User</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AreaChart className="mr-2 h-4 w-4" />
                <span>Generate Report</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>View Audit Logs</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
          "flex h-[var(--header-h)] items-center px-4 md:px-6 sticky top-0 w-full z-50 transition-all duration-300 ease-in-out glass border-b bg-background/90 backdrop-blur"
        )}
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
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

        {/* Right aligned group: Quick actions and notifications on the left, profile dropdown pinned to the far right */}
        <div className="ml-auto flex items-center gap-1 md:gap-3 w-full">
          <div className="flex items-center gap-2">
            <QuickActions />
            <NotificationCenter />
          </div>
          {/* Push profile to the maximum right edge */}
          <div className="ml-auto">
            <UserNav />
          </div>
        </div>
      </motion.header>
    </>
  );
}
