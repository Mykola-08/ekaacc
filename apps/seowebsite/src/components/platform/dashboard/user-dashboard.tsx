'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/platform/auth-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { 
  Calendar, 
  Wallet, 
  Target, 
  ArrowRight, 
  Plus, 
  Activity,
  Clock
} from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export function UserDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Mock Data - To be replaced with real data fetching
  const nextSession = null; // { date: '2024-02-15T10:00:00', therapist: 'Dr. Smith', type: 'Therapy Session' }
  const walletBalance = 0;
  const activeGoals = 0;

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
            {t('dashboard.user.welcomeBack', 'Welcome back')}, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Member'}
          </h1>
          <p className='text-slate-500 mt-1'>
            {t('dashboard.user.welcomeSub', 'Track your wellness journey and manage your sessions.')}
          </p>
        </div>
        <Button asChild className='bg-blue-600 hover:bg-blue-700 text-white'>
          <Link href='/booking'>
            <Plus className='mr-2 h-4 w-4' />
            {t('dashboard.user.bookSession', 'Book New Session')}
          </Link>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className='grid gap-4 md:grid-cols-3'>
        {/* Wallet Card */}
        <Card className='border-slate-200 shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              {t('dashboard.user.walletBalance', 'Wallet Balance')}
            </CardTitle>
            <Wallet className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>€{walletBalance.toFixed(2)}</div>
            <p className='text-xs text-slate-500 mt-1'>
              {t('dashboard.user.availableCredits', 'Available for future sessions')}
            </p>
            <div className='mt-4'>
               <Button variant='outline' size='sm' asChild className='w-full text-blue-600 border-blue-200 hover:bg-blue-50'>
                  <Link href='/subscriptions'>
                    {t('dashboard.user.addFunds', 'Add Funds')}
                  </Link>
               </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Session Card */}
        <Card className='border-slate-200 shadow-sm relative overflow-hidden'>
           {nextSession && <div className='absolute top-0 left-0 w-1 h-full bg-blue-600'></div>}
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              {t('dashboard.user.nextSession', 'Next Session')}
            </CardTitle>
            <Calendar className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            {nextSession ? (
               <div className='space-y-1'>
                 <div className='text-2xl font-bold text-slate-900'>Feb 15, 10:00 AM</div>
                 <p className='text-sm text-slate-500'>Dr. Smith  Therapy Session</p>
               </div>
            ) : (
               <div className='space-y-1'>
                 <div className='text-lg font-medium text-slate-900'>{t('dashboard.user.notScheduled', 'No upcoming sessions')}</div>
                 <p className='text-xs text-slate-500'>{t('dashboard.user.bookNextVisit', 'Schedule your next visit now')}</p>
               </div>
            )}
            
            <div className='mt-4'>
               <Button variant='ghost' size='sm' asChild className='w-full justify-start px-0 text-blue-600 hover:text-blue-700 hover:bg-transparent p-0 h-auto'>
                  <Link href='/sessions' className='flex items-center gap-1'>
                    {t('dashboard.user.viewAllSessions', 'View Schedule')} <ArrowRight className='h-3 w-3' />
                  </Link>
               </Button>
            </div>
          </CardContent>
        </Card>

        {/* Goals Card */}
        <Card className='border-slate-200 shadow-sm'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              {t('dashboard.user.activeGoals', 'Active Goals')}
            </CardTitle>
            <Target className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>{activeGoals}</div>
            <p className='text-xs text-slate-500 mt-1'>
              {t('dashboard.user.wellnessObjectives', 'Objectives in progress')}
            </p>
             <div className='mt-4'>
               <Button variant='outline' size='sm' asChild className='w-full'>
                  <Link href='/progress'>
                    {t('dashboard.user.viewProgress', 'View Progress')}
                  </Link>
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Content Area */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-7'>
        
        {/* Recent Activity */}
        <Card className='md:col-span-4 border-slate-200 shadow-sm'>
          <CardHeader>
            <CardTitle>{t('dashboard.user.recentActivity', 'Recent Activity')}</CardTitle>
            <CardDescription>
              {t('dashboard.user.recentActivitySub', 'Your latest interactions and updates.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-8'>
               {/* Empty State */}
               <div className='flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200'>
                  <Activity className='h-8 w-8 text-slate-300 mb-2' />
                  <p className='text-sm text-slate-500'>{t('dashboard.user.noActivity', 'No recent activity recorded.')}</p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Tips */}
        <Card className='md:col-span-3 border-slate-200 shadow-sm bg-slate-50/50'>
          <CardHeader>
            <CardTitle>{t('dashboard.user.gettingStarted', 'Getting Started')}</CardTitle>
            <CardDescription>
              {t('dashboard.user.gettingStartedSub', 'Complete these steps to get the most out of your experience.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm'>
                <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                  <span className='text-blue-700 font-semibold text-xs'>1</span>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium leading-none'>{t('dashboard.user.completeProfile', 'Complete your profile')}</p>
                  <p className='text-xs text-slate-500'>{t('dashboard.user.completeProfileSub', 'Add your details and preferences')}</p>
                </div>
              </div>
              
               <div className='flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm'>
                <div className='h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0'>
                   <Clock className='h-4 w-4 text-slate-500' />
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium leading-none text-slate-500'>{t('dashboard.user.firstSession', 'Book your first session')}</p>
                  <p className='text-xs text-slate-400'>{t('dashboard.user.firstSessionSub', 'Find a therapist that matches your needs')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

