import { listServices } from '@/server/booking/service';
import { getWallet, getUpcomingBookings, getTherapistDailySchedule } from '@/server/dashboard/service';
import { Service } from '@/types/database';
import { ServiceGrid } from '@/components/booking/ServiceGrid';
import { Flower, Sparkles } from 'lucide-react';
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
   const nextBooking = await getUpcomingBookings(profile.id);
   return <ClientDashboard profile={profile} wallet={wallet} nextBooking={nextBooking} />;
 }

 // 3. Guest View (Service List)
 const services = await getServices();

 return (
  <div className='flex flex-col items-center w-full px-4 md:px-8 pb-12 min-h-screen bg-background text-foreground'>
   <div className='w-full max-w-7xl flex flex-col gap-12 pt-12'>
    
    {/* Simple Header */}
    <div className='flex flex-col items-center gap-6 text-center max-w-2xl mx-auto animate-zoom-in'>
     <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
      <div className='size-24 flex items-center justify-center text-primary-foreground rounded-[2rem] bg-primary shadow-2xl rotate-3 hover:rotate-6 transition-transform duration-500'>
       <Flower className='w-12 h-12' />
      </div>
     </div>
     
     <div className='space-y-4 animate-slide-up' style={{ animationDelay: '200ms' }}>
       <h1 className='text-5xl md:text-7xl font-serif text-foreground tracking-tight leading-[0.9]'>
        Restoring<br/>Balance.
       </h1>
       <p className='text-muted-foreground text-xl leading-relaxed max-w-lg mx-auto font-medium'>
        Structural integration and intuitive therapy for a aligned mind and body.
       </p>
     </div>
     
     <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className='flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-widest bg-muted px-4 py-2 rounded-full'>
        <Sparkles className='w-4 h-4' />
        <span>Available Sessions below</span>
      </div>
     </div>
    </div>

    {/* Service Grid */}
    <ServiceGrid services={services} />

   </div>
  </div>
 );
}
