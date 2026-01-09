import { fetchService } from '@/server/booking/service';
import { Service } from '@/types/database';
import Link from 'next/link';
import { ChevronLeft, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import { BookingModal } from '@/components/BookingModal';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceBookingPage({ params }: PageProps) {
  const { id } = await params;
  const { data, error } = await fetchService(id);

  if (error || !data) {
    if ((error as any)?.code === '404') {
      notFound();
    }
    console.error('Error fetching service:', error);
    return (
      <div className="min-h-screen bg-background-dark text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-primary mb-4">Error Loading Service</h1>
          <p className="text-slate-400 mb-8">We couldn&apos;t load the service details. Please try again later.</p>
          <Link href="/" className="text-primary hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const service = data as Service;

  return (
    <div className="min-h-screen bg-background-dark text-slate-200 font-display">
      <div className="layout-container flex flex-col max-w-4xl mx-auto px-6 py-12">
        <Link href="/#booking" className="inline-flex items-center text-slate-400 hover:text-primary transition-colors mb-8 group">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </Link>

        <div className="bg-surface border border-border-subtle rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-serif text-slate-100 mb-6">{service.name}</h1>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-3 text-slate-300 bg-surface-highlight px-4 py-2 rounded-full border border-border-subtle">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">{service.duration} Minutes</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 bg-surface-highlight px-4 py-2 rounded-full border border-border-subtle">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="font-medium">€{service.price}</span>
                </div>
              </div>

              <div className="prose prose-invert prose-lg max-w-none text-slate-400 mb-10">
                <p className="whitespace-pre-line">{service.description}</p>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-serif text-slate-200">What to expect</h3>
                <ul className="grid grid-cols-1 gap-3">
                  {['Personalized assessment', 'Therapeutic touch', 'Relaxing environment', 'Post-session guidance'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400">
                      <CheckCircle className="w-5 h-5 text-primary/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full md:w-80 shrink-0">
              <div className="bg-surface-highlight rounded-2xl p-6 border border-border-subtle sticky top-8">
                <h3 className="text-xl font-serif text-white mb-6">Book Session</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Service</span>
                    <span className="text-slate-200 font-medium text-right">{service.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Duration</span>
                    <span className="text-slate-200 font-medium">{service.duration} min</span>
                  </div>
                  <div className="border-t border-border-subtle pt-4 flex justify-between items-baseline">
                    <span className="text-slate-200 font-medium">Total</span>
                    <span className="text-2xl font-serif text-primary">€{service.price}</span>
                  </div>
                </div>

                <BookingModal 
                  service={service} 
                  trigger={
                    <button className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                      Continue to Calendar
                    </button>
                  }
                />
                
                <p className="text-xs text-center text-slate-500 mt-4">
                  Secure booking via Supabase. No payment required to reserve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}