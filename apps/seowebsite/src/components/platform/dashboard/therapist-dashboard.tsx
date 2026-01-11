'use client';

import React from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
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

export function TherapistDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Mock Data
  const stats = [
    { 
      label: t('dashboard.therapist.totalPatients', 'Active Patients'), 
      value: '0', 
      icon: Users, 
      desc: t('dashboard.therapist.activePatients', 'Currently under your care'),
      color: 'text-blue-600'
    },
    { 
      label: t('dashboard.therapist.todaysSessions', 'Sessions Today'), 
      value: '0', 
      icon: Calendar, 
      desc: t('dashboard.therapist.scheduledToday', 'Scheduled appointments'),
      color: 'text-blue-600'
    },
    { 
      label: t('dashboard.therapist.pendingReviews', 'Pending Reports'), 
      value: '0', 
      icon: FileText, 
      desc: t('dashboard.therapist.notesToComplete', 'Session notes required'),
      color: 'text-amber-600' 
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900'>{t('dashboard.therapist.title', 'Therapist Dashboard')}</h1>
          <p className='text-slate-500 mt-1'>
            {t('dashboard.therapist.welcome', 'Welcome back')}, Dr. {user?.user_metadata?.name || user?.email?.split('@')[0]}
          </p>
        </div>
        <div className='flex gap-2'>
           <Button variant='outline' asChild className='border-slate-200 text-slate-700 hover:bg-slate-50'>
            <Link href='#'>Manage Availability</Link>
          </Button>
          <Button asChild className='bg-blue-600 hover:bg-blue-700 text-white'>
            <Link href='#'>View Calendar</Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className='grid gap-4 md:grid-cols-3'>
        {stats.map((stat, i) => (
          <Card key={i} className='border-slate-200 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-slate-600'>
                {stat.label}
              </CardTitle>
              <stat.icon className={h-4 w-4 } />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-slate-900'>{stat.value}</div>
              <p className='text-xs text-slate-500 mt-1'>
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid gap-6 md:grid-cols-12'>
        {/* Main Content: Schedule */}
        <div className='md:col-span-8 space-y-6'>
          <Card className='border-slate-200 shadow-sm h-full'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div className='space-y-1'>
                <CardTitle className='text-xl text-slate-900'>{t('dashboard.therapist.todaysSchedule', 'Today\'s Schedule')}</CardTitle>
                <CardDescription>
                   {t('dashboard.therapist.scheduleSub', 'Manage your appointments for the day')}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mock Empty State */}
              <div className='flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200'>
                <div className='bg-white p-4 rounded-full shadow-sm mb-4'>
                   <Calendar className='h-8 w-8 text-slate-400' />
                </div>
                <h3 className='text-lg font-medium text-slate-900'>{t('dashboard.therapist.noAppointments', 'No appointments today')}</h3>
                <p className='text-sm text-slate-500 max-w-sm mt-2'>{t('dashboard.therapist.freeDay', 'You have no sessions scheduled for today. Take this time to review patient notes or update your availability.')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Action Items */}
        <div className='md:col-span-4 space-y-6'>
          <Card className='border-slate-200 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg text-slate-900'>{t('dashboard.therapist.pendingTasks', 'Action Required')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
               <div className='flex items-start gap-4 p-3 bg-amber-50 rounded-lg border border-amber-100'>
                 <div className='mt-0.5'>
                    <AlertCircle className='h-5 w-5 text-amber-600' />
                 </div>
                 <div className='space-y-1'>
                   <p className='text-sm font-medium text-amber-900'>Complete Profile Assessment</p>
                   <p className='text-xs text-amber-700'>Update your specialization details to match better with patients.</p>
                   <Button variant='link' className='h-auto p-0 text-amber-800 text-xs font-semibold'>Complete Now &rarr;</Button>
                 </div>
               </div>

               <div className='flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm'>
                  <div className='flex items-center gap-3'>
                    <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center'>
                      <FileText className='h-4 w-4 text-blue-600' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-slate-900'>Weekly Report</p>
                      <p className='text-xs text-slate-500'>Due tomorrow</p>
                    </div>
                  </div>
                  <Button variant='ghost' size='icon' className='h-8 w-8'>
                    <ArrowRight className='h-4 w-4 text-slate-400' />
                  </Button>
               </div>
            </CardContent>
            <CardFooter className='border-t border-slate-100 pt-4'>
               <Button variant='ghost' size='sm' className='w-full text-slate-500 hover:text-slate-900'>View all tasks</Button>
            </CardFooter>
          </Card>
          
          <Card className='border-slate-200 shadow-sm'>
             <CardHeader>
                <CardTitle className='text-lg text-slate-900'>Recent Interactions</CardTitle>
             </CardHeader>
             <CardContent>
                <div className='text-sm text-slate-500 text-center py-4 italic'>
                   No recent interactions found.
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

