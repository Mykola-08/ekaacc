'use client';

import { useState, useEffect } from 'react';
import type { Service } from '@/types/database';
import { Button } from '@/components/platform/ui/button';
import { Calendar } from '@/components/platform/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/platform/ui/card';
import { Label } from '@/components/platform/ui/label';
import { Input } from '@/components/platform/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs';
import { Separator } from '@/components/platform/ui/separator';
import { Badge } from '@/components/platform/ui/badge';
import { Checkbox } from '@/components/platform/ui/checkbox';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  Loading03Icon,
  Tick02Icon,
  CreditCardIcon,
  UserGroupIcon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { createNewBookingAction, getAvailableSlotsAction } from '@/app/actions/booking-actions';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface BookingWizardProps {
  service: Service;
  variantId?: string;
}

export function BookingWizard({ service, variantId }: BookingWizardProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [step, setStep] = useState<'time' | 'addons' | 'details' | 'payment'>('time');
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    createAccount: false,
  });

  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wallet'>('stripe');

  const selectedVariant =
    service.variants?.find((v) => v.id === variantId) || service.variants?.[0];
  const price = selectedVariant ? selectedVariant.price : service.price;
  const duration = selectedVariant ? selectedVariant.duration : service.duration;

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
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

      const res = await createNewBookingAction({
        serviceId: service.id,
        startTime: startTime,
        email: user ? user.email : formData.email,
        displayName: `${formData.firstName} ${formData.lastName}`.trim(),
        userId: user?.id,
      });

      if (res.success) {
        toast.success('Booking confirmed!');
        router.push('/dashboard/bookings');
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
    <div className="container flex max-w-6xl flex-col gap-10 px-4 py-12 md:px-6 lg:flex-row">
      {/* Summary Sidebar */}
      <div className="order-2 w-full lg:order-1 lg:w-96">
        <Card className="bg-card/40 border-border/50 sticky top-24 overflow-hidden rounded-[24px] border shadow-2xl backdrop-blur-xl">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-bold tracking-tight">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-0">
            <div className="bg-secondary/30 rounded-[24px] p-6">
              <h3 className="text-foreground mb-1 text-lg font-bold">{service.name}</h3>
              <p className="text-muted-foreground text-sm font-medium">
                {selectedVariant?.name || 'Standard Session'}
              </p>
            </div>

            <div className="space-y-4 px-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Duration</span>
                <span className="font-bold">{duration} mins</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Date</span>
                <span className="font-bold">{date ? date.toLocaleDateString() : '-'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Time</span>
                <span className="font-bold">{selectedTime || '-'}</span>
              </div>
            </div>

            <Separator className="bg-border/30" />
            <div className="flex items-end justify-between p-2">
              <span className="text-muted-foreground font-bold">Total</span>
              <span className="text-primary text-3xl font-black tracking-tighter">€{price}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Wizard Area */}
      <div className="order-1 flex-1 lg:order-2">
        <div className="mb-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (step !== 'time' ? handleBack() : router.back())}
            className="hover:bg-secondary group mb-8 rounded-full transition-all"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
            />{' '}
            Back
          </Button>

          <div className="mb-4 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => {
                const active =
                  (step === 'time' && i === 1) ||
                  (step === 'addons' && i === 2) ||
                  (step === 'details' && i === 3) ||
                  (step === 'payment' && i === 4);
                const completed =
                  (step === 'addons' && i < 2) ||
                  (step === 'details' && i < 3) ||
                  (step === 'payment' && i < 4);
                return (
                  <div
                    key={i}
                    className={cn(
                      'border-background flex h-8 w-8 items-center justify-center rounded-full border-4 text-xs font-bold transition-all',
                      active
                        ? 'bg-primary z-10 scale-110 text-white'
                        : completed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {completed ? <HugeiconsIcon icon={Tick02Icon} className="h-3.5 w-3.5" /> : i}
                  </div>
                );
              })}
            </div>
            <h1 className="text-foreground text-5xl font-black tracking-tight">
              {step === 'time' && 'Select a Time'}
              {step === 'addons' && 'Enhance Session'}
              {step === 'details' && 'Your Details'}
              {step === 'payment' && 'Finalize'}
            </h1>
          </div>
        </div>

        <div className="space-y-10">
          {step === 'time' && (
            <div className="grid gap-10 md:grid-cols-2">
              <Card className="bg-card/30 border-border/40 overflow-hidden rounded-[24px] p-8 shadow-xl backdrop-blur-sm">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="flex w-full justify-center !p-0"
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                />
              </Card>
              <div className="space-y-6">
                <Label className="text-muted-foreground ml-2 text-sm font-black tracking-widest uppercase">
                  Available Slots
                </Label>
                {loadingSlots ? (
                  <div className="bg-card/20 border-border/50 flex flex-col items-center justify-center rounded-[24px] border border-dashed py-20">
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="text-primary h-10 w-10 animate-spin opacity-50"
                    />
                    <p className="text-muted-foreground mt-4 text-sm font-medium">
                      Checking schedule...
                    </p>
                  </div>
                ) : timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => handleTimeSelect(time)}
                        className={cn(
                          'h-14 rounded-2xl text-base transition-all',
                          selectedTime === time
                            ? 'bg-primary shadow-primary/20 scale-[1.02] font-bold text-white shadow-xl'
                            : 'dark:bg-card border-border/50 hover:bg-secondary bg-white font-semibold'
                        )}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-secondary/20 border-border/50 rounded-[24px] border border-dashed py-20 text-center">
                    <p className="text-muted-foreground font-bold">
                      No sessions available on this day.
                    </p>
                    <p className="text-muted-foreground/60 mt-1 text-sm">
                      Please try another date.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'addons' && (
            <div className="grid gap-6">
              <div className="group bg-card/40 border-border/50 hover:border-primary/50 relative cursor-not-allowed overflow-hidden rounded-[24px] border-2 border-dashed p-8 opacity-60 transition-all">
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant="secondary" className="rounded-full px-4 py-1 font-bold">
                    Coming Soon
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-2xl">
                      <HugeiconsIcon icon={SparklesIcon} className="text-primary h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-foreground text-xl font-bold">Aromatherapy</h3>
                      <p className="text-muted-foreground text-sm font-medium">
                        Add essential oils for deep relaxation.
                      </p>
                    </div>
                  </div>
                  <span className="text-primary text-lg font-black">+€10</span>
                </div>
              </div>
            </div>
          )}

          {step === 'details' && (
            <Card className="bg-card/30 border-border/40 space-y-8 rounded-[24px] p-10 shadow-xl backdrop-blur-sm">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2.5">
                  <Label htmlFor="firstName" className="ml-1 font-bold">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    disabled={!!user}
                    value={user ? user.user_metadata?.first_name : formData.firstName}
                    onChange={handleInputChange}
                    className="bg-secondary/30 focus:ring-primary h-14 rounded-2xl border-none px-6 shadow-inner focus:ring-2"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="lastName" className="ml-1 font-bold">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    disabled={!!user}
                    value={user ? user.user_metadata?.last_name : formData.lastName}
                    onChange={handleInputChange}
                    className="bg-secondary/30 focus:ring-primary h-14 rounded-2xl border-none px-6 shadow-inner focus:ring-2"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="email" className="ml-1 font-bold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  disabled={!!user}
                  value={user ? user.email : formData.email}
                  onChange={handleInputChange}
                  className="bg-secondary/30 focus:ring-primary h-14 rounded-2xl border-none px-6 shadow-inner focus:ring-2"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="phone" className="ml-1 font-bold">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-secondary/30 focus:ring-primary h-14 rounded-2xl border-none px-6 shadow-inner focus:ring-2"
                  placeholder="+353 ..."
                />
              </div>
            </Card>
          )}

          {step === 'payment' && (
            <Card className="bg-card/30 border-border/40 space-y-8 rounded-[24px] p-10 shadow-xl backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                  <HugeiconsIcon
                    icon={CreditCardIcon}
                    className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Payment Method</h3>
              </div>

              <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                <TabsList className="bg-secondary/30 border-border/50 grid h-16 w-full grid-cols-2 rounded-full border p-1.5">
                  <TabsTrigger
                    value="stripe"
                    className="dark:data-[state=active]:bg-card h-13 rounded-full font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-xl"
                  >
                    Card / Mobile
                  </TabsTrigger>
                  <TabsTrigger
                    value="wallet"
                    disabled={!user}
                    className="dark:data-[state=active]:bg-card h-13 rounded-full font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-xl"
                  >
                    My Wallet
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="stripe" className="pt-10">
                  <div className="bg-secondary/20 border-border/50 space-y-4 rounded-[28px] border p-8 text-center">
                    <p className="text-muted-foreground text-sm font-bold">
                      Secured encrypted payment via Stripe.
                    </p>
                    <div className="flex justify-center gap-3 opacity-50 grayscale transition-all hover:grayscale-0">
                      {/* Could add card brand icons here */}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="wallet" className="pt-10">
                  <div className="bg-primary/5 border-primary/20 flex flex-col items-center gap-2 rounded-[28px] border-2 p-8">
                    <p className="text-primary/70 text-sm font-bold tracking-widest uppercase">
                      Available Balance
                    </p>
                    <p className="text-primary text-4xl font-black">€{walletBalance || 0}</p>
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
                className="text-muted-foreground hover:text-foreground hover:bg-secondary h-14 rounded-full px-10 font-bold transition-all"
              >
                Previous
              </Button>
            ) : (
              <div />
            )}

            <Button
              size="lg"
              disabled={loading}
              onClick={step === 'payment' ? handleBooking : handleNext}
              className="bg-primary hover:bg-primary/90 shadow-primary/30 h-16 rounded-full px-12 text-lg font-black text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <HugeiconsIcon icon={Loading03Icon} className="mr-3 h-6 w-6 animate-spin" />
              ) : null}
              {step === 'payment' ? 'Finalize Booking' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
