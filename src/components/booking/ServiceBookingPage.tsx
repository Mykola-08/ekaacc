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
import { toast } from 'sonner';
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
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="container relative z-10 flex h-full flex-col justify-end px-4 pb-16 md:px-6">
           <Link href="/book" className="text-muted-foreground hover:text-foreground absolute top-8 left-4 flex items-center md:left-6">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 h-5 w-5" />
              All Services
           </Link>

           <div className="animate-in slide-in-from-bottom-8 fade-in duration-700">
             <Badge variant="secondary" className="mb-4 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
               {service.category || 'Wellness'}
             </Badge>
             <h1 className="text-foreground max-w-3xl text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
               {service.name}
             </h1>
             <p className="text-muted-foreground/90 mt-4 max-w-2xl text-xl leading-relaxed">
               {service.description?.slice(0, 150)}...
             </p>
           </div>
        </div>
      </div>

      <div className="container relative z-20 -mt-12 px-4 pb-24 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          
          {/* --- LEFT COLUMN: DETAILS & GALLERY --- */}
          <div className="space-y-12">
            
            {/* Gallery */}
            {service.images && service.images.length > 0 && (
                <ServiceGallery images={service.images} name={service.name} />
            )}

            {/* Description */}
            <div className="prose dark:prose-invert prose-lg max-w-none">
                <h3 className="font-sans text-2xl font-bold">About this session</h3>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {service.description}
                </p>
            </div>

            {/* Benefits */}
            <div className="bg-card border-border rounded-[20px] border p-8 shadow-sm">
               <h3 className="text-foreground mb-6 font-sans text-xl font-bold">What to expect</h3>
               <div className="grid gap-4 sm:grid-cols-2">
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


          {/* --- RIGHT COLUMN: BOOKING WIDGET (Sticky) --- */}
          <div className="relative">
             <div className="sticky top-24 space-y-6" id="booking-wizard-container">
                
                {/* Booking Card */}
                <div className="bg-card border-border overflow-hidden rounded-[20px] border shadow-eka-lg">
                    
                    {/* Header / Variant Selection */}
                    <div className="bg-secondary/30 border-border border-b p-6">
                        {step === 'info' ? (
                           <>
                             <div className="mb-6 flex items-baseline justify-between">
                                <span className="text-muted-foreground font-medium">Price</span>
                                <span className="text-foreground text-3xl font-bold">€{currentPrice}</span>
                             </div>

                             {service.variants && service.variants.length > 1 && (
                                <div className="space-y-3">
                                   <label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Select Option</label>
                                   <div className="grid gap-3">
                                      {service.variants.map((variant) => (
                                          <div 
                                            key={variant.id}
                                            onClick={() => handleVariantChange(variant.id)}
                                            className={cn(
                                                "border-border group flex cursor-pointer items-center justify-between rounded-[16px] border p-4 transition-all hover:border-primary/50",
                                                selectedVariantId === variant.id ? "bg-primary/5 border-primary ring-1 ring-primary" : "bg-background"
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
                                                     <p className="text-foreground font-bold">{variant.name}</p>
                                                     {variant.description && <p className="text-muted-foreground text-xs">{variant.description}</p>}
                                                 </div>
                                              </div>
                                              <div className="text-right">
                                                  <p className="text-foreground font-bold">€{variant.price}</p>
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
                              <h3 className="text-foreground text-lg font-bold">
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
                    <div className="p-6">
                        {step === 'info' && (
                            <Button size="lg" className="w-full rounded-full text-lg font-bold shadow-lg" onClick={handleStartBooking}>
                                Book Session
                            </Button>
                        )}

                        {step === 'time' && (
                             <div className="space-y-6">
                                <StepTime 
                                   date={date}
                                   setDate={setDate}
                                   timeSlots={timeSlots}
                                   loadingSlots={loadingSlots}
                                   selectedTime={selectedTime}
                                   onTimeSelect={setSelectedTime}
                                />
                                <Button size="lg" className="w-full rounded-full font-bold" onClick={handleNext} disabled={!selectedTime}>
                                    Next Step
                                </Button>
                             </div>
                        )}

                        {step === 'addons' && (
                             <div className="space-y-6">
                                <StepAddons />
                                <Button size="lg" className="w-full rounded-full font-bold" onClick={handleNext}>
                                    Continue
                                </Button>
                             </div>
                        )}

                        {step === 'details' && (
                            <div className="space-y-6">
                                <StepDetails 
                                   user={user}
                                   formData={formData}
                                   serviceId={service.id}
                                   handleInputChange={handleInputChange}
                                   setFormData={setFormData}
                                />
                                <Button size="lg" className="w-full rounded-full font-bold" onClick={handleNext}>
                                    To Payment
                                </Button>
                            </div>
                        )}

                        {step === 'payment' && (
                             <div className="space-y-6">
                                <StepPayment 
                                   paymentMethod={paymentMethod}
                                   setPaymentMethod={setPaymentMethod}
                                   user={user}
                                   walletBalance={walletBalance}
                                   price={currentPrice}
                                />
                                <Button size="lg" className="w-full rounded-full font-bold shadow-lg" onClick={handleBooking} disabled={loading}>
                                    {loading ? <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-5 w-5 animate-spin"/> : null}
                                    Pay €{currentPrice} & Book
                                </Button>
                             </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-secondary/30 border-border flex items-center justify-center gap-2 border-t p-4 text-xs font-medium text-muted-foreground">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4 text-emerald-500" />
                        <span>Instant Confirmation</span>
                        <span className="text-border mx-2">|</span>
                        <HugeiconsIcon icon={StarIcon} className="h-4 w-4 text-amber-500" />
                        <span>Trusted by 500+ clients</span>
                    </div>

                </div>

                {/* Help Card */}
                <div className="bg-secondary/20 rounded-[20px] p-6 text-center">
                   <p className="text-foreground text-sm font-bold">Need help booking?</p>
                   <p className="text-muted-foreground mt-1 text-xs">Call us at +359 88 123 4567</p>
                </div>

             </div>
          </div>
        
        </div>
      </div>
    
    </div>
  );
}
