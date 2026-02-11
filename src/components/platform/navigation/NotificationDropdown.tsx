'use client';

import { useState, useEffect } from 'react';
import { Service } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  Loading03Icon,
  Tick02Icon,
  CreditCardIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { toast } from '@/components/ui/morphing-toaster';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BookingWizardProps {
  service: Service;
  variantId?: string;
}

import { createNewBookingAction, getAvailableSlotsAction } from '@/server/actions/booking-actions';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { usePresence } from '@/hooks/usePresence';
import { useBookingRealtime } from '@/hooks/useBookingRealtime';
import { Badge } from '@/components/ui/badge';

export function BookingWizard({ service, variantId }: BookingWizardProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [step, setStep] = useState<'time' | 'addons' | 'details' | 'payment'>('time');
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
    createAccount: false,
  });

  // Slot State
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wallet'>('stripe');

  const selectedVariant =
    service.variants?.find((v) => v.id === variantId) || service.variants?.[0];
  const price = selectedVariant ? selectedVariant.price : service.price;
  const duration = selectedVariant ? selectedVariant.duration : service.duration;

  // Realtime Presence: Show how many people are viewing this service
  // Scope room by serviceId
  const { onlineUsers } = usePresence({
    roomName: `booking_view:${service.id}`,
    user: user
      ? { ...user, viewing_at: new Date().toISOString() }
      : { id: 'anon-' + Math.random(), viewing_at: new Date().toISOString() },
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
          toast.info('Someone just booked a slot. Refreshing availability...');
          fetchSlots();
        }
      }
    }
  });

  // Fetch User & Wallet
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Fetch wallet using user.id directly
        const { data: wallet } = await supabase
            .from('wallets')
            .select('balance_cents')
            .eq('user_id', user.id)
            .single();
        if (wallet) setWalletBalance(wallet.balance_cents / 100);
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
      console.error('Error fetching slots', e);
      toast.error('Could not load availability');
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
  };

  const handleBooking = async () => {
    setLoading(true);

    try {
      if (!date || !selectedTime) throw new Error('Missing time');

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
        lastName: formData.lastName, // Actually action expects these. If user is logged in, we should probably pre-fill them in state.
        phone: formData.phone,
        priceCents: price * 100,
        paymentMode: paymentMethod,
        userId: user?.id,
      });

      if (res.success) {
        toast.success('Booking confirmed!');
        router.push('/bookings');
      } else {
        toast.error('Booking failed: ' + res.error);
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex max-w-5xl flex-col gap-8 px-4 py-12 md:flex-row md:px-6">
      {/* Sidebar Summary */}
      <div className="animate-in fade-in slide-in-from-right-8 order-2 w-full duration-700 md:order-1 md:w-1/3">
        <div className="bg-card border-border sticky top-24 overflow-hidden rounded-lg border shadow-eka-sm">
          <div className="bg-muted relative h-48">
            {/* Image Placeholder */}
            <div className="text-muted-foreground/20 absolute inset-0 flex items-center justify-center">
              <HugeiconsIcon icon={UserGroupIcon} className="h-16 w-16" strokeWidth={1} />
            </div>
            {/* Live Viewers Badge */}
            {viewerCount > 1 && (
              <div className="absolute top-4 right-4 animate-pulse">
                <Badge
                  variant="secondary"
                  className="bg-background/80 text-destructive border-transparent shadow-sm backdrop-blur"
                >
                  <HugeiconsIcon icon={UserGroupIcon} className="mr-1 h-3 w-3" />
                  {viewerCount} booking now
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-6 p-8">
            <div>
              <h2 className="text-foreground mb-2 text-2xl font-semibold">{service.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>

            <div className="border-border space-y-4 border-t pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Duration</span>
                <span className="text-foreground font-semibold">{duration} mins</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Date</span>
                <span className="text-foreground font-semibold">
                  {date
                    ? date.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Select date'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Time</span>
                <span className="text-foreground font-semibold">
                  {selectedTime || 'Select time'}
                </span>
              </div>
            </div>

            <div className="border-border border-t pt-6">
              <div className="flex items-baseline justify-between">
                <span className="text-foreground text-lg font-semibold">Total</span>
                <span className="text-foreground text-3xl font-semibold">€{price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Wizard */}
      <div className="order-1 w-full md:order-2 md:w-2/3">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (step !== 'time' ? handleBack() : router.back())}
            className="text-muted-foreground hover:text-foreground mb-4 pl-0 hover:pl-0"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 h-4 w-4" />{' '}
            {step === 'time' ? 'Back to Service' : 'Back'}
          </Button>
          <h1 className="text-foreground text-4xl font-semibold tracking-tight">
            {step === 'time' && 'Select a Time'}
            {step === 'addons' && 'Enhance Your Session'}
            {step === 'details' && 'Your Details'}
            {step === 'payment' && 'Last Step'}
          </h1>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
          {step === 'time' && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="flex w-full justify-center"
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                />
              </div>
              <div className="space-y-6">
                <Label className="text-foreground text-lg font-semibold">Available Slots</Label>
                {loadingSlots ? (
                  <div className="text-muted-foreground flex items-center justify-center py-12">
                    <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-6 w-6 animate-spin" />
                    Looking for slots...
                  </div>
                ) : timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        className={cn(
                          'h-9 rounded-lg border-2 font-semibold transition-all',
                          selectedTime === time
                            ? 'bg-foreground text-background border-foreground hover:bg-foreground/90 scale-105 transform shadow-md'
                            : 'bg-card border-border text-foreground hover:border-muted hover:bg-secondary'
                        )}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-secondary border-border rounded-xl border py-12 text-center">
                    <p className="text-muted-foreground font-medium">
                      No slots available for this date.
                    </p>
                    <p className="text-muted-foreground mt-2 text-xs">Try selecting another day.</p>
                  </div>
                )}
                <p className="text-muted-foreground text-center text-xs font-medium">
                  All times are in local time.
                </p>
              </div>
            </div>
          )}

          {step === 'addons' && (
            <div className="grid gap-4">
              {/* Placeholder usage */}
              <div className="group bg-card hover:bg-secondary border-muted hover:border-foreground flex cursor-pointer items-center justify-between rounded-xl border-2 border-dashed p-6 transition-colors">
                <div>
                  <h3 className="text-foreground font-semibold">Aromatherapy</h3>
                  <p className="text-muted-foreground text-sm">
                    Add essential oils for relaxation.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-foreground text-sm font-semibold">+€10</span>
                  <Button variant="secondary" size="sm" className="rounded-full" disabled>
                    Unavailable
                  </Button>
                </div>
              </div>

              <div className="bg-primary/5 text-primary rounded-xl p-6 text-center text-sm font-medium">
                <p>More enhancements coming soon.</p>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="bg-card border-border rounded-lg border p-8 shadow-sm">
              <Tabs defaultValue="guest" value={user ? 'guest' : undefined} className="w-full">
                {!user && (
                  <TabsList className="bg-secondary mb-8 grid h-12 w-full grid-cols-2 rounded-full p-1">
                    <TabsTrigger
                      value="guest"
                      className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full font-semibold data-[state=active]:shadow-sm"
                    >
                      Guest Checkout
                    </TabsTrigger>
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full font-semibold data-[state=active]:shadow-sm"
                    >
                      Sign In
                    </TabsTrigger>
                  </TabsList>
                )}

                <TabsContent value="guest" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-foreground font-semibold">
                        First name
                      </Label>
                      <Input
                        id="firstName"
                        className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-9 border-transparent transition-all"
                        placeholder="Jane"
                        disabled={!!user}
                        defaultValue={user?.user_metadata?.first_name}
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-foreground font-semibold">
                        Last name
                      </Label>
                      <Input
                        id="lastName"
                        className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-9 border-transparent transition-all"
                        placeholder="Doe"
                        disabled={!!user}
                        defaultValue={user?.user_metadata?.last_name}
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-semibold">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-9 border-transparent transition-all"
                      placeholder="jane@example.com"
                      disabled={!!user}
                      defaultValue={user?.email}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground font-semibold">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-9 border-transparent transition-all"
                      placeholder="+1234567890"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  {!user && (
                    <div className="border-border flex items-center space-x-3 border-t pt-6">
                      <Checkbox
                        id="createAccount"
                        checked={formData.createAccount}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, createAccount: checked as boolean })
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="createAccount"
                          className="text-foreground cursor-pointer text-sm font-semibold"
                        >
                          Create an account for easier booking next time
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          We'll email you a link to set your password.
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {!user && (
                  <TabsContent value="login">
                    <div className="space-y-6 py-12 text-center">
                      <p className="text-muted-foreground mx-auto max-w-xs">
                        Already have an account? Sign in to use your saved details and points.
                      </p>
                      <Button
                        variant="outline"
                        asChild
                        className="h-9 rounded-full border-2 px-8 font-semibold hover:bg-transparent"
                      >
                        <Link href={`/login?returnTo=/book/${service.id}`}>Sign In</Link>
                      </Button>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="bg-card border-border rounded-lg border p-8 shadow-sm">
                <h3 className="text-foreground mb-6 flex items-center gap-3 text-xl font-semibold">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                    <HugeiconsIcon icon={CreditCardIcon} className="h-5 w-5" />
                  </div>
                  Payment Method
                </h3>
                <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                  <TabsList className="bg-secondary mb-8 grid h-12 w-full grid-cols-2 rounded-full p-1">
                    <TabsTrigger
                      value="stripe"
                      className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full font-semibold data-[state=active]:shadow-sm"
                    >
                      Card / Apple Pay
                    </TabsTrigger>
                    <TabsTrigger
                      value="wallet"
                      disabled={!user}
                      className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full font-semibold data-[state=active]:shadow-sm"
                    >
                      Wallet {walletBalance !== null && `(€${walletBalance})`}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="stripe" className="space-y-6">
                    <div className="space-y-4">
                      <Input
                        className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-9 border-transparent"
                        placeholder="Card number"
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-9 border-transparent"
                          placeholder="MM/YY"
                        />
                        <Input
                          className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-9 border-transparent"
                          placeholder="CVC"
                        />
                        <Input
                          className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-9 border-transparent"
                          placeholder="Zip"
                        />
                      </div>
                      <p className="text-muted-foreground mt-4 text-center text-xs">
                        Transactions secured by Stripe. No payment taken until confirmation.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="wallet" className="">
                    {user ? (
                      walletBalance !== null && walletBalance >= price ? (
                        <div className="space-y-4 py-4 text-center">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 p-4 text-success">
                            <HugeiconsIcon icon={Tick02Icon} className="h-8 w-8" strokeWidth={3} />
                          </div>
                          <div>
                            <p className="text-foreground text-lg font-semibold">Sufficient Balance</p>
                            <p className="text-muted-foreground text-sm">
                              €{price} will be deducted from your €{walletBalance} balance.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6 py-4 text-center">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/10 p-4 text-warning">
                            <HugeiconsIcon
                              icon={CreditCardIcon}
                              className="h-8 w-8"
                              strokeWidth={3}
                            />
                          </div>
                          <div>
                            <p className="text-foreground text-lg font-semibold">
                              Insufficient Balance
                            </p>
                            <p className="text-muted-foreground mb-6 text-sm">
                              Your balance is €{walletBalance}. You need €{price}.
                            </p>
                            <Button
                              variant="outline"
                              asChild
                              className="rounded-full border-2 font-semibold"
                            >
                              <Link href="/wallet/top-up" target="_blank">
                                Top Up Wallet
                              </Link>
                            </Button>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">Please sign in to use Wallet.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <div className="text-muted-foreground flex items-start space-x-3 px-2 text-sm">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  className="h-5 w-5 shrink-0 text-success"
                  strokeWidth={2.5}
                />
                <p className="font-medium">
                  I agree to the cancellation policy (24h notice required).
                </p>
              </div>
            </div>
          )}

          <div className="border-border flex justify-between border-t pt-8">
            {step !== 'time' && (
              <Button
                variant="ghost"
                onClick={() => setStep(step === 'payment' ? 'details' : 'time')}
                className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
              >
                Back
              </Button>
            )}
            <div className="ml-auto">
              {step === 'payment' ? (
                <Button
                  size="lg"
                  className="h-10 rounded-full px-10 text-lg font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
                  onClick={handleBooking}
                  disabled={loading}
                >
                  {loading ? (
                    <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  Confirm Booking
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="h-10 rounded-full px-10 text-lg font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
                  onClick={handleNext}
                >
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
