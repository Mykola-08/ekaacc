import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServiceBookingPage } from '@/components/booking/ServiceBookingPage';
import { fetchService } from '@/server/booking/service';
import type { Service } from '@/types/database';

type BookServiceParams = {
  serviceId: string;
};

type BookServiceSearchParams = {
  variantId?: string | string[];
};

type BookServicePageProps = {
  params: Promise<BookServiceParams>;
  searchParams: Promise<BookServiceSearchParams>;
};

function pickVariantId(input: string | string[] | undefined): string | undefined {
  if (typeof input === 'string') return input;
  if (Array.isArray(input) && typeof input[0] === 'string') return input[0];
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<BookServiceParams>;
}): Promise<Metadata> {
  const { serviceId } = await params;
  const { data } = await fetchService(serviceId);
  const serviceName =
    typeof data === 'object' && data && 'name' in data ? String(data.name) : 'Service';

  return {
    title: `Book ${serviceName} | EKA Balance`,
    description: 'Complete your booking details and confirm your session.',
  };
}

export default async function BookServicePage({ params, searchParams }: BookServicePageProps) {
  const { serviceId } = await params;
  const query = await searchParams;
  const variantId = pickVariantId(query.variantId);
  const { data, error } = await fetchService(serviceId);

  if (error || !data) {
    notFound();
  }

  const service = data as Service;

  return (
    <main id="main-content">
      <ServiceBookingPage service={service} initialVariantId={variantId} />
    </main>
  );
}
