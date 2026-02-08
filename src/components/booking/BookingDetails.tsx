'use client';

import { Service, ServiceVariant } from '@/types/database';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  Clock,
  CreditCard,
  CheckCircle,
  Star,
  Calendar as CalendarIcon,
  ArrowRight,
  User,
  Users,
  Loader2,
  Wallet,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { AvailabilitySlot } from '@/types/booking';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Simplified Component for Booking Details
// We inject the data from the server component (app/book/[id]/page.tsx)
// This keeps the server logic intact but replaces the UI

interface BookingDetailsProps {
  service: Service;
  activeVariant: ServiceVariant | null | undefined;
}

export function BookingDetails({ service, activeVariant }: BookingDetailsProps) {
  const supabase = createClient();

  // Display Derived Values
  const displayDuration = activeVariant ? activeVariant.duration : service.duration;
  const displayPrice = activeVariant ? activeVariant.price : service.price;
  const variantId = activeVariant?.id || service.variants?.[0]?.id;
  const depositAmount = 20; // 20 EUR

  // State
  const [date, setDate] = useState<Date>();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | undefined>();
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User State
  const [userProfile, setUserProfile] = useState<any>(null);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wallet'>('stripe');

  // Member Booking State
  const [bookingFor, setBookingFor] = useState<'self' | 'dependent'>('self');
  const [selectedDependentId, setSelectedDependentId] = useState<string>('none');

  // Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // Fetch Profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_id', user.id)
            .single();

          setUserProfile(profile);

          if (profile) {
            // Fetch Wallet
            const { data: wallet } = await supabase
              .from('wallets')
              .select('balance_cents')
              .eq('profile_id', profile.id)
              .single();

            if (wallet) {
              setWalletBalance(wallet.balance_cents / 100);
            }

            setName(profile.full_name || '');
            setEmail(profile.email || user.email || '');
          }

          // Helper to get family
          // We call the server action via an API route or just client-side query if RLS permits
          // For now, let's assume client-side query is fine for own family
          const { data: members } = await supabase
            .from('family_members')
            .select('*')
            .eq('parent_id', profile?.id);

          setFamilyMembers(members || []);

          if (profile) {
            setName(profile.full_name || '');
            setEmail(profile.email || user.email || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // Effect: Sync Form with Booking Mode
  useEffect(() => {
    if (bookingFor === 'self' && userProfile) {
      setName(userProfile.full_name || '');
      setEmail(userProfile.email || '');
    } else if (bookingFor === 'dependent' && selectedDependentId !== 'none') {
      const member = familyMembers.find((m) => m.id === selectedDependentId);
      if (member) {
        setName(member.full_name);
        // Dependencies usually use parent email
        if (userProfile?.email) setEmail(userProfile.email);
      }
    }
  }, [bookingFor, selectedDependentId, userProfile, familyMembers]);

  // Fetch Slots
  const fetchSlots = useCallback(
    async (selectedDate: Date) => {
      setLoadingSlots(true);
      setSelectedSlot(undefined);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const variantQuery = variantId ? `&variantId=${variantId}` : '';

      try {
        const res = await fetch(
          `/api/services/${service.id}/availability?date=${dateStr}${variantQuery}`
        );
        const data = await res.json();
        setSlots(data.slots || []);
      } catch (err) {
        console.error('Failed to load availability:', err);
        toast.error('Failed to load availability');
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    },
    [service.id, variantId]
  );

  useEffect(() => {
    if (date) {
      fetchSlots(date);
    } else {
      setSlots([]);
      setSelectedSlot(undefined);
    }
  }, [date, fetchSlots]);

  // Handle Booking Submission
  const handleBooking = async () => {
    if (!date || !selectedSlot) {
      toast.error('Please select a date and time');
      return;
    }
    if (!name || !email) {
      toast.error('Please fill in your details');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create booking
      const bookingResponse = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          serviceVariantId: variantId,
          startTime: selectedSlot.startTime,
          email,
          displayName: name,
          metadata: {
            attendeeType: bookingFor,
            attendeeProfileId: bookingFor === 'dependent' ? selectedDependentId : userProfile?.id,
          },
          userId: userProfile?.id,
          paymentMode: paymentMethod === 'wallet' ? 'full' : 'deposit', // Wallet is instant full payment or deposit? Wallet API pays full.
          depositCents: 2000, // 20 EUR
        }),
      });

      const bookingData = await bookingResponse.json();

      if (bookingData.error) throw new Error(bookingData.error);

      // 2. Process Payment
      if (paymentMethod === 'wallet') {
        const walletResponse = await fetch('/api/booking/pay-with-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: bookingData.bookingId }),
        });
        const walletData = await walletResponse.json();
        if (walletData.error) throw new Error(walletData.error);

        toast.success('Booking Confirmed!');
        // Redirect to success page or Dashboard
        window.location.href = '/bookings';
      } else {
        // Initiate Checkout (Stripe)
        const checkoutResponse = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: service.id,
            serviceName: service.name,
            price: 20, // 20 EUR deposit
            customerName: name,
            customerEmail: email,
            date: selectedSlot.startTime,
            bookingId: bookingData.bookingId,
            userId: userProfile?.id, // Added userId to link Stripe Customer!
          }),
        });

        const checkoutData = await checkoutResponse.json();

        if (checkoutData.error) throw new Error(checkoutData.error);

        window.location.href = checkoutData.url;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Booking error:', error);
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-foreground animate-in fade-in min-h-screen pb-20 font-sans duration-500">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground group mb-8 inline-flex items-center text-sm font-medium transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Services
        </Link>

        <div className="flex flex-col gap-12 p-2 lg:flex-row lg:items-start">
          {/* Left Column: Details */}
          <div className="animate-in slide-in-from-bottom-8 flex-1 duration-700">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-foreground mb-6 text-4xl leading-tight font-semibold tracking-tight lg:text-5xl">
                {service.name}
              </h1>
              {activeVariant && (
                <div className="flex items-center gap-3">
                  <span className="bg-foreground/5 text-foreground border-foreground/5 rounded-full border px-3 py-1 text-sm font-medium">
                    {activeVariant.name}
                  </span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="text-muted-foreground text-sm font-medium">
                    {displayDuration} min
                  </span>
                </div>
              )}
            </div>

            {/* Image */}
            {(service.images?.[0] || service.image_url) && (
              <div className="bg-muted relative mb-10 aspect-video overflow-hidden rounded-[20px] border border-black/5 shadow-sm">
                <Image
                  src={service.images?.[0] || service.image_url || ''}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}

            {/* Description */}
            <div className="prose prose-lg text-muted-foreground dark:prose-invert mb-12 max-w-none">
              <p className="leading-relaxed font-light whitespace-pre-line">
                {activeVariant?.description || service.description}
              </p>
            </div>

            {/* Variants Selector (if multiple) */}
            {service.variants && service.variants.length > 1 && (
              <div className="mb-12">
                <h3 className="text-foreground mb-6 flex items-center gap-2 text-lg font-semibold tracking-tight">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  Choose Experience
                </h3>
                <div className="grid gap-4">
                  {service.variants.map((variant) => {
                    const isActive = variantId === variant.id;
                    return (
                      <Link
                        key={variant.id}
                        href={`/book/${service.id}?variantId=${variant.id}`}
                        scroll={false}
                        className={cn(
                          'group flex cursor-pointer items-center justify-between rounded-[20px] border p-5 transition-all',
                          isActive
                            ? 'bg-primary/5 border-primary/20 shadow-sm'
                            : 'border-white/20 bg-white/40 backdrop-blur-xl hover:border-black/5 hover:bg-white/60'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              'flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
                              isActive ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                            )}
                          >
                            {isActive && <div className="h-2 w-2 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div
                              className={cn(
                                'text-lg font-medium tracking-tight',
                                isActive ? 'text-primary' : 'text-foreground'
                              )}
                            >
                              {variant.name}
                            </div>
                            <div className="text-muted-foreground text-sm font-light">
                              {variant.duration} min •{' '}
                              {variant.features?.join(', ') || 'Standard Session'}
                            </div>
                          </div>
                        </div>
                        <div className="text-lg font-semibold tracking-tight">€{variant.price}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-[20px] border border-white/20 bg-white/40 p-8 shadow-sm backdrop-blur-xl">
              <h3 className="text-foreground mb-4 text-lg font-semibold tracking-tight">
                What to expect
              </h3>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  'Personalized assessment',
                  'Therapeutic touch',
                  'Relaxing environment',
                  'Post-session guidance',
                ].map((item, i) => (
                  <li key={i} className="text-muted-foreground flex items-center gap-3 font-light">
                    <CheckCircle className="h-4 w-4 text-emerald-500/80" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="animate-in slide-in-from-bottom-12 w-full shrink-0 delay-100 duration-500 lg:sticky lg:top-24 lg:w-105">
            <div className="rounded-[20px] border border-white/40 bg-white/60 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] backdrop-blur-2xl">
              {/* Family / User Selection */}
              {!loadingUser && userProfile && familyMembers.length > 0 && (
                <div className="mb-6 inline-flex w-full rounded-full border border-black/5 bg-black/5 p-1">
                  <button
                    onClick={() => setBookingFor('self')}
                    className={cn(
                      'flex-1 rounded-full py-1.5 text-xs font-semibold transition-all',
                      bookingFor === 'self'
                        ? 'text-foreground bg-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Myself
                  </button>
                  <button
                    onClick={() => setBookingFor('dependent')}
                    className={cn(
                      'flex-1 rounded-full py-1.5 text-xs font-semibold transition-all',
                      bookingFor === 'dependent'
                        ? 'text-foreground bg-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Family Member
                  </button>
                </div>
              )}

              {bookingFor === 'dependent' && (
                <div className="mb-6">
                  <Select value={selectedDependentId} onValueChange={setSelectedDependentId}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-black/5 bg-white/50">
                      <SelectValue placeholder="Select Member" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyMembers.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.full_name} ({m.relationship})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Contact Details Inputs (if not user or edit needed) */}
              <div className="mb-8 space-y-4">
                <div>
                  <label className="text-muted-foreground mb-2 ml-1 block text-xs font-semibold tracking-wider uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="focus:border-primary/50 focus:ring-primary/10 placeholder:text-muted-foreground/40 text-foreground h-11 w-full rounded-xl border border-black/5 bg-white/50 px-4 text-sm transition-all outline-none focus:bg-white focus:ring-2"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-2 ml-1 block text-xs font-semibold tracking-wider uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="focus:border-primary/50 focus:ring-primary/10 placeholder:text-muted-foreground/40 text-foreground h-11 w-full rounded-xl border border-black/5 bg-white/50 px-4 text-sm transition-all outline-none focus:bg-white focus:ring-2"
                  />
                </div>
              </div>

              <div className="via-border mb-8 h-px bg-linear-to-r from-transparent to-transparent" />

              <div className="mb-8">
                <h3 className="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight">
                  <CalendarIcon className="text-muted-foreground h-4 w-4" />
                  Select Date & Time
                </h3>

                <div className="mb-6 rounded-[20px] border border-white/20 bg-white/40 p-4 shadow-sm">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(day) => day < new Date() || day > addDays(new Date(), 90)}
                    className="pointer-events-auto flex w-full justify-center rounded-xl border-none bg-transparent p-0"
                    classNames={{
                      day_selected:
                        'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-md',
                      day_today: 'bg-white/50 text-foreground font-bold',
                      head_cell: 'text-muted-foreground font-medium text-[0.8rem] w-8',
                      cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent h-8 w-8',
                      day: 'h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-full hover:bg-black/5 transition-colors',
                    }}
                  />
                </div>

                {date && (
                  <div className="animate-in fade-in slide-in-from-top-4">
                    <h4 className="text-muted-foreground mb-3 ml-1 block text-xs font-bold tracking-wider uppercase">
                      Available Slots — {format(date, 'MMM do')}
                    </h4>
                    {loadingSlots ? (
                      <div className="text-muted-foreground flex items-center justify-center gap-2 py-8">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm font-light">Checking availability...</span>
                      </div>
                    ) : slots.length > 0 ? (
                      <div className="custom-scrollbar grid max-h-60 grid-cols-2 gap-2 overflow-y-auto pr-1">
                        {slots.map((slot, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedSlot(slot)}
                            className={cn(
                              'rounded-xl border px-3 py-2.5 text-center text-sm transition-all',
                              selectedSlot === slot
                                ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-md'
                                : 'text-foreground type-tabular border-transparent bg-white/50 font-light hover:bg-white hover:shadow-sm'
                            )}
                          >
                            {format(new Date(slot.startTime), 'h:mm a')}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-black/5 bg-white/30 py-6 text-center">
                        <p className="text-muted-foreground text-sm font-light">
                          No slots available
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4 border-t border-black/5 pt-6">
                {/* Payment Method Selection */}
                {walletBalance !== null && walletBalance >= depositAmount && (
                  <div className="rounded-xl border border-black/5 bg-white/50 p-1">
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => setPaymentMethod('stripe')}
                        className={cn(
                          'flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                          paymentMethod === 'stripe'
                            ? 'text-foreground bg-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <CreditCard className="h-4 w-4" />
                        Card
                      </button>
                      <button
                        onClick={() => setPaymentMethod('wallet')}
                        className={cn(
                          'flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                          paymentMethod === 'wallet'
                            ? 'text-foreground bg-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Wallet className="h-4 w-4" />
                        Wallet (€{walletBalance})
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-end justify-between">
                  <div className="text-muted-foreground text-sm font-medium">Deposit Due</div>
                  <div className="text-foreground text-3xl font-semibold tracking-tight">
                    €20<span className="text-muted-foreground text-lg font-light">.00</span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={isSubmitting || !selectedSlot || !name || !email}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 flex w-full items-center justify-center gap-2 rounded-lg py-4 text-lg font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>{paymentMethod === 'wallet' ? 'Pay with Balance' : 'Pay Deposit & Book'}</>
                  )}
                </button>

                <div className="text-muted-foreground/60 space-y-1 pt-2 text-center text-xs font-light">
                  <p>Free cancellation up to 24 hours before your appointment.</p>
                  <div className="flex items-center justify-center gap-1.5 opacity-80">
                    {paymentMethod === 'stripe' ? (
                      <>
                        <CreditCard className="h-3 w-3" />
                        <span>Secure payment via Stripe</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="h-3 w-3" />
                        <span>Secure payment via Wallet</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
