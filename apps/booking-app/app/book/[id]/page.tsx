import { fetchService } from '@/server/booking/service';
import { getFamilyMembers } from '@/server/family/actions';
import { createClient } from '@/lib/supabase/server';
import { Service } from '@/types/database';
import { notFound } from 'next/navigation';
import { BookingDetails } from '@/components/booking/BookingDetails';

// Revalidate every 60 seconds for fresh availability data
export const revalidate = 60;

interface PageProps {
 params: Promise<{ id: string }>;
 searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ServiceBookingPage({ params, searchParams }: PageProps) {
 const { id } = await params;
 const sp = await searchParams;
 const selectedVariantId = typeof sp.variantId === 'string' ? sp.variantId : undefined;

 const { data, error } = await fetchService(id);

 if (error || !data) {
  if ((error as any)?.code === '404') {
   notFound();
  }
  console.error('Error fetching service:', error);
  return (
   <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
    <div className="text-center">
     <h1 className="text-2xl font-bold mb-4">Error Loading Service</h1>
     <p className="text-muted-foreground mb-8">We couldn't load the service details. Please try again later.</p>
    </div>
   </div>
  );
 }

 const service = data as Service;
 
 // Resolve active variant
 const activeVariant = service.variants?.find(v => v.id === selectedVariantId) 
  || service.variants?.[0] 
  || null;
 
 // Fetch user info (kept for future logic)
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 return (
    <BookingDetails service={service} activeVariant={activeVariant} />
 );
}
