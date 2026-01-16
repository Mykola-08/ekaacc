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
      <div className="w-full md:w-1/3 order-2 md:order-1">
        <Card className="sticky top-24 bg-muted/40 border-muted">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
                Booking Summary
                {viewerCount > 1 && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200/50 flex items-center gap-1.5 text-xs py-0.5 font-normal animate-pulse">
                        <Users className="w-3 h-3" />
                        {viewerCount} viewing
                    </Badge>
                )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedVariant?.name || "Standard Session"}</p>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span>{duration} mins</span>
            </div>
             <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span>{date ? date.toLocaleDateString() : "-"}</span>
            </div>
             <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time</span>
              <span>{selectedTime || "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>€{price}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Wizard */}
      <div className="w-full md:w-2/3 order-1 md:order-2">
                 <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => step !== 'time' ? handleBack() : router.back()} className="mb-4 pl-0 hover:pl-0">
                 <ArrowLeft className="w-4 h-4 mr-2"/> {step === 'time' ? "Back to Service" : "Back"}
            </Button>
            <h1 className="text-3xl font-serif font-medium">
                {step === 'time' && "Select a Time"}
                {step === 'addons' && "Enhance Your Session"}
                {step === 'details' && "Your Details"}
                {step === 'payment' && "Last Step"}
            </h1>
         </div>

         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {step === "time" && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="border rounded-xl p-4">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md w-full flex justify-center"
                            disabled={(date) => date < new Date() || date.getDay() === 0}
                        />
                    </div>
                    <div className="space-y-4">
                        <Label>Available Slots</Label>
                        {loadingSlots ? (
                             <div className="flex items-center justify-center py-8 text-muted-foreground">
                                 <Loader2 className="w-6 h-6 animate-spin mr-2" />
                             </div>
                        ) : timeSlots.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {timeSlots.map((time) => (
                                    <Button
                                        key={time}
                                        variant={selectedTime === time ? "default" : "outline"}
                                        className={selectedTime === time ? "bg-foreground hover:bg-foreground/90" : ""}
                                        onClick={() => handleTimeSelect(time)}
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                             <div className="py-8 text-center text-muted-foreground text-sm border rounded-lg bg-muted/20">
                                 No slots available for this date.
                             </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-4">
                            All times are in local time.
                        </p>
                    </div>
                </div>
            )}
            
            {step === "addons" && (
                 <div className="grid gap-4">
                     {/* Placeholder for Addons based on spec */}
                     <Card className="cursor-pointer hover:border-primary transition-colors border-dashed bg-muted/20">
                         <CardContent className="flex items-center justify-between p-6">
                             <div>
                                 <h3 className="font-medium">Aromatherapy</h3>
                                 <p className="text-sm text-muted-foreground">Add essential oils for relaxation.</p>
                             </div>
                             <div className="flex items-center gap-4">
                                 <span className="text-sm font-medium">+€10</span>
                                 <Button variant="outline" size="sm" disabled>Unavailable</Button>
                             </div>
                         </CardContent>
                     </Card>
                     
                     <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                         <p>More enhancements coming soon.</p>
                     </div>
                 </div>
            )}

            {step === "details" && (
                <Tabs defaultValue="guest" value={user ? "guest" : undefined} className="w-full">
                    {!user && (
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="guest">Guest Checkout</TabsTrigger>
                            <TabsTrigger value="login">Sign In</TabsTrigger>
                        </TabsList>
                    )}
                    
                    <TabsContent value="guest" className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input id="firstName" placeholder="Jane" disabled={!!user} defaultValue={user?.user_metadata?.first_name} value={formData.firstName} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input id="lastName" placeholder="Doe" disabled={!!user} defaultValue={user?.user_metadata?.last_name} value={formData.lastName} onChange={handleInputChange} />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="jane@example.com" disabled={!!user} defaultValue={user?.email} value={formData.email} onChange={handleInputChange} />
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" type="tel" placeholder="+1234567890" value={formData.phone} onChange={handleInputChange} />
                         </div>
                         
                         {!user && (
                             <div className="flex items-center space-x-2 pt-4 border-t">
                                <Checkbox 
                                    id="createAccount" 
                                    checked={formData.createAccount}
                                    onCheckedChange={(checked) => setFormData({...formData, createAccount: checked as boolean})}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="createAccount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                            <div className="text-center py-8 space-y-4">
                                <p className="text-muted-foreground">Already have an account? Sign in to use your saved details and points.</p>
                                <Button variant="outline" asChild>
                                    <Link href={`/login?returnTo=/book/${service.id}`}>Sign In</Link>
                                </Button>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
            )}

             {step === "payment" && (
                <div className="space-y-6">
                    <div className="border rounded-xl p-6 bg-card">
                       <h3 className="font-semibold mb-4 flex items-center gap-2">
                           <CreditCard className="w-5 h-5 text-blue-600" />
                           Payment Method
                       </h3>
                       <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                           <TabsList className="w-full grid grid-cols-2">
                               <TabsTrigger value="stripe">Card / Apple Pay</TabsTrigger>
                               <TabsTrigger value="wallet" disabled={!user}>
                                   Wallet {walletBalance !== null && `(€${walletBalance})`}
                               </TabsTrigger>
                           </TabsList>
                           <TabsContent value="stripe" className="pt-6 space-y-4">
                                <div className="space-y-4">
                                    <Input placeholder="Card number" />
                                    <div className="grid grid-cols-3 gap-4">
                                        <Input placeholder="MM/YY" />
                                        <Input placeholder="CVC" />
                                        <Input placeholder="Zip" />
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center">
                                        Transactions secured by Stripe. No payment taken until confirmation.
                                    </p>
                                </div>
                           </TabsContent>
                           <TabsContent value="wallet" className="pt-6">
                               {user ? (
                                   walletBalance !== null && walletBalance >= price ? (
                                       <div className="text-center space-y-4 py-4">
                                           <div className="bg-green-500/10 text-green-600 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                                               <CheckCircle2 className="w-6 h-6" />
                                           </div>
                                           <div>
                                               <p className="font-medium">Sufficient Balance</p>
                                               <p className="text-sm text-muted-foreground">
                                                   €{price} will be deducted from your €{walletBalance} balance.
                                               </p>
                                           </div>
                                       </div>
                                   ) : (
                                       <div className="text-center space-y-4 py-4">
                                           <div className="bg-amber-500/10 text-amber-600 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                                               <CreditCard className="w-6 h-6" />
                                           </div>
                                           <div>
                                               <p className="font-medium">Insufficient Balance</p>
                                               <p className="text-sm text-muted-foreground mb-4">
                                                   Your balance is €{walletBalance}. You need €{price}.
                                               </p>
                                               <Button variant="outline" asChild>
                                                   <Link href="/wallet/top-up" target="_blank">Top Up Wallet</Link>
                                               </Button>
                                           </div>
                                       </div>
                                   )
                               ) : (
                                   <div className="text-center py-8">
                                       <p>Please sign in to use Wallet.</p>
                                   </div>
                               )}
                           </TabsContent>
                       </Tabs>
                    </div>

                    <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                        <p>I agree to the cancellation policy (24h notice required).</p>
                    </div>
                </div>
            )}


            <div className="flex justify-between pt-8 border-t">
                 {step !== 'time' && (
                     <Button variant="ghost" onClick={() => setStep(step === 'payment' ? 'details' : 'time')}>
                         Back
                     </Button>
                 )}
                 <div className="ml-auto">
                    {step === 'payment' ? (
                        <Button size="lg" className="px-8" onClick={handleBooking} disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
                            Confirm Booking
                        </Button>
                    ) : (
                        <Button size="lg" className="px-8" onClick={handleNext}>
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
