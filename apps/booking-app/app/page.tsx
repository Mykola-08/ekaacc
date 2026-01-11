import { listServices } from '@/server/booking/service';
import { getWallet, getUpcomingBookings, getTherapistDailySchedule } from '@/server/dashboard/service';
import { Service } from '@/types/database';
import { ServiceCard } from '@/components/booking/ServiceCard';
import { Flower } from "lucide-react";
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
     const todaySchedule = await getTherapistDailySchedule(profile.id); // Assuming profile.id links correctly
     return <TherapistDashboard schedule={todaySchedule} />;
  }

  // 2. Client View (Authenticated)
  if (profile?.role === 'client') {
      const wallet = await getWallet(profile.id);
      const nextBooking = await getUpcomingBookings(profile.id);
      
      // If client has NO history and NO Onboarding, maybe show onboarding nudge?
      // For now, standard dashboard.
      return <ClientDashboard profile={profile} wallet={wallet} nextBooking={nextBooking} />;
  }

  // 3. Guest View (Service List)
  const services = await getServices();

  return (
    <div className="min-h-screen bg-background text-foreground font-display p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col gap-12">
        
        {/* Simple Header */}
        <header className="flex flex-col items-center gap-4 text-center mt-12">
          <div className="size-20 flex items-center justify-center text-primary rounded-full bg-primary/10 border border-primary/20 shadow-lg backdrop-blur-sm">
            <Flower className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground tracking-tight">Elena V. Bodywork</h1>
          <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
            Restoring balance through structural integration and intuitive therapy.
          </p>
        </header>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-muted-foreground bg-muted/20 rounded-3xl">
              No services available at the moment.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
