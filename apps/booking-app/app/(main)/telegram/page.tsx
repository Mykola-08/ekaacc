'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bot, Calendar, CalendarDays, CheckSquare } from 'lucide-react';

export default function TelegramWebApp() {
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure smooth entry animation
    setTimeout(() => setIsReady(true), 100);

    const telegram = (window as any).Telegram;
    if (telegram?.WebApp) {
      const webApp = telegram.WebApp;
      webApp.ready();
      webApp.expand(); // Request full height
      setUser(webApp.initDataUnsafe?.user);
      
      // Set header color to match our bg
      webApp.setHeaderColor?.('#FDFBF9');
      webApp.setBackgroundColor?.('#FDFBF9');
    }
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10 font-sans">
      <motion.div
        variants={container}
        initial="hidden"
        animate={isReady ? "show" : "hidden"}
        className="space-y-8"
      >
        <motion.div variants={item} className="space-y-1">
          <h1 className="text-3xl font-light text-[#1F1F1F] tracking-tight">EKA Booking</h1>
          {user ? (
            <p className="text-muted-foreground">Welcome back, {user.first_name}</p>
          ) : (
            <p className="text-muted-foreground">Welcome to your wellness space</p>
          )}
        </motion.div>
        
        <motion.div variants={item} className="grid gap-4">
          <Link href="/telegram/book" className="block group">
            <div className={cn(
              "relative overflow-hidden bg-card p-6 rounded-3xl border border-black/4 shadow-sm",
              "transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5",
              "flex items-center gap-4"
            )}>
              <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center shrink-0 border border-black/3">
                <Calendar className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1F1F1F]">Book a Session</h3>
                <p className="text-sm text-muted-foreground">Schedule your next treatment</p>
              </div>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </div>
          </Link>

          <Link href="/telegram/bookings" className="block group">
            <div className={cn(
              "relative overflow-hidden bg-card p-6 rounded-3xl border border-black/4 shadow-sm",
              "transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5",
              "flex items-center gap-4"
            )}>
              <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center shrink-0 border border-black/3">
                <CalendarDays className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1F1F1F]">My Bookings</h3>
                <p className="text-sm text-muted-foreground">Manage upcoming appointments</p>
              </div>
            </div>
          </Link>

          <Link href="/telegram/june" className="block group">
            <div className={cn(
              "relative overflow-hidden bg-card p-6 rounded-3xl border border-black/4 shadow-sm",
              "transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5",
              "flex items-center gap-4"
            )}>
              <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center shrink-0 border border-black/3">
                <Bot className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1F1F1F]">June Program</h3>
                <p className="text-sm text-muted-foreground">Your personal AI assistant</p>
              </div>
            </div>
          </Link>

          <Link href="/telegram/checklist" className="block group">
            <div className={cn(
              "relative overflow-hidden bg-card p-6 rounded-3xl border border-black/4 shadow-sm",
              "transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5",
              "flex items-center gap-4"
            )}>
              <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center shrink-0 border border-black/3">
                <CheckSquare className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1F1F1F]">Daily Checklist</h3>
                <p className="text-sm text-muted-foreground">Track your progress</p>
              </div>
            </div>
          </Link>

        </motion.div>

        {!user && (
           <motion.p variants={item} className="text-xs text-center text-muted-foreground/60 pt-8">
             Open in Telegram for full experience
           </motion.p>
        )}
      </motion.div>
    </div>
  );
}
