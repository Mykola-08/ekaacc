'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';
import { CalendarCheck, AlertCircle, Users, CreditCard, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TherapistDashboardProps {
  schedule: any[];
}

export function TherapistDashboard({ schedule }: TherapistDashboardProps) {
  const pendingVerifications = schedule.filter(s => s.is_identity_verified === false).length;

  return (
    <div className='w-full max-w-6xl mx-auto space-y-8 p-6'>
       <motion.header 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className='flex justify-between items-end mb-8 border-b border-slate-200/60 pb-6'
       >
        <div>
            <h1 className='text-4xl font-serif font-bold tracking-tight text-slate-900 mb-1'>
            Today's Overview
            </h1>
            <p className='text-slate-500 font-medium text-lg'>
            {format(new Date(), 'EEEE, MMMM d')}
            </p>
        </div>
        <div className='text-right'>
            <span className='text-4xl font-light text-blue-600'>
              {schedule.length}
            </span>
            <span className='text-slate-500 ml-2 font-medium'>sessions</span>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {[
            { label: 'Total Sessions', value: schedule.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending Verify', value: pendingVerifications, icon: AlertCircle, color: pendingVerifications > 0 ? 'text-amber-600' : 'text-slate-400', bg: 'bg-amber-50' },
            { label: 'Est. Revenue', value: '€' + schedule.reduce((acc, s) => acc + (s.price || 0), 0), icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ].map((stat, i) => (
             <motion.div 
               key={stat.label}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
             >
                <Card className='rounded-[2rem] border-0 shadow-lg shadow-slate-200/50 bg-white hover:shadow-xl transition-all'>
                    <CardHeader className='pb-2 flex flex-row items-center justify-between space-y-0'>
                        <CardTitle className='text-sm font-semibold uppercase tracking-wider text-slate-500'>{stat.label}</CardTitle>
                        <div className={p-2 rounded-full }>
                           <stat.icon className={h-4 w-4 } />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='text-3xl font-bold text-slate-900'>
                            {stat.value}
                        </div>
                        <p className='text-xs font-medium text-slate-500 mt-1'>For today</p>
                    </CardContent>
                </Card>
             </motion.div>
        ))}
      </div>
      
      {/* Schedule List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
          <Card className='rounded-[2.5rem] border-0 shadow-2xl shadow-indigo-900/5 overflow-hidden bg-white/80 backdrop-blur-xl'>
            <CardHeader className='bg-slate-50/50 border-b border-slate-100 px-8 py-6'>
                <CardTitle className='text-xl font-bold text-slate-900'>Schedule</CardTitle>
                <CardDescription>Upcoming appointments in chronological order</CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                {schedule.length > 0 ? (
                    <div className='divide-y divide-slate-100'>
                        {schedule.map((session, i) => (
                            <div key={i} className='p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors'>
                                <div className='flex items-start gap-4'>
                                    <div className='flex flex-col items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl min-w-[5rem]'>
                                        <span className='text-lg font-bold'>{format(new Date(session.start_time), 'HH:mm')}</span>
                                        <span className='text-xs font-semibold opacity-70'>{session.duration} min</span>
                                    </div>
                                    <div>
                                        <h4 className='text-lg font-bold text-slate-900'>{session.client_name || 'Guest Client'}</h4>
                                        <p className='text-slate-500 font-medium'>{session.service_name}</p>
                                        {!session.is_identity_verified && (
                                            <span className='inline-flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1 border border-amber-100'>
                                                <AlertCircle className='w-3 h-3 mr-1' /> Verify ID
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Button size='sm' variant='outline' className='rounded-xl border-slate-200'>Details</Button>
                                    <Button size='sm' className='rounded-xl bg-slate-900 text-white shadow-md'>Check In</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='p-12 text-center text-slate-500'>
                        No sessions scheduled for today.
                    </div>
                )}
            </CardContent>
          </Card>
      </motion.div>
    </div>
  );
}

