'use client';

import { useState, useEffect } from 'react';
import { Service, ServiceVariant } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Clock01Icon,
  CheckmarkCircle02Icon,
  StarIcon,
  ArrowLeft01Icon,
  Loading03Icon,
} from '@hugeicons/core-free-icons';
import { format } from 'date-fns';
import { toast } from '@/components/ui/morphing-toaster';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  createNewBookingAction,
  getAvailableSlotsAction,
} from '@/server/actions/booking-actions';
import { useBookingRealtime } from '@/hooks/useBookingRealtime';
import Image from 'next/image';

import { ServiceGallery } from './ServiceGallery';
import { StepTime } from './wizard/StepTime';
import { StepAddons } from './wizard/StepAddons';
import { StepDetails } from './wizard/StepDetails';
import { StepPayment } from './wizard/StepPayment';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ServiceBookingPageProps {
  service: Service;
  initialVariantId?: string;
}

export function ServiceBookingPage({ service, initialVariantId }: ServiceBookingPageProps) {
  const router = useRouter();
  
  // -- Selection State --
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    initialVariantId || service.variants?.[0]?.id || 'default'
  );
  
  // Computed Service Data
  const selectedVariant = service.variants?.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant ? selectedVariant.price : service.price;
  const currentDuration = selectedVariant ? selectedVariant.duration : service.duration;
  const features = selectedVariant?.features?.length 
    ? selectedVariant.features 
    : ['Professional Practitioner', 'Calm Environment', 'Personalized Care']; // Fallbacks

  // -- Booking Wizard State --
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [step, setStep] = useState<'info' | 'time' | 'addons' | 'details' | 'payment'>('info');
  const [loading, setLoading] = useState(false);

  // User & Wallet
  const [user, setUser] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  
  // Data State
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    createAccount: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wallet'>('stripe');

  // -- Effects --

  // 1. Fetch User
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Pre-fill form data from user metadata
        setFormData(prev => ({
          ...prev,
          firstName: user.user_metadata?.first_name || '',
          lastName: user.user_metadata?.last_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
        }));

        const { data: wallet } = await supabase
          .from('wallets')
          .select('balance_cents')
          .eq('user_id', user.id) // Migrated to user_id
          .single();
          
        if (wallet) {
          setWalletBalance(wallet.balance_cents / 100);
        }
      }
    };
    init();
  }, []);

  // 2. Fetch Slots
  const fetchSlots = async () => {
    if (!date) return;
    setLoadingSlots(true);
    setTimeSlots([]);
    setSelectedTime(null);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const res = await getAvailableSlotsAction(service.id, dateStr, selectedVariantId === 'default' ? undefined : selectedVariantId);
      if (res.success && res.data?.slots) {
        const formatted = res.data.slots.map((s: any) => format(new Date(s.startTime), 'HH:mm'));
        setTimeSlots([...new Set(formatted)] as string[]);
      }
    } catch (e) {
      toast.error('Could not load availability');
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
     if (step === 'time') fetchSlots();
  }, [date, service.id, selectedVariantId, step]);

  // 3. Realtime Updates
  useBookingRealtime((payload) => {
    if (payload.eventType === 'INSERT' && payload.new.service_id === service.id && date && step === 'time') {
       const bookingDate = new Date(payload.new.start_time);
       if (format(bookingDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')) fetchSlots();
    }
  });


  // -- Handlers --
  const handleVariantChange = (id: string) => {
    setSelectedVariantId(id);
    // If we change variant while in time selection, slots might change (duration affects slots)
    // Effect will auto-trigger fetchSlots
  };

  const handleStartBooking = () => {
    setStep('time');
    // Ideally scroll to wizard container
    document.getElementById('booking-wizard-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNext = () => {
    if (step === 'time') {
      if (!date || !selectedTime) {
        toast.error('Please select a date and time');
        return;
      }
      setStep('addons');
    } else if (step === 'addons') {
      setStep('details');
    } else if (step === 'details') {
       if (!user && (!formData.firstName || !formData.lastName || !formData.email)) {
        toast.error('Please fill in required details');
        return;
      }
      setStep('payment');
    }
  };

  const handleBack = () => {
    if (step === 'payment') setStep('details');
    else if (step === 'details') setStep('addons');
    else if (step === 'addons') setStep('time');
    else if (step === 'time') setStep('info');
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      if (!date || !selectedTime) throw new Error('Missing time');
      
      const [hours = 0, mins = 0] = selectedTime.split(':').map(Number);
      const startTime = new Date(date);
      startTime.setHours(hours, mins, 0, 0);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + currentDuration); // Use currentDuration

      const res = await createNewBookingAction({
        serviceId: service.id,
        variantId: selectedVariantId === 'default' ? undefined : selectedVariantId,
        startTime,
        endTime,
        email: user ? user.email : formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        priceCents: currentPrice * 100, // Use currentPrice
        paymentMode: paymentMethod,
        userId: user?.id,
      });

      if (res.success) {
        toast.success('Booking confirmed!');
        router.push('/book/success');
      } else {
        toast.error('Booking failed: ' + res.error);
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  return (
    <div className="bg-background min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[40vh] min-h-60 w-full overflow-hidden lg:h-[50vh] lg:min-h-80">
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="bg-muted h-full w-full" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
        
        <div className="container relative z-10 flex h-full flex-col justify-end px-4 pb-12 md:px-6">
           <Link href="/book" className="text-muted-foreground hover:text-foreground absolute top-6 left-4 flex items-center text-sm md:left-6">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-1.5 h-4 w-4" />
              All Services
           </Link>

           <div className="animate-in fade-in duration-300">
             <Badge variant="secondary" className="mb-3 text-xs font-medium tracking-wide uppercase backdrop-blur-md">
               {service.category || 'Wellness'}
             </Badge>
             <h1 className="text-foreground max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
               {service.name}
             </h1>
             <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
               {service.description?.slice(0, 150)}...
             </p>
           </div>
        </div>
      </div>

      <div className="container relative z-20 -mt-8 px-4 pb-16 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          
          {/* --- LEFT COLUMN: DETAILS & GALLERY --- */}
          <div className="order-last space-y-8 lg:order-first">
            
            {/* Gallery */}
            {service.images && service.images.length > 0 && (
                <ServiceGallery images={service.images} name={service.name} />
            )}

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold">About this session</h3>
                <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
                    {service.description}
                </p>
            </div>

            {/* Benefits */}
            <div className="bg-card border-border rounded-lg border p-6">
               <h3 className="text-foreground mb-4 text-lg font-semibold">What to expect</h3>
               <div className="grid gap-3 sm:grid-cols-2">
                  {features && features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                          <div className="bg-primary/10 text-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                             <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" strokeWidth={3} />
                          </div>
                          <span className="text-foreground/80 font-medium">{feature}</span>
                      </div>
                  ))}
               </div>
            </div>

          </div>


          {/* --- RIGHT COLUMN: BOOKING WIDGET (Sticky) — shown first on mobile --- */}
          <div className="relative order-first lg:order-last">
             <div className="sticky top-20 space-y-4" id="booking-wizard-container">
                
                {/* Booking Card */}
                <div className="bg-card border-border overflow-hidden rounded-lg border shadow-sm">
                    
                    {/* Header / Variant Selection */}
                    <div className="border-border border-b p-5">
                        {step === 'info' ? (
                           <>
                             <div className="mb-4 flex items-baseline justify-between">
                                <span className="text-muted-foreground text-sm font-medium">Price</span>
                                <span className="text-foreground text-2xl font-semibold">€{currentPrice}</span>
                             </div>

                             {service.variants && service.variants.length > 1 && (
                                <div className="space-y-2">
                                   <label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Select Option</label>
                                   <div className="grid gap-2">
                                      {service.variants.map((variant) => (
                                          <div 
                                            key={variant.id}
                                            onClick={() => handleVariantChange(variant.id)}
                                            className={cn(
                                                "border-border group flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:border-foreground/30",
                                                selectedVariantId === variant.id ? "bg-accent border-foreground/20" : "bg-background"
                                            )}
                                          >
                                              <div className="flex items-center gap-3">
                                                 <div className={cn(
                                                     "flex h-5 w-5 items-center justify-center rounded-full border",
                                                     selectedVariantId === variant.id ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                                                 )}>
                                                    {selectedVariantId === variant.id && <div className="bg-background h-2 w-2 rounded-full" />}
                                                 </div>
                                                 <div>
                                                     <p className="text-foreground font-medium">{variant.name}</p>
                                                     {variant.description && <p className="text-muted-foreground text-xs">{variant.description}</p>}
                                                 </div>
                                              </div>
                                              <div className="text-right">
                                                  <p className="text-foreground font-medium">€{variant.price}</p>
                                                  <p className="text-muted-foreground text-xs">{variant.duration} min</p>
                                              </div>
                                          </div>
                                      ))}
                                   </div>
                                </div>
                             )}

                             {!service.variants?.length && (
                                 <div className="flex items-center gap-2">
                                     <HugeiconsIcon icon={Clock01Icon} className="text-muted-foreground h-5 w-5" />
                                     <span className="text-foreground font-medium">{service.duration} minutes</span>
                                 </div>
                             )}
                           </>
                        ) : (
                           <div className="flex items-center justify-between">
                              <h3 className="text-foreground text-base font-semibold">
                                {step === 'time' && 'Select Time'}
                                {step === 'addons' && 'Add-ons'}
                                {step === 'details' && 'Details'}
                                {step === 'payment' && 'Payment'}
                              </h3>
                              <Button variant="ghost" size="sm" onClick={handleBack} className="text-muted-foreground h-8 px-2">
                                 Change
                              </Button>
                           </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="p-5">
                        {step === 'info' && (
                            <Button size="default" className="w-full font-medium" onClick={handleStartBooking}>
                                Book Session
                            </Button>
                        )}

                        {step === 'time' && (
                             <div className="space-y-4">
                                <StepTime 
                                   date={date}
                                   setDate={setDate}
                                   timeSlots={timeSlots}
                                   loadingSlots={loadingSlots}
                                   selectedTime={selectedTime}
                                   onTimeSelect={setSelectedTime}
                                />
                                <Button className="w-full font-medium" onClick={handleNext} disabled={!selectedTime}>
                                    Next Step
                                </Button>
                             </div>
                        )}

                        {step === 'addons' && (
                             <div className="space-y-4">
                                <StepAddons />
                                <Button className="w-full font-medium" onClick={handleNext}>
                                    Continue
                                </Button>
                             </div>
                        )}

                        {step === 'details' && (
                            <div className="space-y-4">
                                <StepDetails 
                                   user={user}
                                   formData={formData}
                                   serviceId={service.id}
                                   handleInputChange={handleInputChange}
                                   setFormData={setFormData}
                                />
                                <Button className="w-full font-medium" onClick={handleNext}>
                                    To Payment
                                </Button>
                            </div>
                        )}

                        {step === 'payment' && (
                             <div className="space-y-4">
                                <StepPayment 
                                   paymentMethod={paymentMethod}
                                   setPaymentMethod={setPaymentMethod}
                                   user={user}
                                   walletBalance={walletBalance}
                                   price={currentPrice}
                                />
                                <Button className="w-full font-medium" onClick={handleBooking} disabled={loading}>
                                    {loading ? <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-4 w-4 animate-spin"/> : null}
                                    Pay €{currentPrice} & Book
                                </Button>
                             </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-border flex items-center justify-center gap-2 border-t px-4 py-3 text-xs text-muted-foreground">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-3.5 w-3.5 text-success" />
                        <span>Instant Confirmation</span>
                        <span className="text-border mx-1.5">|</span>
                        <HugeiconsIcon icon={StarIcon} className="h-3.5 w-3.5 text-warning" />
                        <span>Trusted by 500+ clients</span>
                    </div>

                </div>

                {/* Help Card */}
                <div className="bg-secondary rounded-lg p-5 text-center">
                   <p className="text-foreground text-sm font-medium">Need help booking?</p>
                   <p className="text-muted-foreground mt-1 text-xs">Call us at +359 88 123 4567</p>
                </div>

             </div>
          </div>
        
        </div>
      </div>
    
    </div>
  );
}
