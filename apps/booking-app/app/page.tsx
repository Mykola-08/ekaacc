import { listServices } from '@/server/booking/service';
import { getWallet, getUpcomingBookings, getTherapistDailySchedule } from '@/server/dashboard/service';
import { Service } from '@/types/database';
import { ServiceGrid } from '@/components/booking/ServiceGrid';
import { createClient } from '@/lib/supabase/server';
import { ClientDashboard } from '@/components/dashboard/ClientDashboard';
import { TherapistDashboard } from '@/components/dashboard/TherapistDashboard';
import { getSingleActiveTherapist } from '@/server/therapist/service';

import { redirect } from 'next/navigation';

// ... existing imports ...

import { getClientExerciseStats } from '@/server/exercises/service';

// Dynamic because we check auth
export const dynamic = 'force-dynamic';

export default async function Home() {
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 let profile = null;
 if (user) {
  const { data } = await supabase
   .from('profiles')
   .select('*')
   .eq('auth_id', user.id)
   .single();
  profile = data;
 }

 // 1. Therapist View
 if (profile?.role === 'therapist' || profile?.role === 'admin') {
   const todaySchedule = await getTherapistDailySchedule(profile.id);
   return <TherapistDashboard schedule={todaySchedule} />;
 }

 // 2. Client View (Authenticated)
 if (profile?.role === 'client') {
   const wallet = await getWallet(profile.id);
   const nextBookings = await getUpcomingBookings(profile.id);
   const singleTherapist = await getSingleActiveTherapist();
   const exerciseStats = await getClientExerciseStats(profile.id);

   // Assuming getUpcomingBookings returns an array, pick the first one
   const nextBooking = Array.isArray(nextBookings) ? nextBookings[0] : nextBookings;
   return <ClientDashboard profile={profile} wallet={wallet} nextBooking={nextBooking} singleTherapist={singleTherapist} exerciseStats={exerciseStats} />;
 }

 // 3. Redirect unauthenticated users to the main website
 redirect('http://localhost:9002');
}
