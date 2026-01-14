'use client';

import { Service, ServiceVariant } from '@/types/database';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Clock, CreditCard, CheckCircle, Star, Calendar as CalendarIcon, ArrowRight, User, Users, Loader2 } from 'lucide-react';
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

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
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
              paymentMode: 'deposit',
              depositCents: 2000, // 20 EUR
            }),
          });
    
          const bookingData = await bookingResponse.json();
    
          if (bookingData.error) throw new Error(bookingData.error);
    
          // 2. Initiate Checkout
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
            }),
          });
    
          const checkoutData = await checkoutResponse.json();
    
          if (checkoutData.error) throw new Error(checkoutData.error);
    
          window.location.href = checkoutData.url;
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
                <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group font-medium">
                    <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Services
                </Link>

                <div className="flex flex-col lg:flex-row gap-12 lg:items-start p-2">
                    
                    {/* Left Column: Details */}
                    <div className="flex-1 animate-in slide-in-from-bottom-8 duration-700">
                         {/* Header */}
                         <div className="mb-8">
                            <h1 className="text-4xl lg:text-5xl font-serif text-foreground mb-6 leading-tight">{service.name}</h1>
                            {activeVariant && (
                                <div className="flex items-center gap-3">
                                    <span className="text-lg text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full">{activeVariant.name}</span>
                                    <span className="text-muted-foreground/30">•</span>
                                    <span className="text-lg text-muted-foreground font-medium">{displayDuration} min</span>
                                </div>
                            )}
                        </div>

                        {/* Image */}
                        {(service.images?.[0] || service.image_url) && (
                            <div className="relative rounded-3xl overflow-hidden bg-muted aspect-video mb-10 shadow-lg shadow-black/5">
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
                            <p className="whitespace-pre-line leading-relaxed">{activeVariant?.description || service.description}</p>
                        </div>

                        {/* Variants Selector (if multiple) */}
                        {service.variants && service.variants.length > 1 && (
                            <div className="mb-12">
                                <h3 className="text-xl font-serif text-foreground mb-6 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> 
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
                                                "group flex items-center justify-between p-5 rounded-[24px] border transition-all cursor-pointer",
                                                isActive 
                                                    ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/10" 
                                                    : "bg-card border-border text-foreground hover:border-input"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", isActive ? "border-primary-foreground" : "border-muted-foreground/30")}>
                                                    {isActive && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-lg">{variant.name}</div>
                                                    <div className={cn("text-sm", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                                                        {variant.duration} min • {variant.features?.join(', ') || 'Standard Session'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="font-serif text-xl">€{variant.price}</div>
                                        </Link>
                                    )
                                })}
                                </div>
                            </div>
                        )}

                        <div className="bg-card p-8 rounded-[32px] border border-border shadow-xl shadow-black/5">
                            <h3 className="text-xl font-serif text-foreground mb-4">What to expect</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['Personalized assessment', 'Therapeutic touch', 'Relaxing environment', 'Post-session guidance'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground font-medium">
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Card */}
                    <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-24 animate-in slide-in-from-bottom-12 duration-500 delay-100">
                        <div className="bg-card rounded-[32px] p-8 border border-border shadow-2xl shadow-black/5">
                            
                            {/* Family / User Selection */}
                            {!loadingUser && userProfile && familyMembers.length > 0 && (
                                <div className="mb-6 p-4 bg-muted/50 rounded-2xl border border-border/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Booking For</span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setBookingFor('self')}
                                                className={cn("px-3 py-1 rounded-full text-xs font-bold transition-all", bookingFor === 'self' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
                                            >
                                                Myself
                                            </button>
                                            <button 
                                                onClick={() => setBookingFor('dependent')}
                                                 className={cn("px-3 py-1 rounded-full text-xs font-bold transition-all", bookingFor === 'dependent' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
                                            >
                                                Family
                                            </button>
                                        </div>
                                    </div>
                                    {bookingFor === 'dependent' && (
                                        <Select value={selectedDependentId} onValueChange={setSelectedDependentId}>
                                            <SelectTrigger className="w-full bg-background border-input rounded-xl">
                                                <SelectValue placeholder="Select Member" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {familyMembers.map(m => (
                                                    <SelectItem key={m.id} value={m.id}>{m.full_name} ({m.relationship})</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            )}

                            {/* Contact Details Inputs (if not user or edit needed) */}
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Name</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your Name"
                                        className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Email</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-border mb-8" />

                            <div className="mb-8">
                                <h3 className="text-xl font-serif text-foreground mb-4 flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                                    Select Date & Time
                                </h3>
                                
                                <div className="bg-muted/30 rounded-2xl p-1 mb-6 border border-border/50">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={(day) => day < new Date() || day > addDays(new Date(), 90)}
                                        className="rounded-xl border-none w-full flex justify-center bg-transparent pointer-events-auto"
                                        classNames={{
                                            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                            day_today: "bg-muted text-foreground font-bold",
                                            head_cell: "text-muted-foreground font-medium text-[0.8rem]",
                                            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                        }}
                                    />
                                </div>

                                {date && (
                                    <div className="animate-in fade-in slide-in-from-top-4">
                                        <h4 className="text-sm font-bold text-foreground mb-3 block">
                                            Available Slots for {format(date, 'MMM do')}
                                        </h4>
                                        {loadingSlots ? (
                                            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="text-sm">Finding slots...</span>
                                            </div>
                                        ) : slots.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                                {slots.map((slot, i) => (
                                                    <button 
                                                        key={i}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={cn(
                                                            "py-2.5 px-3 rounded-xl border text-sm font-medium transition-all text-center",
                                                            selectedSlot === slot
                                                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                                : "bg-card border-border text-foreground hover:border-input hover:bg-muted"
                                                        )}
                                                    >
                                                        {format(new Date(slot.startTime), 'h:mm a')}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-6 text-center bg-muted/30 rounded-xl border border-dashed border-border">
                                                <p className="text-sm text-muted-foreground">No availability</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-border">
                                <div className="flex justify-between items-end">
                                    <div className="text-sm text-muted-foreground font-medium">Deposit Due</div>
                                    <div className="text-3xl font-serif text-foreground">€20<span className="text-lg text-muted-foreground">.00</span></div>
                                </div>
                                
                                <button 
                                    onClick={handleBooking}
                                    disabled={isSubmitting || !selectedSlot || !name || !email}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Pay Deposit & Book
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                                
                                <div className="text-center text-xs text-slate-400 space-y-1">
                                    <p>Free cancellation up to 24 hours before your appointment.</p>
                                    <div className="flex items-center justify-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
                                        <CreditCard className="w-3 h-3" />
                                        <span>Secure payment via Stripe</span>
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
