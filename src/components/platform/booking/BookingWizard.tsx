"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types/platform/database";
import { Button } from "@/components/platform/ui/button";
import { Calendar } from "@/components/platform/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/platform/ui/card";
import { Label } from "@/components/platform/ui/label";
import { Input } from "@/components/platform/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/platform/ui/tabs";
import { Separator } from "@/components/platform/ui/separator";
import { Badge } from "@/components/platform/ui/badge";
import { Checkbox } from "@/components/platform/ui/checkbox";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
    ArrowLeft01Icon, 
    Loading03Icon, 
    Tick02Icon, 
    CreditCardIcon, 
    UserGroupIcon,
    SparklesIcon 
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { createNewBookingAction, getAvailableSlotsAction } from "@/app/actions/booking-actions";
import { createClient } from "@/lib/supabase/client";

interface BookingWizardProps {
    service: Service;
    variantId?: string;
}

export function BookingWizard({ service, variantId }: BookingWizardProps) {
    const router = useRouter();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [step, setStep] = useState<"time" | "addons" | "details" | "payment">("time");
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState<any>(null);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        createAccount: false
    });

    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wallet'>('stripe');

    const selectedVariant = service.variants?.find(v => v.id === variantId) || service.variants?.[0];
    const price = selectedVariant ? selectedVariant.price : service.price;
    const duration = selectedVariant ? selectedVariant.duration : service.duration;

    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('auth_id', user.id)
                    .single();

                if (profile) {
                    const { data: wallet } = await supabase
                        .from('wallets')
                        .select('balance_cents')
                        .eq('profile_id', profile.id)
                        .single();
                    if (wallet) setWalletBalance(wallet.balance_cents / 100);
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

            const res = await createNewBookingAction({
                serviceId: service.id,
                startTime: startTime,
                email: user ? user.email : formData.email,
                displayName: `${formData.firstName} ${formData.lastName}`.trim(),
                userId: user?.id
            });

            if (res.success) {
                toast.success("Booking confirmed!");
                router.push("/dashboard/bookings");
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
        <div className="container max-w-6xl py-12 px-4 md:px-6 flex flex-col lg:flex-row gap-10">
            {/* Summary Sidebar */}
            <div className="w-full lg:w-96 order-2 lg:order-1">
                <Card className="sticky top-24 bg-card/40 backdrop-blur-xl border border-border/50 shadow-2xl rounded-[36px] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-bold tracking-tight">Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        <div className="p-6 rounded-[24px] bg-secondary/30">
                            <h3 className="font-bold text-foreground text-lg mb-1">{service.name}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{selectedVariant?.name || "Standard Session"}</p>
                        </div>
                        
                        <div className="space-y-4 px-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Duration</span>
                                <span className="font-bold">{duration} mins</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Date</span>
                                <span className="font-bold">{date ? date.toLocaleDateString() : "-"}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Time</span>
                                <span className="font-bold">{selectedTime || "-"}</span>
                            </div>
                        </div>

                        <Separator className="bg-border/30" />
                        <div className="flex justify-between items-end p-2">
                            <span className="font-bold text-muted-foreground">Total</span>
                            <span className="text-3xl font-black tracking-tighter text-primary">€{price}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Wizard Area */}
            <div className="flex-1 order-1 lg:order-2">
                <div className="mb-10">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => step !== 'time' ? handleBack() : router.back()} 
                        className="mb-8 rounded-full hover:bg-secondary group transition-all"
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                    </Button>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => {
                                const active = (step === 'time' && i === 1) || (step === 'addons' && i === 2) || (step === 'details' && i === 3) || (step === 'payment' && i === 4);
                                const completed = (step === 'addons' && i < 2) || (step === 'details' && i < 3) || (step === 'payment' && i < 4);
                                return (
                                    <div 
                                        key={i} 
                                        className={cn(
                                            "w-8 h-8 rounded-full border-4 border-background flex items-center justify-center text-xs font-bold transition-all",
                                            active ? "bg-primary text-white scale-110 z-10" : completed ? "bg-emerald-500 text-white" : "bg-secondary text-muted-foreground"
                                        )}
                                    >
                                        {completed ? <HugeiconsIcon icon={Tick02Icon} className="w-3.5 h-3.5" /> : i}
                                    </div>
                                )
                            })}
                        </div>
                        <h1 className="text-5xl font-black tracking-tight text-foreground">
                            {step === 'time' && "Select a Time"}
                            {step === 'addons' && "Enhance Session"}
                            {step === 'details' && "Your Details"}
                            {step === 'payment' && "Finalize"}
                        </h1>
                    </div>
                </div>

                <div className="space-y-10">
                    {step === "time" && (
                        <div className="grid md:grid-cols-2 gap-10">
                            <Card className="rounded-[36px] p-8 bg-card/30 backdrop-blur-sm border-border/40 shadow-xl overflow-hidden">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="w-full flex justify-center !p-0"
                                    disabled={(date) => date < new Date() || date.getDay() === 0}
                                />
                            </Card>
                            <div className="space-y-6">
                                <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-2">Available Slots</Label>
                                {loadingSlots ? (
                                    <div className="flex flex-col items-center justify-center py-20 bg-card/20 rounded-[36px] border border-dashed border-border/50">
                                        <HugeiconsIcon icon={Loading03Icon} className="w-10 h-10 animate-spin text-primary opacity-50" />
                                        <p className="mt-4 text-sm font-medium text-muted-foreground">Checking schedule...</p>
                                    </div>
                                ) : timeSlots.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {timeSlots.map((time) => (
                                            <Button
                                                key={time}
                                                variant={selectedTime === time ? "default" : "outline"}
                                                onClick={() => handleTimeSelect(time)}
                                                className={cn(
                                                    "h-14 rounded-2xl text-base transition-all",
                                                    selectedTime === time 
                                                        ? "bg-primary text-white font-bold shadow-xl shadow-primary/20 scale-[1.02]" 
                                                        : "bg-white dark:bg-card border-border/50 hover:bg-secondary font-semibold"
                                                )}
                                            >
                                                {time}
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center rounded-[36px] bg-secondary/20 border border-dashed border-border/50">
                                        <p className="font-bold text-muted-foreground">No sessions available on this day.</p>
                                        <p className="text-sm text-muted-foreground/60 mt-1">Please try another date.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === "addons" && (
                        <div className="grid gap-6">
                            <div 
                                className="group relative p-8 rounded-[36px] bg-card/40 border-2 border-dashed border-border/50 hover:border-primary/50 transition-all cursor-not-allowed opacity-60 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <Badge variant="secondary" className="rounded-full px-4 py-1 font-bold">Coming Soon</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <HugeiconsIcon icon={SparklesIcon} className="w-7 h-7 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-foreground">Aromatherapy</h3>
                                            <p className="text-sm text-muted-foreground font-medium">Add essential oils for deep relaxation.</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-black text-primary">+€10</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "details" && (
                        <Card className="rounded-[36px] p-10 bg-card/30 backdrop-blur-sm border-border/40 shadow-xl space-y-8">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <Label htmlFor="firstName" className="font-bold ml-1">First Name</Label>
                                    <Input id="firstName" disabled={!!user} value={user ? user.user_metadata?.first_name : formData.firstName} onChange={handleInputChange} className="h-14 rounded-2xl bg-secondary/30 border-none px-6 focus:ring-2 focus:ring-primary shadow-inner" />
                                </div>
                                <div className="space-y-2.5">
                                    <Label htmlFor="lastName" className="font-bold ml-1">Last Name</Label>
                                    <Input id="lastName" disabled={!!user} value={user ? user.user_metadata?.last_name : formData.lastName} onChange={handleInputChange} className="h-14 rounded-2xl bg-secondary/30 border-none px-6 focus:ring-2 focus:ring-primary shadow-inner" />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="email" className="font-bold ml-1">Email Address</Label>
                                <Input id="email" disabled={!!user} value={user ? user.email : formData.email} onChange={handleInputChange} className="h-14 rounded-2xl bg-secondary/30 border-none px-6 focus:ring-2 focus:ring-primary shadow-inner" />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="phone" className="font-bold ml-1">Phone Number</Label>
                                <Input id="phone" value={formData.phone} onChange={handleInputChange} className="h-14 rounded-2xl bg-secondary/30 border-none px-6 focus:ring-2 focus:ring-primary shadow-inner" placeholder="+353 ..." />
                            </div>
                        </Card>
                    )}

                    {step === "payment" && (
                        <Card className="rounded-[36px] p-10 bg-card/30 backdrop-blur-sm border-border/40 shadow-xl space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <HugeiconsIcon icon={CreditCardIcon} className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="font-black text-2xl tracking-tight">Payment Method</h3>
                            </div>
                            
                            <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                                <TabsList className="w-full grid grid-cols-2 p-1.5 bg-secondary/30 rounded-full h-16 border border-border/50">
                                    <TabsTrigger value="stripe" className="rounded-full h-13 data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:shadow-xl font-bold transition-all">Card / Mobile</TabsTrigger>
                                    <TabsTrigger value="wallet" disabled={!user} className="rounded-full h-13 data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:shadow-xl font-bold transition-all">My Wallet</TabsTrigger>
                                </TabsList>
                                <TabsContent value="stripe" className="pt-10">
                                    <div className="p-8 rounded-[28px] bg-secondary/20 border border-border/50 text-center space-y-4">
                                        <p className="text-sm font-bold text-muted-foreground">Secured encrypted payment via Stripe.</p>
                                        <div className="flex justify-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all">
                                            {/* Could add card brand icons here */}
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="wallet" className="pt-10">
                                    <div className="p-8 rounded-[28px] bg-primary/5 border-2 border-primary/20 flex flex-col items-center gap-2">
                                        <p className="text-sm font-bold text-primary/70 uppercase tracking-widest">Available Balance</p>
                                        <p className="text-4xl font-black text-primary">€{walletBalance || 0}</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </Card>
                    )}

                    <div className="flex items-center justify-between pt-10">
                        {step !== 'time' ? (
                            <Button 
                                variant="ghost" 
                                onClick={handleBack} 
                                className="h-14 px-10 rounded-full font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                            >
                                Previous
                            </Button>
                        ) : <div />}
                        
                        <Button 
                            size="lg" 
                            disabled={loading}
                            onClick={step === 'payment' ? handleBooking : handleNext} 
                            className="h-16 px-12 rounded-full font-black text-lg bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                        >
                            {loading ? (
                                <HugeiconsIcon icon={Loading03Icon} className="w-6 h-6 animate-spin mr-3" />
                            ) : null}
                            {step === 'payment' ? "Finalize Booking" : "Continue"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
