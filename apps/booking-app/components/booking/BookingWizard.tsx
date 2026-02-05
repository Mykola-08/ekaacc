"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, CheckCircle2, CreditCard } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BookingWizardProps {
  service: Service;
  variantId?: string;
}

import { createNewBookingAction, getAvailableSlotsAction } from "@/server/actions/booking-actions";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { usePresence } from "@/hooks/usePresence";
import { useBookingRealtime } from "@/hooks/useBookingRealtime";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export function BookingWizard({ service, variantId }: BookingWizardProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [step, setStep] = useState<"time" | "addons" | "details" | "payment">("time");
  const [loading, setLoading] = useState(false);
  
  // User State
  const [user, setUser] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      createAccount: false
  });

  // Slot State
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wallet'>('stripe');

  const selectedVariant = service.variants?.find(v => v.id === variantId) || service.variants?.[0];
  const price = selectedVariant ? selectedVariant.price : service.price;
  const duration = selectedVariant ? selectedVariant.duration : service.duration;

  // Realtime Presence: Show how many people are viewing this service
  // Scope room by serviceId
  const { onlineUsers } = usePresence({ 
      roomName: `booking_view:${service.id}`, 
      user: user ? { ...user, viewing_at: new Date().toISOString() } : { id: 'anon-' + Math.random(), viewing_at: new Date().toISOString() }
  });
  const viewerCount = onlineUsers.length;

  // Realtime Slots: Refetch slots if a new booking comes in for this service
  useBookingRealtime((payload) => {
      // Only care about new bookings that might eat up a slot
      if (payload.eventType === 'INSERT' && payload.new.service_id === service.id) {
          // If the booking is on the currently selected date, refresh slots
          if (date) {
            const bookingDate = new Date(payload.new.start_time);
             if (format(bookingDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')) {
                toast.info("Someone just booked a slot. Refreshing availability...");
                fetchSlots();
             }
          }
      }
  });

  // Fetch User & Wallet
  useEffect(() => {
      const init = async () => {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
              setUser(user);
              // In real app, fetch profile then wallet. keeping simple for UI demo.
               const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('auth_id', user.id)
                .single();
               
               if(profile) {
                   const { data: wallet } = await supabase
                    .from('wallets')
                    .select('balance_cents')
                    .eq('profile_id', profile.id)
                    .single();
                   if(wallet) setWalletBalance(wallet.balance_cents / 100);
               }
          }
      };
      init();
  }, []);

  const fetchSlots = async () => {
    if (!date) return;
    setLoadingSlots(true);
    setTimeSlots([]);
    setSelectedTime(null);
    
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const res = await getAvailableSlotsAction(service.id, dateStr, variantId);
      
      if (res.success && res.data?.slots) {
            const formatted = res.data.slots.map((s: any) => format(new Date(s.startTime), 'HH:mm'));
            setTimeSlots([...new Set(formatted)] as string[]);
      }
    } catch (e) {
      console.error("Error fetching slots", e);
      toast.error("Could not load availability");
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [date, service.id, variantId]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleNext = () => {
    if (step === "time") {
      if (!date || !selectedTime) {
        toast.error("Please select a date and time");
        return;
      }
      setStep("addons");
    } else if (step === "addons") {
        setStep("details");
    } else if (step === "details") {
      if (!user && (!formData.firstName || !formData.lastName || !formData.email)) {
          toast.error("Please fill in required details");
          return;
      }
      setStep("payment");
    }
  };
  
  const handleBack = () => {
      if (step === 'payment') setStep('details');
      else if (step === 'details') setStep('addons');
      else if (step === 'addons') setStep('time');
  };

  const handleBooking = async () => {
      setLoading(true);
      
      try {
        if (!date || !selectedTime) throw new Error("Missing time");

        const [hours = 0, mins = 0] = selectedTime.split(':').map(Number);
        const startTime = new Date(date);
        startTime.setHours(hours, mins, 0, 0);
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + duration);

        const res = await createNewBookingAction({
            serviceId: service.id,
            variantId: variantId,
            startTime: startTime,
            endTime: endTime,
            email: user ? user.email : formData.email,
            firstName: formData.firstName, // If user, these might be empty if we didn't fetch profile fully here, but action handles user ID lookup?
            lastName: formData.lastName,   // Actually action expects these. If user is logged in, we should probably pre-fill them in state.
            phone: formData.phone,
            priceCents: price * 100, 
            paymentMode: paymentMethod,
            userId: user?.id
        });

        if (res.success) {
             toast.success("Booking confirmed!");
             router.push("/bookings"); 
        } else {
             toast.error("Booking failed: " + res.error);
        }
      } catch (err) {
          toast.error("An error occurred");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="container max-w-5xl py-12 px-4 md:px-6 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Summary */}
      <div className="w-full md:w-1/3 order-2 md:order-1 animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="bg-white rounded-2xl border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden sticky top-24">
          <div className="relative h-48 bg-card">
            {/* Image Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
              <Users className="w-16 h-16" strokeWidth={1} />
            </div>
             {/* Live Viewers Badge */}
             {viewerCount > 1 && (
                 <div className="absolute top-4 right-4 animate-pulse">
                     <Badge variant="secondary" className="bg-background/80 backdrop-blur shadow-sm text-destructive border-transparent">
                        <Users className="w-3 h-3 mr-1" />
                        {viewerCount} booking now
                     </Badge>
                 </div>
             )}
          </div>
          
          <div className="p-8 space-y-6">
            <div>
               <h2 className="font-bold text-2xl text-foreground mb-2">{service.name}</h2>
               <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Duration</span>
                  <span className="text-foreground font-semibold">{duration} mins</span>
                </div>
                 <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Date</span>
                  <span className="text-foreground font-semibold">{date ? date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : "Select date"}</span>
                </div>
                 <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Time</span>
                  <span className="text-foreground font-semibold">{selectedTime || "Select time"}</span>
                </div>
            </div>

            <div className="pt-6 border-t border-border">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-lg text-foreground">Total</span>
                  <span className="font-bold text-3xl text-foreground">€{price}</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Wizard */}
      <div className="w-full md:w-2/3 order-1 md:order-2">
                 <div className="mb-8">
            <Button variant="ghost" size="sm" onClick={() => step !== 'time' ? handleBack() : router.back()} className="mb-4 pl-0 hover:pl-0 text-muted-foreground hover:text-foreground">
                 <ArrowLeft className="w-4 h-4 mr-2"/> {step === 'time' ? "Back to Service" : "Back"}
            </Button>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {step === 'time' && "Select a Time"}
                {step === 'addons' && "Enhance Your Session"}
                {step === 'details' && "Your Details"}
                {step === 'payment' && "Last Step"}
            </h1>
         </div>

         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {step === "time" && (
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="w-full flex justify-center"
                            disabled={(date) => date < new Date() || date.getDay() === 0}
                        />
                    </div>
                    <div className="space-y-6">
                        <Label className="text-foreground font-bold text-lg">Available Slots</Label>
                        {loadingSlots ? (
                             <div className="flex items-center justify-center py-12 text-muted-foreground">
                                 <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                 Looking for slots...
                             </div>
                        ) : timeSlots.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {timeSlots.map((time) => (
                                    <Button
                                        key={time}
                                        variant="outline"
                                        className={cn(
                                            "h-12 rounded-lg border-2 font-semibold transition-all",
                                            selectedTime === time 
                                                ? "bg-foreground text-background border-foreground hover:bg-foreground/90 transform scale-[1.02] shadow-md" 
                                                : "bg-card border-border text-foreground hover:border-muted hover:bg-secondary"
                                        )}
                                        onClick={() => handleTimeSelect(time)}
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                             <div className="py-12 text-center bg-secondary rounded-xl border border-border">
                                 <p className="text-muted-foreground font-medium">No slots available for this date.</p>
                                 <p className="text-xs text-muted-foreground mt-2">Try selecting another day.</p>
                             </div>
                        )}
                        <p className="text-xs text-muted-foreground text-center font-medium">
                            All times are in local time.
                        </p>
                    </div>
                </div>
            )}
            
            {step === "addons" && (
                 <div className="grid gap-4">
                     {/* Placeholder usage */}
                     <div className="group cursor-pointer bg-card hover:bg-secondary transition-colors border-2 border-dashed border-muted hover:border-foreground rounded-xl p-6 flex items-center justify-between">
                         <div>
                             <h3 className="font-bold text-foreground">Aromatherapy</h3>
                             <p className="text-sm text-muted-foreground">Add essential oils for relaxation.</p>
                         </div>
                         <div className="flex items-center gap-4">
                             <span className="text-sm font-bold text-foreground">+€10</span>
                             <Button variant="secondary" size="sm" className="rounded-full" disabled>Unavailable</Button>
                         </div>
                     </div>
                     
                     <div className="p-6 bg-primary/5 rounded-xl text-sm text-primary font-medium text-center">
                         <p>More enhancements coming soon.</p>
                     </div>
                 </div>
            )}

            {step === "details" && (
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <Tabs defaultValue="guest" value={user ? "guest" : undefined} className="w-full">
                    {!user && (
                        <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-secondary rounded-full h-12">
                            <TabsTrigger value="guest" className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground font-semibold">Guest Checkout</TabsTrigger>
                            <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground font-semibold">Sign In</TabsTrigger>
                        </TabsList>
                    )}
                    
                    <TabsContent value="guest" className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="font-bold text-foreground">First name</Label>
                                <Input 
                                    id="firstName" 
                                    className="rounded-lg bg-secondary border-transparent focus:bg-background transition-all h-12 text-foreground placeholder:text-muted-foreground"
                                    placeholder="Jane" 
                                    disabled={!!user} 
                                    defaultValue={user?.user_metadata?.first_name} 
                                    value={formData.firstName} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="font-bold text-foreground">Last name</Label>
                                <Input 
                                    id="lastName" 
                                    className="rounded-lg bg-secondary border-transparent focus:bg-background transition-all h-12 text-foreground placeholder:text-muted-foreground"
                                    placeholder="Doe" 
                                    disabled={!!user} 
                                    defaultValue={user?.user_metadata?.last_name} 
                                    value={formData.lastName} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="email" className="font-bold text-foreground">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                className="rounded-lg bg-secondary border-transparent focus:bg-background transition-all h-12 text-foreground placeholder:text-muted-foreground"
                                placeholder="jane@example.com" 
                                disabled={!!user} 
                                defaultValue={user?.email} 
                                value={formData.email} 
                                onChange={handleInputChange} 
                            />
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone" className="font-bold text-foreground">Phone</Label>
                            <Input 
                                id="phone" 
                                type="tel" 
                                className="rounded-lg bg-secondary border-transparent focus:bg-background transition-all h-12 text-foreground placeholder:text-muted-foreground"
                                placeholder="+1234567890" 
                                value={formData.phone} 
                                onChange={handleInputChange} 
                            />
                         </div>
                         
                         {!user && (
                             <div className="flex items-center space-x-3 pt-6 border-t border-border">
                                <Checkbox 
                                    id="createAccount" 
                                    checked={formData.createAccount}
                                    onCheckedChange={(checked) => setFormData({...formData, createAccount: checked as boolean})}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="createAccount" className="text-sm font-bold text-foreground cursor-pointer">
                                        Create an account for easier booking next time
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        We'll email you a link to set your password.
                                    </p>
                                </div>
                             </div>
                         )}
                    </TabsContent>
                    
                    {!user && (
                        <TabsContent value="login">
                            <div className="text-center py-12 space-y-6">
                                <p className="text-muted-foreground max-w-xs mx-auto">Already have an account? Sign in to use your saved details and points.</p>
                                <Button variant="outline" asChild className="rounded-full h-12 px-8 border-2 hover:bg-transparent font-bold">
                                    <Link href={`/login?returnTo=/book/${service.id}`}>Sign In</Link>
                                </Button>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
                </div>
            )}

             {step === "payment" && (
                <div className="space-y-6">
                    <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                       <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-foreground">
                           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                               <CreditCard className="w-5 h-5" />
                           </div>
                           Payment Method
                       </h3>
                       <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                           <TabsList className="w-full grid grid-cols-2 p-1 bg-secondary rounded-full h-12 mb-8">
                               <TabsTrigger value="stripe" className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground font-semibold">Card / Apple Pay</TabsTrigger>
                               <TabsTrigger value="wallet" disabled={!user} className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground font-semibold">
                                   Wallet {walletBalance !== null && `(€${walletBalance})`}
                               </TabsTrigger>
                           </TabsList>
                           <TabsContent value="stripe" className="space-y-6">
                                <div className="space-y-4">
                                    <Input className="rounded-lg bg-secondary border-transparent focus:bg-background h-12 text-foreground placeholder:text-muted-foreground" placeholder="Card number" />
                                    <div className="grid grid-cols-3 gap-4">
                                        <Input className="rounded-lg bg-secondary border-transparent focus:bg-background h-12 text-foreground placeholder:text-muted-foreground" placeholder="MM/YY" />
                                        <Input className="rounded-lg bg-secondary border-transparent focus:bg-background h-12 text-foreground placeholder:text-muted-foreground" placeholder="CVC" />
                                        <Input className="rounded-lg bg-secondary border-transparent focus:bg-background h-12 text-foreground placeholder:text-muted-foreground" placeholder="Zip" />
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center mt-4">
                                        Transactions secured by Stripe. No payment taken until confirmation.
                                    </p>
                                </div>
                           </TabsContent>
                           <TabsContent value="wallet" className="">
                               {user ? (
                                   walletBalance !== null && walletBalance >= price ? (
                                       <div className="text-center space-y-4 py-4">
                                           <div className="bg-emerald-500/10 text-emerald-600 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                                               <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
                                           </div>
                                           <div>
                                               <p className="font-bold text-foreground text-lg">Sufficient Balance</p>
                                               <p className="text-sm text-muted-foreground">
                                                   €{price} will be deducted from your €{walletBalance} balance.
                                               </p>
                                           </div>
                                       </div>
                                   ) : (
                                       <div className="text-center space-y-6 py-4">
                                           <div className="bg-amber-500/10 text-amber-600 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                                               <CreditCard className="w-8 h-8" strokeWidth={3} />
                                           </div>
                                           <div>
                                               <p className="font-bold text-foreground text-lg">Insufficient Balance</p>
                                               <p className="text-sm text-muted-foreground mb-6">
                                                   Your balance is €{walletBalance}. You need €{price}.
                                               </p>
                                               <Button variant="outline" asChild className="rounded-full font-bold border-2">
                                                   <Link href="/wallet/top-up" target="_blank">Top Up Wallet</Link>
                                               </Button>
                                           </div>
                                       </div>
                                   )
                               ) : (
                                   <div className="text-center py-8">
                                       <p className="text-muted-foreground">Please sign in to use Wallet.</p>
                                   </div>
                               )}
                           </TabsContent>
                       </Tabs>
                    </div>

                    <div className="flex items-start space-x-3 text-sm text-muted-foreground px-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={2.5} />
                        <p className="font-medium">I agree to the cancellation policy (24h notice required).</p>
                    </div>
                </div>
            )}


            <div className="flex justify-between pt-8 border-t border-border">
                 {step !== 'time' && (
                     <Button variant="ghost" onClick={() => setStep(step === 'payment' ? 'details' : 'time')} className="text-muted-foreground hover:text-foreground hover:bg-transparent pl-0">
                         Back
                     </Button>
                 )}
                 <div className="ml-auto">
                    {step === 'payment' ? (
                        <Button size="lg" className="px-10 h-14 rounded-full font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all" onClick={handleBooking} disabled={loading}>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2"/> : null}
                            Confirm Booking
                        </Button>
                    ) : (
                        <Button size="lg" className="px-10 h-14 rounded-full font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all" onClick={handleNext}>
                            Next Step
                        </Button>
                    )}
                 </div>
            </div>
         </div>
      </div>
    </div>
  );
}
