'use client';

import React from 'react';
import { useAuth } from '@/contexts/platform/auth-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { 
  Users, 
  Calendar, 
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/platform/utils/css-utils';

export function TherapistDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Mock Data
  const stats = [
    { 
      label: t('dashboard.therapist.totalPatients') || 'Active Patients', 
      value: '0', 
      icon: Users, 
      desc: t('dashboard.therapist.activePatients') || 'Currently under your care',
      color: 'text-blue-600'
    },
    { 
      label: t('dashboard.therapist.todaysSessions') || 'Sessions Today', 
      value: '0', 
      icon: Calendar, 
      desc: t('dashboard.therapist.scheduledToday') || 'Scheduled appointments',
      color: 'text-blue-600'
    },
    { 
      label: t('dashboard.therapist.pendingReviews') || 'Pending Reports', 
      value: '0', 
      icon: FileText, 
      desc: t('dashboard.therapist.notesToComplete') || 'Session notes required',
      color: 'text-amber-600' 
    },
  ];

  return (
    <div className='space-y-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>{t('dashboard.therapist.title') || 'Therapist Dashboard'}</h1>
          <p className='text-muted-foreground mt-1'>
            {t('dashboard.therapist.welcome') || 'Welcome back'}, Dr. {user?.user_metadata?.name || user?.email?.split('@')[0]}
          </p>
        </div>
        <div className='flex gap-2'>
           <Button variant='outline' asChild>
            <Link href='/availability'>Manage Availability</Link>
          </Button>
          <Button asChild>
            <Link href='/calendar'>View Calendar</Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className='grid gap-4 md:grid-cols-3'>
        {stats.map((stat, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <Card className='shadow-sm hover:shadow-md transition-shadow'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                    {stat.label}
                </CardTitle>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
                </CardHeader>
                <CardContent>
                <div className='text-2xl font-bold text-foreground'>{stat.value}</div>
                <p className='text-xs text-muted-foreground mt-1'>
                    {stat.desc}
                </p>
                </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className='grid gap-6 md:grid-cols-12'>
        {/* Main Content: Schedule */}
        <div className='md:col-span-8 space-y-6 animate-fade-in' style={{ animationDelay: '200ms' }}>
          <Card className='shadow-sm h-full'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div className='space-y-1'>
                <CardTitle className='text-xl text-foreground'>{t('dashboard.therapist.todaysSchedule') || "Today's Schedule"}</CardTitle>
                <CardDescription>
                   {t('dashboard.therapist.scheduleSub') || 'Manage your appointments for the day'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mock Empty State */}
              <div className='flex flex-col items-center justify-center py-16 text-center bg-muted/20 rounded-lg border border-dashed'>
                <div className='bg-background p-4 rounded-full shadow-sm mb-4'>
                   <Calendar className='h-8 w-8 text-muted-foreground' />
                </div>
                <h3 className='text-lg font-medium text-foreground'>{t('dashboard.therapist.noAppointments') || 'No appointments today'}</h3>
                <p className='text-sm text-muted-foreground max-w-sm mt-2'>{t('dashboard.therapist.freeDay') || 'You have no sessions scheduled for today. Take this time to review patient notes or update your availability.'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Action Items */}
        <div className='md:col-span-4 space-y-6 animate-fade-in' style={{ animationDelay: '300ms' }}>
          <Card className='shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg text-foreground'>{t('dashboard.therapist.pendingTasks') || 'Action Required'}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
               <div className='flex items-start gap-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-900/50'>
                 <div className='mt-0.5'>
                    <AlertCircle className='h-5 w-5 text-amber-600 dark:text-amber-500' />
                 </div>
                 <div className='space-y-1'>
                   <p className='text-sm font-medium text-amber-900 dark:text-amber-400'>Complete Profile Assessment</p>
                   <p className='text-xs text-amber-700 dark:text-amber-500/80'>Update your specialization details to match better with patients.</p>
                   <Button variant='link' className='h-auto p-0 text-amber-800 dark:text-amber-400 text-xs font-semibold'>Complete Now &rarr;</Button>
                 </div>
               </div>

               <div className='flex items-center justify-between p-3 bg-card rounded-lg border shadow-sm'>
                  <div className='flex items-center gap-3'>
                    <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center'>
                      <FileText className='h-4 w-4 text-primary' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-foreground'>Weekly Report</p>
                      <p className='text-xs text-muted-foreground'>Due tomorrow</p>
                    </div>
                  </div>
                  <Button variant='ghost' size='icon' className='h-8 w-8'>
                    <ArrowRight className='h-4 w-4 text-muted-foreground' />
                  </Button>
               </div>
            </CardContent>
            <CardFooter className='border-t pt-4'>
               <Button variant='ghost' size='sm' className='w-full text-muted-foreground hover:text-foreground'>View all tasks</Button>
            </CardFooter>
          </Card>
          
          <Card className='shadow-sm'>
             <CardHeader>
                <CardTitle className='text-lg text-foreground'>Recent Interactions</CardTitle>
             </CardHeader>
             <CardContent>
                <div className='text-sm text-muted-foreground text-center py-4 italic'>
                   No recent interactions found.
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
