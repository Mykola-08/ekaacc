'use client';

import { Service, ServiceVariant } from '@/types/database';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Clock, CreditCard, CheckCircle, Star, Calendar as CalendarIcon, ArrowRight, User, Users, Loader2, Wallet } from 'lucide-react';
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
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
                const { data: { user } } = await supabase.auth.getUser();
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
                console.error("Error fetching user:", error);
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
            const member = familyMembers.find(m => m.id === selectedDependentId);
            if (member) {
                setName(member.full_name);
                // Dependencies usually use parent email
                if (userProfile?.email) setEmail(userProfile.email);
            }
        }
    }, [bookingFor, selectedDependentId, userProfile, familyMembers]);

    // Fetch Slots
    const fetchSlots = useCallback(async (selectedDate: Date) => {
        setLoadingSlots(true);
        setSelectedSlot(undefined);
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const variantQuery = variantId ? `&variantId=${variantId}` : '';
        
        try {
          const res = await fetch(`/api/services/${service.id}/availability?date=${dateStr}${variantQuery}`);
          const data = await res.json();
          setSlots(data.slots || []);
        } catch (err) {
          console.error('Failed to load availability:', err);
          toast.error('Failed to load availability');
          setSlots([]);
        } finally {
          setLoadingSlots(false);
        }
    }, [service.id, variantId]);

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
        <div className="min-h-screen bg-background font-sans text-foreground pb-20 animate-in fade-in duration-500">
            <main className="max-w-6xl mx-auto px-6 py-12">
                <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group font-medium text-sm">
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Services
                </Link>

                <div className="flex flex-col lg:flex-row gap-12 lg:items-start p-2">
                    
                    {/* Left Column: Details */}
                    <div className="flex-1 animate-in slide-in-from-bottom-8 duration-700">
                         {/* Header */}
                         <div className="mb-8">
                            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-6 leading-tight">{service.name}</h1>
                            {activeVariant && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium bg-foreground/5 text-foreground px-3 py-1 rounded-full border border-foreground/5">{activeVariant.name}</span>
                                    <span className="text-muted-foreground/30">•</span>
                                    <span className="text-sm text-muted-foreground font-medium">{displayDuration} min</span>
                                </div>
                            )}
                        </div>

                        {/* Image */}
                        {(service.images?.[0] || service.image_url) && (
                            <div className="relative rounded-4xl overflow-hidden bg-muted aspect-video mb-10 border border-black/5 shadow-sm">
                                <Image 
                                    src={service.images?.[0] || service.image_url || ''} 
                                    alt={service.name} 
                                    fill
                                    className="object-cover transition-transform hover:scale-105 duration-700"
                                    sizes="(max-width: 768px) 100vw, 800px"
                                />
                            </div>
                        )}

                        {/* Description */}
                        <div className="prose prose-lg max-w-none text-muted-foreground mb-12 dark:prose-invert">
                            <p className="whitespace-pre-line leading-relaxed font-light">{activeVariant?.description || service.description}</p>
                        </div>

                        {/* Variants Selector (if multiple) */}
                        {service.variants && service.variants.length > 1 && (
                            <div className="mb-12">
                                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-6 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 
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
                                                "group flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer",
                                                isActive 
                                                    ? "bg-primary/5 border-primary/20 shadow-sm" 
                                                    : "bg-white/40 backdrop-blur-xl border-white/20 hover:bg-white/60 hover:border-black/5"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center transition-colors", isActive ? "border-primary bg-primary" : "border-muted-foreground/30")}>
                                                    {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                                                </div>
                                                <div>
                                                    <div className={cn("font-medium text-lg tracking-tight", isActive ? "text-primary" : "text-foreground")}>{variant.name}</div>
                                                    <div className="text-sm text-muted-foreground font-light">
                                                        {variant.duration} min • {variant.features?.join(', ') || 'Standard Session'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="font-semibold tracking-tight text-lg">€{variant.price}</div>
                                        </Link>
                                    )
                                })}
                                </div>
                            </div>
                        )}

                        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-4xl border border-white/20 shadow-sm">
                            <h3 className="text-lg font-semibold tracking-tight text-foreground mb-4">What to expect</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['Personalized assessment', 'Therapeutic touch', 'Relaxing environment', 'Post-session guidance'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground font-light">
                                        <CheckCircle className="w-4 h-4 text-emerald-500/80" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Card */}
                    <div className="w-full lg:w-105 shrink-0 lg:sticky lg:top-24 animate-in slide-in-from-bottom-12 duration-500 delay-100">
                        <div className="bg-white/60 backdrop-blur-2xl rounded-4xl p-8 border border-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
                            
                            {/* Family / User Selection */}
                            {!loadingUser && userProfile && familyMembers.length > 0 && (
                                <div className="mb-6 p-1 bg-black/5 rounded-full border border-black/5 inline-flex w-full">
                                    <button 
                                        onClick={() => setBookingFor('self')}
                                        className={cn("flex-1 py-1.5 rounded-full text-xs font-semibold transition-all", bookingFor === 'self' ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        Myself
                                    </button>
                                    <button 
                                        onClick={() => setBookingFor('dependent')}
                                            className={cn("flex-1 py-1.5 rounded-full text-xs font-semibold transition-all", bookingFor === 'dependent' ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        Family Member
                                    </button>
                                </div>
                            )}

                             {bookingFor === 'dependent' && (
                                <div className="mb-6">
                                     <Select value={selectedDependentId} onValueChange={setSelectedDependentId}>
                                        <SelectTrigger className="w-full bg-white/50 border-black/5 rounded-xl h-11">
                                            <SelectValue placeholder="Select Member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {familyMembers.map(m => (
                                                <SelectItem key={m.id} value={m.id}>{m.full_name} ({m.relationship})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Contact Details Inputs (if not user or edit needed) */}
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 ml-1">Name</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your Name"
                                        className="w-full h-11 px-4 rounded-xl border border-black/5 bg-white/50 focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/40 text-foreground text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 ml-1">Email</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full h-11 px-4 rounded-xl border border-black/5 bg-white/50 focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/40 text-foreground text-sm"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-linear-to-r from-transparent via-border to-transparent mb-8" />

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-4 flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                    Select Date & Time
                                </h3>
                                
                                <div className="bg-white/40 rounded-2xl p-4 mb-6 border border-white/20 shadow-sm">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={(day) => day < new Date() || day > addDays(new Date(), 90)}
                                        className="rounded-xl border-none w-full flex justify-center bg-transparent pointer-events-auto p-0"
                                        classNames={{
                                            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-md",
                                            day_today: "bg-white/50 text-foreground font-bold",
                                            head_cell: "text-muted-foreground font-medium text-[0.8rem] w-8",
                                            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent h-8 w-8",
                                            day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-full hover:bg-black/5 transition-colors",
                                        }}
                                    />
                                </div>

                                {date && (
                                    <div className="animate-in fade-in slide-in-from-top-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block ml-1">
                                            Available Slots — {format(date, 'MMM do')}
                                        </h4>
                                        {loadingSlots ? (
                                            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="text-sm font-light">Checking availability...</span>
                                            </div>
                                        ) : slots.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                                {slots.map((slot, i) => (
                                                    <button 
                                                        key={i}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={cn(
                                                            "py-2.5 px-3 rounded-xl border text-sm transition-all text-center",
                                                            selectedSlot === slot
                                                                ? "bg-primary text-primary-foreground border-primary shadow-md font-semibold"
                                                                : "bg-white/50 border-transparent text-foreground hover:bg-white hover:shadow-sm font-light type-tabular"
                                                        )}
                                                    >
                                                        {format(new Date(slot.startTime), 'h:mm a')}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-6 text-center bg-white/30 rounded-xl border border-dashed border-black/5">
                                                <p className="text-sm text-muted-foreground font-light">No slots available</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-black/5">
                                {/* Payment Method Selection */}
                                {walletBalance !== null && walletBalance >= depositAmount && (
                                    <div className="bg-white/50 rounded-xl p-1 border border-black/5">
                                        <div className="grid grid-cols-2 gap-1">
                                            <button
                                                onClick={() => setPaymentMethod('stripe')}
                                                className={cn(
                                                    "py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                                                    paymentMethod === 'stripe' ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                Card
                                            </button>
                                            <button
                                                onClick={() => setPaymentMethod('wallet')}
                                                className={cn(
                                                    "py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                                                    paymentMethod === 'wallet' ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                <Wallet className="w-4 h-4" />
                                                Wallet (€{walletBalance})
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-end">
                                    <div className="text-sm text-muted-foreground font-medium">Deposit Due</div>
                                    <div className="text-3xl font-semibold tracking-tight text-foreground">€20<span className="text-lg text-muted-foreground font-light">.00</span></div>
                                </div>
                                
                                <button 
                                    onClick={handleBooking}
                                    disabled={isSubmitting || !selectedSlot || !name || !email}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {paymentMethod === 'wallet' ? 'Pay with Balance' : 'Pay Deposit & Book'}
                                        </>
                                    )}
                                </button>
                                
                                <div className="text-center text-xs text-muted-foreground/60 space-y-1 font-light pt-2">
                                    <p>Free cancellation up to 24 hours before your appointment.</p>
                                    <div className="flex items-center justify-center gap-1.5 opacity-80">
                                        {paymentMethod === 'stripe' ? (
                                            <>
                                                <CreditCard className="w-3 h-3" />
                                                <span>Secure payment via Stripe</span>
                                            </>
                                        ) : (
                                            <>
                                                <Wallet className="w-3 h-3" />
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
