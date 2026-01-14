import { listServices } from '@/server/booking/service';
import { getWallet, getUpcomingBookings, getTherapistDailySchedule } from '@/server/dashboard/service';
import { Service } from '@/types/database';
import { ServiceGrid } from '@/components/booking/ServiceGrid';
import { createClient } from '@/lib/supabase/server';
import { ClientDashboard } from '@/components/dashboard/ClientDashboard';
import { TherapistDashboard } from '@/components/dashboard/TherapistDashboard';

// Dynamic because we check auth
export const dynamic = 'force-dynamic';

async function getServices(): Promise<Service[]> {
 const { data, error } = await listServices();
 if (error) return [];
 return (data || []) as Service[];
}

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
   // Assuming getUpcomingBookings returns an array, pick the first one
   const nextBooking = Array.isArray(nextBookings) ? nextBookings[0] : nextBookings;
   return <ClientDashboard profile={profile} wallet={wallet} nextBooking={nextBooking} />;
 }

 // 3. Guest View (Service List)
 const services = await getServices();

 return (
  <div className='min-h-screen bg-background font-sans pb-24'>
   {/* Hero Section */}
   <div className="pt-32 pb-16 px-6 text-center animate-in fade-in duration-700">
     <h1 className="text-4xl lg:text-5xl font-serif text-foreground mb-6 tracking-tight">
       Wellness, Reimagined.
     </h1>
     <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
       Discover a sanctuary for your mind and body. Book your next session with ease.
     </p>
   </div>
   
   <div className="container mx-auto px-4 max-w-7xl">
     <ServiceGrid services={services} />
   </div>
  </div>
 );
}
