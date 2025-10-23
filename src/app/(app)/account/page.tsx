'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/context/unified-data-context';
import { AnimatedCard } from '@/components/eka/animated-card';
import { RoleChanger } from '@/components/ui/role-changer';
import { useActiveSubscriptions } from '@/hooks/use-active-subscriptions';
import { format } from 'date-fns';
import type { Wallet, WalletTransaction, PaymentRequest, PaymentMethod } from '@/lib/wallet-types';
import { Crown, Check, Shield, Sparkles, User, Wallet as WalletIcon, Plus, Smartphone, CreditCard, Euro } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type WalletSummary = {
  balance: string;
  totalCredits: string;
  totalDebits: string;
  lastUpdated: string;
};

function coerceDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value === 'number') {
    const fromNumber = new Date(value);
    return Number.isNaN(fromNumber.getTime()) ? undefined : fromNumber;
  }
  if (typeof value === 'string') {
    const fromString = new Date(value);
    return Number.isNaN(fromString.getTime()) ? undefined : fromString;
  }
  if (typeof value === 'object' && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    try {
      const fromTimestamp = (value as { toDate: () => Date }).toDate();
      return Number.isNaN(fromTimestamp.getTime()) ? undefined : fromTimestamp;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function formatWalletSummary(wallet: Wallet | null): WalletSummary {
  const balance = `€${(wallet?.balance ?? 0).toFixed(2)}`;
  const totalCredits = `€${(wallet?.totalCredits ?? 0).toFixed(2)}`;
  const totalDebits = `€${(wallet?.totalDebits ?? 0).toFixed(2)}`;
  const updated = coerceDate(wallet?.updatedAt);
  const lastUpdated = updated ? format(updated, 'PPpp') : 'Never';

  return { balance, totalCredits, totalDebits, lastUpdated };
}

export default function AccountPage() {
  const { currentUser, updateUser } = useData();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(() => {
    const tab = searchParams.get('tab');
    return tab === 'wallet' || tab === 'subscription' ? tab : 'profile';
  });

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loadingWallet, setLoadingWallet] = useState(false);

  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpMethod, setTopUpMethod] = useState<PaymentMethod>('bizum');
  const [proofText, setProofText] = useState('');
  const [submittingTopUp, setSubmittingTopUp] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: '', email: '', phoneNumber: '', location: '', about: '' },
  });

  const { subscriptions, hasLoyalty, hasVip, loading: subscriptionsLoading } = useActiveSubscriptions(currentUser?.id);

  useEffect(() => {
    const tab = searchParams.get('tab');
    const nextTab = tab === 'wallet' || tab === 'subscription' ? tab : 'profile';
    setActiveTab(prev => (prev === nextTab ? prev : nextTab));
  }, [searchParams]);

  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'profile') {
        params.delete('tab');
      } else {
        params.set('tab', value);
      }
      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleTopUpDialogChange = useCallback((open: boolean) => {
    setTopUpDialogOpen(open);
    if (!open) {
      setTopUpAmount('');
      setProofText('');
      setSubmittingTopUp(false);
    }
  }, []);

  const loadWalletData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoadingWallet(true);
      const { getWalletService } = await import('@/services/wallet-service');
      const { getPaymentService } = await import('@/services/payment-service');
      const walletService = await getWalletService();
      const paymentService = await getPaymentService();
      const [walletData, transactionsData, paymentsData] = await Promise.all([
        walletService.getWallet(currentUser.id),
        walletService.getTransactions(currentUser.id),
        paymentService.getUserPaymentRequests(currentUser.id),
      ]);
      setWallet(walletData);
      setTransactions(transactionsData.slice(0, 10));
      setPaymentRequests(paymentsData);
    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast({
        title: 'Wallet unavailable',
        description: 'We could not load your wallet information. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoadingWallet(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    if (!currentUser) return;
    form.reset({
      name: currentUser.name || currentUser.displayName || '',
      email: currentUser.email || '',
      phoneNumber: currentUser.phoneNumber || '',
      location: currentUser.location || '',
      about: currentUser.bio || '',
    });
    loadWalletData();
  }, [currentUser, form, loadWalletData]);

  const pendingRequestCount = useMemo(
    () => paymentRequests.filter(request => request.status === 'pending').length,
    [paymentRequests]
  );

  const walletSummary = useMemo(() => formatWalletSummary(wallet), [wallet]);

  const handleTopUp = useCallback(async () => {
    if (!currentUser || submittingTopUp) {
      return;
    }

    const parsedAmount = Number.parseFloat(topUpAmount.replace(',', '.'));
    const normalizedAmount = Math.round((Number.isFinite(parsedAmount) ? parsedAmount : 0) * 100) / 100;

    if (!Number.isFinite(parsedAmount) || normalizedAmount < 1) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid top-up amount of at least €1.00 before submitting.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmittingTopUp(true);
      const { getPaymentService } = await import('@/services/payment-service');
      const paymentService = await getPaymentService();
      await paymentService.createPaymentRequest(
        currentUser.id,
        normalizedAmount,
        topUpMethod,
        'Wallet top-up',
        undefined,
        proofText.trim() || undefined
      );
      toast({
        title: 'Top-up submitted',
        description: `Your ${topUpMethod} payment of €${normalizedAmount.toFixed(2)} is pending review.`,
      });
      handleTopUpDialogChange(false);
      await loadWalletData();
    } catch (error) {
      console.error('Failed to submit top-up request:', error);
      toast({
        title: 'Top-up failed',
        description: 'We were unable to create your top-up request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingTopUp(false);
    }
  }, [currentUser, handleTopUpDialogChange, loadWalletData, proofText, submittingTopUp, toast, topUpAmount, topUpMethod]);

  const onSubmit = useCallback(
    async (values: ProfileFormValues) => {
      if (!currentUser) return;
      try {
        await updateUser({
          name: values.name.trim(),
          phoneNumber: values.phoneNumber?.trim() || undefined,
          location: values.location?.trim() || undefined,
          bio: values.about?.trim() || undefined,
        });
        toast({
          title: 'Profile updated',
          description: 'Your account information has been saved.',
        });
      } catch (error) {
        console.error('Failed to update profile:', error);
        toast({
          title: 'Update failed',
          description: 'We could not update your profile. Please try again.',
          variant: 'destructive',
        });
      }
    },
    [currentUser, toast, updateUser]
  );

  if (!currentUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>Log in to manage your account, wallet, and subscription.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Go to login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const membershipBadges = (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" className="flex items-center gap-1">
        <Shield className="h-4 w-4" />
        {currentUser.role}
      </Badge>
      {hasLoyalty && (
        <Badge className="flex items-center gap-1 bg-amber-500 text-white hover:bg-amber-500">
          <Sparkles className="h-4 w-4" />
          Loyal Member
        </Badge>
      )}
      {hasVip && (
        <Badge className="flex items-center gap-1 bg-purple-600 text-white hover:bg-purple-600">
          <Crown className="h-4 w-4" />
          VIP
        </Badge>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account</h1>
          <p className="text-muted-foreground">Manage your profile details, wallet balance, and memberships.</p>
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <Link href="/account">Profile</Link>
          <span>•</span>
          <Link href="/account/settings">Settings</Link>
          <span>•</span>
          <Link href="/account/billing">Billing</Link>
        </div>
      </div>

      <AnimatedCard delay={0} asChild>
        <Card>
          <CardContent className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {currentUser.avatarUrl ? (
                  <AvatarImage
                    src={currentUser.avatarUrl}
                    alt={currentUser.name ?? currentUser.displayName ?? 'User avatar'}
                  />
                ) : (
                  <AvatarFallback className="text-xl font-medium">{currentUser.initials}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{currentUser.name || currentUser.displayName || 'Unnamed user'}</h2>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">{membershipBadges}</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>
                Wallet balance: <span className="font-medium">{walletSummary.balance}</span>
              </div>
              <div>
                Pending top-ups: <span className="font-medium">{pendingRequestCount}</span>
              </div>
              <div>
                Last updated: <span className="font-medium">{walletSummary.lastUpdated}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="wallet">
            <WalletIcon className="mr-2 h-4 w-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <Crown className="mr-2 h-4 w-4" />
            Subscription
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <AnimatedCard delay={100} asChild>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>This information is visible to your care team.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} disabled readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+34 600 000 000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Madrid, Spain" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="about"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>About you</FormLabel>
                          <FormControl>
                            <Textarea rows={4} {...field} placeholder="Share a short bio or preferences for your therapist." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-2 flex justify-end">
                      <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={200} asChild>
            <Card>
              <CardHeader>
                <CardTitle>Testing tools</CardTitle>
                <CardDescription>Switch persona roles without leaving the page.</CardDescription>
              </CardHeader>
              <CardContent>
                <RoleChanger />
                <p className="text-sm text-muted-foreground">
                  Changes are applied instantly and persisted to your profile so you can explore role-specific experiences.
                </p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <AnimatedCard delay={100} asChild>
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-4">
                  <span className="flex items-center gap-2">
                    <WalletIcon className="h-5 w-5" /> Wallet overview
                  </span>
                  <Button onClick={() => handleTopUpDialogChange(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Top up
                  </Button>
                </CardTitle>
                <CardDescription>Submit a top-up request for admin or therapist verification.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loadingWallet ? (
                  <div className="text-sm text-muted-foreground">Loading wallet activity…</div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Current balance</CardTitle>
                        <CardDescription>Total credits minus debits</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{walletSummary.balance}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Lifetime credits</CardTitle>
                        <CardDescription>Funds added to your wallet</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{walletSummary.totalCredits}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Pending requests</CardTitle>
                        <CardDescription>Awaiting approval</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{pendingRequestCount}</div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Recent transactions</h3>
                    <Link href="/account/billing" className="text-sm text-primary">View all</Link>
                  </div>
                  {transactions.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[140px]">Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[120px] text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map(transaction => {
                          const created = coerceDate(transaction.createdAt);
                          const amount = transaction.amount >= 0
                            ? `+€${transaction.amount.toFixed(2)}`
                            : `€${transaction.amount.toFixed(2)}`;
                          const amountClass = transaction.amount >= 0 ? 'text-emerald-600' : 'text-rose-600';
                          return (
                            <TableRow key={transaction.id}>
                              <TableCell>{created ? format(created, 'PP') : '—'}</TableCell>
                              <TableCell className="text-muted-foreground">{transaction.description}</TableCell>
                              <TableCell className={`text-right font-medium ${amountClass}`}>{amount}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">No transactions recorded yet.</p>
                  )}
                </div>

                {paymentRequests.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Top-up requests</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[140px]">Submitted</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[120px] text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentRequests.map(request => {
                          const submitted = coerceDate(request.createdAt);
                          const icon = request.method === 'bizum' ? (
                            <Smartphone className="h-4 w-4" />
                          ) : request.method === 'wallet' ? (
                            <CreditCard className="h-4 w-4" />
                          ) : (
                            <Euro className="h-4 w-4" />
                          );
                          return (
                            <TableRow key={request.id}>
                              <TableCell>{submitted ? format(submitted, 'PP') : '—'}</TableCell>
                              <TableCell>
                                <span className="flex items-center gap-2 capitalize">
                                  {icon}
                                  {request.method}
                                </span>
                              </TableCell>
                              <TableCell className="capitalize">{request.status}</TableCell>
                              <TableCell className="text-right font-medium">€{request.amount.toFixed(2)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <AnimatedCard delay={100} asChild>
            <Card>
              <CardHeader>
                <CardTitle>Membership status</CardTitle>
                <CardDescription>Track your loyalty and VIP benefits.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> Loyalty
                      </CardTitle>
                      <CardDescription>
                        {hasLoyalty ? 'Active membership unlocked personalised rewards.' : 'Activate Loyal for exclusive perks.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <Badge variant={hasLoyalty ? 'default' : 'outline'}>{hasLoyalty ? 'Active' : 'Inactive'}</Badge>
                      <Button variant="outline" asChild>
                        <Link href="/subscriptions">View plans</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Crown className="h-4 w-4" /> VIP
                      </CardTitle>
                      <CardDescription>
                        {hasVip ? 'Premium VIP experience enabled.' : 'Upgrade to VIP for the best care.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <Badge variant={hasVip ? 'default' : 'outline'}>{hasVip ? 'Active' : 'Inactive'}</Badge>
                      <Button variant="outline" asChild>
                        <Link href="/subscriptions">Upgrade</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Active subscriptions</h3>
                  {subscriptionsLoading ? (
                    <p className="text-sm text-muted-foreground">Checking your subscription status…</p>
                  ) : subscriptions.length ? (
                    <ul className="space-y-2 text-sm">
                      {subscriptions.map(subscription => {
                        const renewal = coerceDate(subscription.currentPeriodEnd);
                        return (
                          <li key={subscription.id} className="flex items-center justify-between rounded-md border p-3">
                            <div>
                              <div className="font-medium capitalize">{subscription.type}</div>
                              <div className="text-muted-foreground">
                                Renews on {renewal ? format(renewal, 'PP') : '—'}
                              </div>
                            </div>
                            <Badge variant="secondary" className="capitalize">{subscription.status}</Badge>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      You do not have any active subscriptions yet. Explore our plans to unlock additional benefits.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={180} asChild>
            <Card>
              <CardHeader>
                <CardTitle>Need help with billing?</CardTitle>
                <CardDescription>Contact support or review invoices from the billing centre.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/support">Contact support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/account/billing">Go to billing</Link>
                </Button>
              </CardContent>
            </Card>
          </AnimatedCard>
        </TabsContent>
      </Tabs>

      <Dialog open={topUpDialogOpen} onOpenChange={handleTopUpDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top up wallet</DialogTitle>
            <DialogDescription>Submit a top-up request for admin or therapist verification.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FormLabel>Amount (EUR)</FormLabel>
                <Input
                  value={topUpAmount}
                  onChange={event => setTopUpAmount(event.target.value)}
                  type="number"
                  min="1"
                  step="0.01"
                  disabled={submittingTopUp}
                />
              </div>
              <div>
                <FormLabel>Method</FormLabel>
                <Select
                  value={topUpMethod}
                  onValueChange={value => setTopUpMethod(value as PaymentMethod)}
                  disabled={submittingTopUp}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bizum">Bizum</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="wallet" disabled>Card (coming soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <FormLabel>Reference or notes</FormLabel>
              <Textarea
                rows={3}
                placeholder="Transaction reference, last four digits, or any helpful note"
                value={proofText}
                onChange={event => setProofText(event.target.value)}
                disabled={submittingTopUp}
              />
            </div>
            <div className="rounded-md border border-blue-500/20 bg-blue-500/10 p-3 text-sm text-blue-700">
              Requests are reviewed within 24 hours. You will receive an email once the payment is confirmed.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleTopUpDialogChange(false)} disabled={submittingTopUp}>
              Cancel
            </Button>
            <Button onClick={handleTopUp} disabled={submittingTopUp}>
              {submittingTopUp ? (
                'Submitting...'
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Submit request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
