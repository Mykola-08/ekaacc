'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CalendarDays, Clock, CheckCircle } from 'lucide-react';

export default function TelegramBookingsPage() {
 const [bookings, setBookings] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [user, setUser] = useState<any>(null);

 useEffect(() => {
  const telegram = (window as any).Telegram;
  if (telegram?.WebApp) {
   const webApp = telegram.WebApp;
   webApp.ready();
   const telegramUser = webApp.initDataUnsafe?.user;
   setUser(telegramUser);

   if (telegramUser) {
    fetchBookings(telegramUser.id);
   } else {
     setLoading(false);
   }
  } else {
    // For testing outside Telegram
    setLoading(false);
  }
 }, []);

 const fetchBookings = async (telegramId: number) => {
   try {
     const res = await fetch(`/api/telegram/bookings?telegram_id=${telegramId}`);
     const data = await res.json();
     if (data.bookings) {
       setBookings(data.bookings);
     }
   } catch (e) {
     console.error(e);
   } finally {
     setLoading(false);
   }
 };

 if (loading) return (
   <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
     <div className="animate-spin w-6 h-6 border-2 border-black/10 border-t-black/60 rounded-full" />
   </div>
 );
 
 if (!user) return (
   <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-6 text-center text-muted-foreground">
     Please open this page in Telegram
   </div>
 );

 return (
  <div className="min-h-screen bg-[#FDFBF9] px-4 py-8 font-sans">
   <div className="mb-8 pl-1">
     <h1 className="text-3xl font-light text-[#1F1F1F] tracking-tight mb-2">My Bookings</h1>
     <p className="text-muted-foreground/80 text-sm">Upcoming and past appointments</p>
   </div>

   {bookings.length === 0 ? (
    <div className="text-center py-12 bg-white rounded-4xl border border-black/3">
      <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
      <p className="text-muted-foreground">No bookings found yet.</p>
    </div>
   ) : (
    <ul className="space-y-3">
     {bookings.map((b, i) => (
      <motion.li 
        key={b.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
        className="p-5 bg-white rounded-3xl border border-black/4 shadow-sm flex flex-col gap-3"
      >
       <div className="flex items-start justify-between">
         <div className="font-medium text-lg text-[#1F1F1F]">{b.service?.name || 'Service'}</div>
         <div className={cn(
           "px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide",
           b.status === 'confirmed' ? "bg-green-100 text-green-700" :
           b.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
           "bg-gray-100 text-gray-600"
         )}>
           {b.status || b.payment_status}
         </div>
       </div>
       
       <div className="flex items-center text-sm text-muted-foreground gap-4">
         <div className="flex items-center gap-1.5">
           <CalendarDays className="w-4 h-4" />
           {new Date(b.start_time).toLocaleDateString()}
         </div>
         <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </div>
       </div>
      </motion.li>
     ))}
    </ul>
   )}
  </div>
 );
}
