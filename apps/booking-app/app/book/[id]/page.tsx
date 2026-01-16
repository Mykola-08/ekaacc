import { fetchService } from '@/server/booking/service';
import { notFound } from 'next/navigation';
import { Service } from '@/types/database';
import { BookingWizard } from '@/components/booking/BookingWizard';

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
  notFound();
 }

 const service = data as Service;

 return (
    <BookingWizard service={service} variantId={selectedVariantId} />
 );
}
