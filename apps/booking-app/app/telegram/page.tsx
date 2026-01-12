'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TelegramWebApp() {
 const [user, setUser] = useState<any>(null);

 useEffect(() => {
  const telegram = (window as any).Telegram;
  if (telegram?.WebApp) {
   const webApp = telegram.WebApp;
   webApp.ready();
   setUser(webApp.initDataUnsafe?.user);
  }
 }, []);

 return (
  <div className="p-4 space-y-4">
   <h1 className="text-2xl font-bold">EKA Booking</h1>
   {user && <p>Welcome, {user.first_name}!</p>}
   
   <div className="grid gap-4">
    <Link href="/telegram/book" className="block p-4 bg-blue-500 text-white rounded text-center">
     Book a Session
    </Link>
    <Link href="/telegram/bookings" className="block p-4 bg-gray-100 rounded text-center">
     My Bookings
    </Link>
    <Link href="/telegram/june" className="block p-4 bg-purple-100 rounded text-center">
     June Program
    </Link>
    <Link href="/telegram/checklist" className="block p-4 bg-green-100 rounded text-center">
     Daily Checklist
    </Link>
   </div>
  </div>
 );
}
