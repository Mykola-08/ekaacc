import { fetchService } from '@/server/booking/service';
import { Service } from '@/types/database';
import Link from 'next/link';
import { ChevronLeft, Clock, CreditCard, CheckCircle, Star } from 'lucide-react';
import { notFound } from 'next/navigation';
import { BookingModal } from '@/components/BookingModal';
import { cn } from '@/lib/utils';

export const revalidate = 0;

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
  
  // Resolve active variant
  const activeVariant = service.variants?.find(v => v.id === selectedVariantId) 
    || service.variants?.[0] 
    || null;
  
  const originApp = typeof sp.originApp === 'string' ? sp.originApp : undefined;

  const displayDuration = activeVariant ? activeVariant.duration : service.duration;
  const displayPrice = activeVariant ? activeVariant.price : service.price;

  return (
    <div className="min-h-screen bg-background-dark text-slate-200 font-display">
      <div className="layout-container flex flex-col max-w-5xl mx-auto px-6 py-12">
        <Link href="/#booking" className="inline-flex items-center text-slate-400 hover:text-primary transition-colors mb-8 group">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </Link>

        {/* Header Section */}
        <div className="mb-8">
           <h1 className="text-4xl md:text-5xl font-serif text-slate-100 mb-6">{service.name}</h1>
           {activeVariant && service.variants && service.variants.length > 1 && (
              <div className="flex items-center gap-3">
                <span className="text-lg text-primary font-medium">{activeVariant.name}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{displayDuration} min</span>
              </div>
           )}
        </div>

        <div className="bg-surface border border-border-subtle rounded-3xl p-6 md:p-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content Column */}
            <div className="flex-1">
              
              {/* Image Gallery */}
              {service.images && service.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {service.images.map((img, i) => (
                    <div key={i} className={cn("relative rounded-xl overflow-hidden bg-surface-highlight border border-border-subtle", i === 0 ? "col-span-2 aspect-[21/9]" : "aspect-video")}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`${service.name} view ${i+1}`} className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              ) : (
                service.image_url && (
                   <div className="relative rounded-xl overflow-hidden bg-surface-highlight border border-border-subtle aspect-[21/9] mb-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={service.image_url} alt={service.name} className="object-cover w-full h-full" />
                   </div>
                )
              )}

              {/* Description */}
              <div className="prose prose-invert prose-lg max-w-none text-slate-400 mb-10">
                <p className="whitespace-pre-line leading-relaxed">{activeVariant?.description || service.description}</p>
              </div>

               {/* Comparison / Variants Section */}
              {service.variants && service.variants.length > 1 && (
                <div className="mb-10">
                  <h3 className="text-xl font-serif text-slate-200 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" /> 
                    Choose your experience
                  </h3>
                  <div className="grid gap-4">
                    {service.variants.map((variant) => {
                      const isActive = activeVariant?.id === variant.id;
                      return (
                        <Link
                          key={variant.id}
                          href={`/book/${service.id}?variantId=${variant.id}${originApp ? `&originApp=${originApp}` : ''}`}
                          scroll={false}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border transition-all relative overflow-hidden",
                            isActive 
                              ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(230,210,196,0.1)]" 
                              : "bg-surface-highlight border-border-subtle hover:border-primary/30"
                          )}
                        >
                          {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                          <div>
                            <div className="flex items-center gap-3">
                              <span className={cn("font-medium text-lg", isActive ? "text-primary" : "text-slate-200")}>
                                {variant.name}
                              </span>
                              {variant.comparison_label && (
                                <span className="text-[10px] uppercase tracking-wider font-bold text-background bg-primary/90 px-2 py-0.5 rounded-full">
                                  {variant.comparison_label}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                                <Clock className="w-3 h-3" />
                                <span>{variant.duration} min</span>
                                {(variant.features?.length ?? 0) > 0 && (
                                   <>
                                     <span>•</span>
                                     <span className="text-slate-500">{variant.features?.join(', ')}</span>
                                   </>
                                )}
                            </div>
                          </div>
                          <div className="text-right pl-4">
                             <span className={cn("block font-serif text-xl", isActive ? "text-primary" : "text-slate-300")}>
                               €{variant.price}
                             </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 bg-surface-highlight/30 p-6 rounded-2xl border border-border-subtle/50">
                <h3 className="text-lg font-serif text-slate-200">What to expect</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Personalized assessment', 'Therapeutic touch', 'Relaxing environment', 'Post-session guidance'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-surface-highlight rounded-2xl p-6 border border-border-subtle sticky top-8 shadow-xl">
                <h3 className="text-2xl font-serif text-white mb-6">Booking Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm py-2 border-b border-border-subtle/50">
                    <span className="text-slate-400">Service</span>
                    <span className="text-slate-200 font-medium text-right">{service.name}</span>
                  </div>
                  {activeVariant && (
                    <div className="flex justify-between text-sm py-2 border-b border-border-subtle/50">
                        <span className="text-slate-400">Experience</span>
                        <span className="text-slate-200 font-medium text-right">{activeVariant.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm py-2 border-b border-border-subtle/50">
                    <span className="text-slate-400">Duration</span>
                    <span className="text-slate-200 font-medium">{displayDuration} min</span>
                  </div>
                  <div className="pt-4 flex justify-between items-end">
                    <div className="text-sm text-slate-400">Total Price</div>
                    <div className="text-3xl font-serif text-primary">€{displayPrice}</div>
                  </div>
                </div>

                <BookingModal 
                  service={service} 
                  preselectedVariantId={activeVariant?.id}
                  originApp={originApp}
                  trigger={
                    <button className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                      <span>Schedule Session</span>
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </button>
                  }
                />
                
                <div className="mt-6 flex flex-col gap-2 text-center">
                    <p className="text-xs text-slate-500">
                    Free cancellation up to 24h before appointment.
                    </p>
                    <div className="flex justify-center gap-2">
                       <CreditCard className="w-3 h-3 text-slate-600"/>
                       <p className="text-[10px] text-slate-600">Secure payment via Stripe</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}