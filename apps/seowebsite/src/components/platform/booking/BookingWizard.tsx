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
import { ArrowLeft, Loader2, CheckCircle2, CreditCard, Users } from "lucide-react";
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
        <div className="container max-w-5xl py-12 px-4 md:px-6 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 order-2 md:order-1">
                <Card className="sticky top-24 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
                    <CardHeader className="relative">
                        <CardTitle className="text-xl font-bold">Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 relative">
                        <div>
                            <h3 className="font-bold text-foreground text-lg">{service.name}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{selectedVariant?.name || "Standard Session"}</p>
                        </div>
                        <Separator className="bg-border/50" />
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-muted-foreground">Duration</span>
                            <span className="font-semibold">{duration} mins</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-semibold">{date ? date.toLocaleDateString() : "-"}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-muted-foreground">Time</span>
                            <span className="font-semibold">{selectedTime || "-"}</span>
                        </div>
                        <Separator className="bg-border/50" />
                        <div className="flex justify-between font-bold text-xl">
                            <span>Total</span>
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">€{price}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="w-full md:w-2/3 order-1 md:order-2">
                <div className="mb-8">
                    <Button variant="ghost" size="sm" onClick={() => step !== 'time' ? handleBack() : router.back()} className="mb-6 pl-0 hover:bg-transparent hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {step === 'time' && "Select a Time"}
                        {step === 'addons' && "Enhance Your Session"}
                        {step === 'details' && "Your Details"}
                        {step === 'payment' && "Last Step"}
                    </h1>
                </div>

                <div className="space-y-8">
                    {step === "time" && (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="border-0 rounded-3xl p-6 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm shadow-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 pointer-events-none" />
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md w-full flex justify-center relative"
                                    disabled={(date) => date < new Date() || date.getDay() === 0}
                                />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-sm font-bold ml-1 text-foreground">Available Slots</Label>
                                {loadingSlots ? (
                                    <div className="flex items-center justify-center py-8 bg-card/50 backdrop-blur-sm rounded-3xl border-0">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse" />
                                            <Loader2 className="relative w-8 h-8 animate-spin text-blue-600" />
                                        </div>
                                    </div>
                                ) : timeSlots.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {timeSlots.map((time) => (
                                            <Button
                                                key={time}
                                                variant={selectedTime === time ? "default" : "outline"}
                                                onClick={() => handleTimeSelect(time)}
                                                className={selectedTime === time ? "rounded-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg" : "rounded-full h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 font-medium"}
                                            >
                                                {time}
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground text-sm border-0 rounded-3xl bg-card/50 backdrop-blur-sm shadow-lg">
                                        <p className="font-medium">No slots available for this date.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === "addons" && (
                        <div className="grid gap-4">
                            <Card className="cursor-pointer hover:border-primary/30 transition-all duration-300 border-dashed border-border/30 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none" />
                                <CardContent className="flex items-center justify-between p-8 relative">
                                    <div>
                                        <h3 className="font-bold text-lg">Aromatherapy</h3>
                                        <p className="text-sm text-muted-foreground font-medium">Add essential oils for relaxation.</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold">+€10</span>
                                        <Button variant="outline" size="sm" disabled className="rounded-full border-border/50">Coming Soon</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {step === "details" && (
                        <div className="space-y-6 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-0 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 pointer-events-none" />
                            <div className="grid grid-cols-2 gap-4 relative">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="font-semibold">First name</Label>
                                    <Input id="firstName" disabled={!!user} value={user ? user.user_metadata?.first_name : formData.firstName} onChange={handleInputChange} className="h-12 rounded-xl border-border/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="font-semibold">Last name</Label>
                                    <Input id="lastName" disabled={!!user} value={user ? user.user_metadata?.last_name : formData.lastName} onChange={handleInputChange} className="h-12 rounded-xl border-border/50" />
                                </div>
                            </div>
                            <div className="space-y-2 relative">
                                <Label htmlFor="email" className="font-semibold">Email</Label>
                                <Input id="email" disabled={!!user} value={user ? user.email : formData.email} onChange={handleInputChange} className="h-12 rounded-xl border-border/50" />
                            </div>
                            <div className="space-y-2 relative">
                                <Label htmlFor="phone" className="font-semibold">Phone</Label>
                                <Input id="phone" value={formData.phone} onChange={handleInputChange} className="h-12 rounded-xl border-border/50" />
                            </div>
                        </div>
                    )}

                    {step === "payment" && (
                        <div className="space-y-6">
                            <div className="border-0 rounded-3xl p-8 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm shadow-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 pointer-events-none" />
                                <h3 className="font-bold text-2xl mb-6 flex items-center gap-2 relative">
                                    <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl">
                                        <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    Payment Method
                                </h3>
                                <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="relative">
                                    <TabsList className="w-full grid grid-cols-2 p-1.5 bg-secondary/20 backdrop-blur-sm rounded-full h-16 border border-border/30">
                                        <TabsTrigger value="stripe" className="rounded-full h-12 data-[state=active]:bg-card data-[state=active]:shadow-lg font-semibold">Card / Apple Pay</TabsTrigger>
                                        <TabsTrigger value="wallet" disabled={!user} className="rounded-full h-12 data-[state=active]:bg-card data-[state=active]:shadow-lg font-semibold">Wallet</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="stripe" className="pt-8 space-y-4">
                                        <p className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-green-500/60 animate-pulse" />
                                            Secured by Stripe. Confirm to finish.
                                        </p>
                                    </TabsContent>
                                    <TabsContent value="wallet" className="pt-8">
                                        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-inner">
                                            <p className="text-sm font-bold text-primary">Available Balance: €{walletBalance || 0}</p>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-8 border-t border-border/30">
                        {step !== 'time' && (
                            <Button variant="ghost" onClick={handleBack} className="rounded-full px-8 h-12 font-semibold hover:bg-muted/50">Back</Button>
                        )}
                        <Button 
                            size="lg" 
                            className="ml-auto px-12 rounded-full h-14 font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all hover:scale-105 active:scale-95" 
                            onClick={step === 'payment' ? handleBooking : handleNext} 
                            disabled={loading}
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                            {step === 'payment' ? "Confirm Booking" : "Next Step"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
