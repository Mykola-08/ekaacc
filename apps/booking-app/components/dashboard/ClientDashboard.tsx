'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Wallet, Calendar, ArrowRight, Clock, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ClientDashboardProps {
  profile: any;
  wallet: { balanceCents: number; pointsBalance: number };
  nextBooking: any;
  recommendation?: any;
}

export function ClientDashboard({ profile, wallet, nextBooking }: ClientDashboardProps) {
  return (
    <div className='w-full max-w-4xl mx-auto space-y-8 p-6'>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6'
      >
        <div>
          <h1 className='text-4xl font-serif font-bold tracking-tight text-slate-900 mb-2'>
            Welcome back, {profile.full_name?.split(' ')[0]}
          </h1>
          <p className='text-slate-500 font-medium text-lg'>
            Your wellness journey continues.
          </p>
        </div>
        <Button asChild className='h-12 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 transition-all hover:scale-105'>
            <Link href='/#services'>
                <Plus className='mr-2 h-4 w-4' />
                Book New Session
            </Link>
        </Button>
      </motion.header>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Next Session Card */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.1 }}
        >
        <Card className='h-full rounded-[2rem] border-0 shadow-2xl shadow-blue-900/5 bg-white/80 backdrop-blur-xl overflow-hidden group'>
            <CardHeader className='border-b border-slate-100/50 bg-blue-50/30 pb-6 pt-6'>
              <CardTitle className='flex items-center gap-2 text-slate-900 text-lg font-semibold'>
                <Calendar className='w-5 h-5 text-blue-600' />
                Next Session
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-8 pb-8 flex-1 flex flex-col justify-between'>
              {nextBooking ? (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-3xl font-serif font-bold tracking-tight text-slate-900 mb-2'>{nextBooking.service_name}</h3>
                    <div className='flex items-center gap-2 text-slate-500 font-medium'>
                      <Clock className='w-4 h-4' />
                      {format(new Date(nextBooking.start_time), 'h:mm a')} &middot; {nextBooking.duration} min
                    </div>
                  </div>
                  
                  <div className='inline-flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 w-full'>
                     <span className='text-xs uppercase tracking-widest font-bold text-slate-400 mb-1'>Date</span>
                     <span className='text-2xl font-bold text-slate-900'>
                        {format(new Date(nextBooking.start_time), 'MMMM d, yyyy')}
                     </span>
                  </div>

                  <Button className='w-full rounded-2xl h-12 bg-white border-2 border-slate-100 hover:bg-slate-50 text-slate-900 shadow-none font-semibold' variant='outline'>
                    Manage Booking
                  </Button>
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center h-48 text-center space-y-4'>
                    <div className='w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center'>
                      <Sparkles className='w-8 h-8 text-slate-300' />
                    </div>
                    <div>
                        <p className='text-slate-900 font-semibold mb-1'>No upcoming sessions</p>
                        <p className='text-slate-500 text-sm'>Time to prioritize yourself?</p>
                    </div>
                    <Button variant='link' asChild className='text-blue-600 font-semibold'>
                        <Link href='/#services'>Browse Availability <ArrowRight className='ml-1 w-4 h-4' /></Link>
                    </Button>
                </div>
              )}
            </CardContent>
        </Card>
        </motion.div>

        {/* Wallet / Balance Card */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
        >
        <Card className='h-full rounded-[2rem] border-0 shadow-2xl shadow-emerald-900/5 bg-white/80 backdrop-blur-xl overflow-hidden'>
            <CardHeader className='border-b border-slate-100/50 bg-emerald-50/30 pb-6 pt-6'>
              <CardTitle className='flex items-center gap-2 text-slate-900 text-lg font-semibold'>
                <Wallet className='w-5 h-5 text-emerald-600' />
                Credits & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-8 pb-8 space-y-8'>
                <div className='flex justify-between items-end p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-900/10'>
                   <div>
                      <p className='text-slate-400 text-sm font-medium mb-1'>Balance</p>
                      <p className='text-4xl font-light tracking-tight'>
                        €{(wallet.balanceCents / 100).toFixed(2)}
                      </p>
                   </div>
                   <div className='text-right'>
                      <p className='text-emerald-400 text-sm font-bold mb-1'>Points</p>
                      <p className='text-2xl font-bold'>{wallet.pointsBalance}</p>
                   </div>
                </div>

                <div className='space-y-4'>
                    <div className='flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm'>
                       <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm'>
                            +50
                          </div>
                          <div>
                            <p className='font-semibold text-slate-900'>Last Reward</p>
                            <p className='text-xs text-slate-500'>Booking Completion</p>
                          </div>
                       </div>
                       <span className='text-xs text-slate-400 font-medium'>2 days ago</span>
                    </div>
                </div>

                <Button className='w-full rounded-2xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-900/10'>
                   Add Funds
                </Button>
            </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  );
}

