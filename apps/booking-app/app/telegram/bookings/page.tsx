'use client';

import { useEffect, useState } from 'react';

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

 if (loading) return <div className="p-4">Loading...</div>;
 if (!user) return <div className="p-4">Please open in Telegram</div>;

 return (
  <div className="p-4">
   <h1 className="text-xl font-bold mb-4">My Bookings</h1>
   {bookings.length === 0 ? (
    <p>No bookings found.</p>
   ) : (
    <ul className="space-y-2">
     {bookings.map((b) => (
      <li key={b.id} className="p-3 border rounded bg-white shadow-sm">
       <div className="font-medium">{b.service?.name || 'Service'}</div>
       <div className="text-sm text-gray-500">
        {new Date(b.start_time).toLocaleString()}
       </div>
       <div className="text-sm capitalize">Status: {b.status || b.payment_status}</div>
      </li>
     ))}
    </ul>
   )}
  </div>
 );
}
