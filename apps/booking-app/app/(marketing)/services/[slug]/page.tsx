import { notFound } from 'next/navigation';
import { createClient } from '@/lib/platform/supabase/server';
import ServiceDetailContent from './content';

// Dynamic route setup
export const dynamic = 'force-dynamic';

interface PageProps {
 params: {
  slug: string;
 };
}

export default async function ServicePage({ params }: PageProps) {
 const { slug } = params;
 const supabase = await createClient();

 // Fetch service and its variants (joined)
 const { data: service, error } = await supabase
  .from('service')
  .select(`
   *,
   service_variant (
    name,
    duration_min,
    price_amount
   )
  `)
  .eq('slug', slug)
  // .eq('active', true) // Allow viewing inactive if needed? usually no.
  .single();

 if (error || !service) {
  console.error(`Error fetching service ${slug}:`, error);
  notFound();
 }

 // Ensure service.service_variant is an array (it should be due to query)
 // Types might need assertion if supabase generated types aren't fully synced yet
 const safeService = {
   ...service,
   service_variant: Array.isArray(service.service_variant) ? service.service_variant : []
 };

 return <ServiceDetailContent service={safeService} />;
}
