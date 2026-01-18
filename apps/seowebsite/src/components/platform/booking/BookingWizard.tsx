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
                <Card className="sticky top-24 bg-muted/40 border-muted">
                    <CardHeader>
                        <CardTitle>Booking Summary</CardTitle>
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

            <div className="w-full md:w-2/3 order-1 md:order-2">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" onClick={() => step !== 'time' ? handleBack() : router.back()} className="mb-4 pl-0">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-3xl font-serif font-medium">
                        {step === 'time' && "Select a Time"}
                        {step === 'addons' && "Enhance Your Session"}
                        {step === 'details' && "Your Details"}
                        {step === 'payment' && "Last Step"}
                    </h1>
                </div>

                <div className="space-y-8">
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
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                    </div>
                                ) : timeSlots.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {timeSlots.map((time) => (
                                            <Button
                                                key={time}
                                                variant={selectedTime === time ? "default" : "outline"}
                                                onClick={() => handleTimeSelect(time)}
                                            >
                                                {time}
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground text-sm border rounded-lg">
                                        No slots available for this date.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === "addons" && (
                        <div className="grid gap-4">
                            <Card className="cursor-pointer hover:border-primary transition-colors border-dashed bg-muted/20">
                                <CardContent className="flex items-center justify-between p-6">
                                    <div>
                                        <h3 className="font-medium">Aromatherapy</h3>
                                        <p className="text-sm text-muted-foreground">Add essential oils for relaxation.</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium">+€10</span>
                                        <Button variant="outline" size="sm" disabled>Coming Soon</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {step === "details" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First name</Label>
                                    <Input id="firstName" disabled={!!user} value={user ? user.user_metadata?.first_name : formData.firstName} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input id="lastName" disabled={!!user} value={user ? user.user_metadata?.last_name : formData.lastName} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" disabled={!!user} value={user ? user.email : formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" value={formData.phone} onChange={handleInputChange} />
                            </div>
                        </div>
                    )}

                    {step === "payment" && (
                        <div className="space-y-6">
                            <div className="border rounded-xl p-6 bg-card">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Payment Method
                                </h3>
                                <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                                    <TabsList className="w-full grid grid-cols-2">
                                        <TabsTrigger value="stripe">Card / Apple Pay</TabsTrigger>
                                        <TabsTrigger value="wallet" disabled={!user}>Wallet</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="stripe" className="pt-6 space-y-4">
                                        <p className="text-sm text-muted-foreground">Secured by Stripe. Confirm to finish.</p>
                                    </TabsContent>
                                    <TabsContent value="wallet" className="pt-6">
                                        <p className="text-sm font-medium">Balance: €{walletBalance || 0}</p>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-8 border-t">
                        {step !== 'time' && (
                            <Button variant="ghost" onClick={handleBack}>Back</Button>
                        )}
                        <Button size="lg" className="ml-auto px-8" onClick={step === 'payment' ? handleBooking : handleNext} disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {step === 'payment' ? "Confirm Booking" : "Next Step"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
