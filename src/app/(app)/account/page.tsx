'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/context/unified-data-context';
import { AnimatedCard } from '@/components/eka/animated-card';
import { format } from 'date-fns';
import type { Wallet, WalletTransaction, PaymentRequest, PaymentMethod } from '@/lib/wallet-types';
import { Wallet as WalletIcon, Plus, Check } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
});

export default function AccountPage() {
  const { currentUser, updateUser } = useData();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') ?? 'profile');

  // Wallet state
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Top-up dialog
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpMethod, setTopUpMethod] = useState<PaymentMethod>('bizum');
  const [proofText, setProofText] = useState('');

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: '', email: '', phoneNumber: '', location: '', about: '' },
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name || currentUser.displayName || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
        location: (currentUser as any).location || '',
        about: (currentUser as any).about || '',
      });
      loadWalletData();
    }
  }, [currentUser]);

  const loadWalletData = async () => {
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
    } catch (e) {
      console.error('Error loading wallet data:', e);
    } finally {
      setLoadingWallet(false);
    }
  };

  const handleTopUp = async () => {
    if (!currentUser || !topUpAmount || parseFloat(topUpAmount) <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }
    try {
      const { getPaymentService } = await import('@/services/payment-service');
      const service = await getPaymentService();
      await service.createPaymentRequest(
        currentUser.id,
        parseFloat(topUpAmount),
        topUpMethod,
        'Wallet top-up',
        undefined,
        proofText
      );
      toast({ title: 'Top-Up Request Submitted', description: `Your ${topUpMethod} payment of €${topUpAmount} is pending verification.` });
      setTopUpDialogOpen(false);
      setTopUpAmount('');
      setProofText('');
      loadWalletData();
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to submit top-up request', variant: 'destructive' });
    }
  };

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    updateUser({ name: values.name });
    toast({ title: 'Profile Updated', description: 'Your changes have been saved.' });
  };

  if (!currentUser) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-semibold">Please log in</h1>
        <p className="text-muted-foreground mt-2">You need to be logged in to view your account details.</p>
        <Button asChild className="mt-4"><Link href="/login">Login</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Account</h1>
        <div className="flex gap-2">
          <Link href="/account">Profile</Link>
          <Link href="/account/settings">Settings</Link>
          <Link href="/account/billing">Billing</Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>This is how others will see you on the site.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input {...field} disabled /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="about" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>About</FormLabel>
                      <FormControl><Textarea rows={4} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
              <div className="flex justify-end"><Button type="submit">Save Changes</Button></div>
            </form>
          </Form>

          {/* Wallet Section inside Profile */}
          <AnimatedCard delay={100}>
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WalletIcon className="h-5 w-5" />
                    Wallet
                  </div>
                  <Button onClick={() => setTopUpDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Top Up
                  </Button>
                </CardTitle>
                <CardDescription>Manage your balance and top-ups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Balance</CardTitle></CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">€{(wallet?.balance ?? 0).toFixed(2)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Pending Requests</CardTitle></CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{paymentRequests.filter(p=>p.status==='pending').length}</div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3">Recent Transactions</h3>
                  {transactions.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map(tx => (
                          <TableRow key={tx.id}>
                            <TableCell>{format(new Date(tx.createdAt as any), 'MMM dd, yyyy')}</TableCell>
                            <TableCell className="text-muted-foreground">{tx.description}</TableCell>
                            <TableCell className={tx.amount >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {tx.amount >= 0 ? '+' : ''}€{tx.amount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-sm text-muted-foreground">No transactions yet.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          <Dialog open={topUpDialogOpen} onOpenChange={setTopUpDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Top Up Wallet</DialogTitle>
                <DialogDescription>Submit a top-up request for admin/therapist verification.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Amount (EUR)</FormLabel>
                    <Input value={topUpAmount} onChange={e=>setTopUpAmount(e.target.value)} type="number" min="1" step="0.01" />
                  </div>
                  <div>
                    <FormLabel>Method</FormLabel>
                    <Select value={topUpMethod} onValueChange={(v)=>setTopUpMethod(v as PaymentMethod)}>
                      <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bizum">Bizum</SelectItem>
                        <SelectItem value="wallet" disabled>Card (Coming Soon)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <FormLabel>Reference / Proof</FormLabel>
                  <Textarea rows={3} placeholder="Transaction reference or notes" value={proofText} onChange={e=>setProofText(e.target.value)} />
                </div>
                <div className="rounded-md border border-blue-500/20 bg-blue-500/10 p-3 text-sm text-blue-700">
                  Your request will be reviewed by an admin or therapist. You'll be notified once it's approved.
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={()=>setTopUpDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleTopUp}><Check className="h-4 w-4 mr-2"/>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
              <CardDescription>Manage your Loyal or VIP subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Loyal</CardTitle></CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="text-muted-foreground">Loyal benefits and rewards</div>
                    <Button variant="outline" asChild><Link href="/subscriptions">View Plans</Link></Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">VIP</CardTitle></CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="text-muted-foreground">VIP premium experience</div>
                    <Button variant="outline" asChild><Link href="/subscriptions">View Plans</Link></Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/context/unified-data-context';
import { AnimatedCard } from '@/components/eka/animated-card';
import { format } from 'date-fns';
import type { Wallet, WalletTransaction, PaymentRequest, PaymentMethod } from '@/lib/wallet-types';
import { User, Wallet as WalletIcon, Plus, Check } from 'lucide-react';

// Temporary RoleChanger stub (replace with real import if available)
const RoleChanger = () => (
  <div className="text-xs text-muted-foreground">[RoleChanger Component]</div>
);

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
});

export default function AccountPage() {
  const { currentUser, updateUser } = useData();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') ?? 'profile');

  // Wallet state
  'use client';

  import { useEffect, useState } from 'react';
  import Link from 'next/link';
  import { useRouter, useSearchParams } from 'next/navigation';
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
  import { useToast } from '@/hooks/use-toast';
  import { useData } from '@/context/unified-data-context';
  import { AnimatedCard } from '@/components/eka/animated-card';
  import { format } from 'date-fns';
  import type { Wallet, WalletTransaction, PaymentRequest, PaymentMethod } from '@/lib/wallet-types';
  import { User, Mail, Phone, MapPin, Crown, Shield, Check, Sparkles, Wallet as WalletIcon, Plus, Clock, Euro, CreditCard, Smartphone, AlertCircle } from 'lucide-react';

  const RoleChanger = () => <div className="text-xs text-muted-foreground">[RoleChanger Component]</div>;

  const profileFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
    location: z.string().optional(),
    about: z.string().optional(),
  });

  export default function AccountPage() {
    const { currentUser, updateUser } = useData();
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') ?? 'profile');

    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
    const [loadingWallet, setLoadingWallet] = useState(false);

    const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState('');
    const [topUpMethod, setTopUpMethod] = useState<PaymentMethod>('bizum');
    const [proofText, setProofText] = useState('');

    const form = useForm<z.infer<typeof profileFormSchema>>({
      resolver: zodResolver(profileFormSchema),
      defaultValues: { name: '', email: '', phoneNumber: '', location: '', about: '' },
    });

    useEffect(() => {
      const tab = searchParams.get('tab');
      if (tab) setActiveTab(tab);
    }, [searchParams]);

    useEffect(() => {
      if (currentUser) {
        form.reset({
          name: currentUser.name || currentUser.displayName || '',
          email: currentUser.email || '',
          phoneNumber: currentUser.phoneNumber || '',
          location: (currentUser as any).location || '',
          about: (currentUser as any).about || '',
        });
        loadWalletData();
      }
    }, [currentUser]);

    const loadWalletData = async () => {
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
      } catch (e) {
        console.error('Error loading wallet data:', e);
      } finally {
        setLoadingWallet(false);
      }
    };

    const handleTopUp = async () => {
      if (!currentUser || !topUpAmount || parseFloat(topUpAmount) <= 0) {
        toast({ title: 'Invalid Amount', description: 'Please enter a valid amount', variant: 'destructive' });
        return;
      }
      try {
        const { getPaymentService } = await import('@/services/payment-service');
        const service = await getPaymentService();
        await service.createPaymentRequest(currentUser.id, parseFloat(topUpAmount), topUpMethod, 'Wallet top-up', undefined, proofText);
        toast({ title: 'Top-Up Request Submitted', description: `Your ${topUpMethod} payment of €${topUpAmount} is pending verification.` });
        setTopUpDialogOpen(false);
        setTopUpAmount('');
        setProofText('');
        loadWalletData();
      } catch (e) {
        toast({ title: 'Error', description: 'Failed to submit top-up request', variant: 'destructive' });
      }
    };

    const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
      updateUser({ name: values.name });
      toast({ title: 'Profile Updated', description: 'Your changes have been saved.' });
    };

    if (!currentUser) {
      return (
        <div className="text-center py-16">
          <h1 className="text-2xl font-semibold">Please log in</h1>
          <p className="text-muted-foreground mt-2">You need to be logged in to view your account details.</p>
          <Button asChild className="mt-4"><Link href="/login">Login</Link></Button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Account</h1>
          <div className="flex gap-2">
            <Link href="/account">Profile</Link>
            <Link href="/account/settings">Settings</Link>
            <Link href="/account/billing">Billing</Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>This is how others will see you on the site.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-2">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input {...field} disabled /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="about" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>About</FormLabel>
                        <FormControl><Textarea rows={4} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
                <div className="flex justify-end"><Button type="submit">Save Changes</Button></div>
              </form>
            </Form>

            {/* Wallet Section inside Profile */}
            <AnimatedCard delay={100}>
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <WalletIcon className="h-5 w-5" />
                      Wallet
                    </div>
                    <Button onClick={() => setTopUpDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Top Up
                    </Button>
                  </CardTitle>
                  <CardDescription>Manage your balance and top-ups</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm">Balance</CardTitle></CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">€{(wallet?.balance ?? 0).toFixed(2)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm">Pending Requests</CardTitle></CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{paymentRequests.filter(p=>p.status==='pending').length}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-3">Recent Transactions</h3>
                    {transactions.length ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map(tx => (
                            <TableRow key={tx.id}>
                              <TableCell>{format(new Date(tx.createdAt as any), 'MMM dd, yyyy')}</TableCell>
                              <TableCell className="text-muted-foreground">{tx.description}</TableCell>
                              <TableCell className={tx.amount >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                {tx.amount >= 0 ? '+' : ''}€{tx.amount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-sm text-muted-foreground">No transactions yet.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <Dialog open={topUpDialogOpen} onOpenChange={setTopUpDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Top Up Wallet</DialogTitle>
                  <DialogDescription>Submit a top-up request for admin/therapist verification.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Amount (EUR)</FormLabel>
                      <Input value={topUpAmount} onChange={e=>setTopUpAmount(e.target.value)} type="number" min="1" step="0.01" />
                    </div>
                    <div>
                      <FormLabel>Method</FormLabel>
                      <Select value={topUpMethod} onValueChange={(v)=>setTopUpMethod(v as PaymentMethod)}>
                        <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bizum">Bizum</SelectItem>
                          <SelectItem value="wallet" disabled>Card (Coming Soon)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <FormLabel>Reference / Proof</FormLabel>
                    <Textarea rows={3} placeholder="Transaction reference or notes" value={proofText} onChange={e=>setProofText(e.target.value)} />
                  </div>
                  <div className="rounded-md border border-blue-500/20 bg-blue-500/10 p-3 text-sm text-blue-700">
                    Your request will be reviewed by an admin or therapist. You'll be notified once it's approved.
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={()=>setTopUpDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleTopUp}><Check className="h-4 w-4 mr-2"/>Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
                <CardDescription>Manage your Loyal or VIP subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Loyal</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="text-muted-foreground">Loyal benefits and rewards</div>
                      <Button variant="outline">Get Loyal</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">VIP</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="text-muted-foreground">VIP premium experience</div>
                      <Button variant="outline">Get VIP</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Test Mode: Role & Variables Switcher</h2>
          <div className="flex flex-col gap-4">
            <RoleChanger />
          </div>
        </Card>
      </div>
    );
  }

        currentUser.id,                    </div>

        parseFloat(topUpAmount),                </Card>

        topUpMethod,            )}

        'Wallet top-up',            {/* Client forms only for role Patient */}

        proofText            {currentUser.role === 'Patient' && (

      );                <div className="space-y-6">

                    <WelcomePersonalizationForm open={false} onClose={() => {}} onSubmit={() => {}} />

      toast({                    <DailyMoodLogForm open={false} onClose={() => {}} onSubmit={() => {}} />

        title: 'Top-Up Request Submitted',                </div>

        description: `Your ${topUpMethod} payment of €${topUpAmount} is pending verification.`,            )}

      });            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

      setTopUpDialogOpen(false);                    <Card>

      setTopUpAmount('');                        <CardHeader>

      setProofText('');                            <CardTitle>Profile</CardTitle>

      loadWalletData();                            <CardDescription>This is how others will see you on the site.</CardDescription>

    } catch (error) {                        </CardHeader>

      toast({                    <CardContent className="grid gap-6 md:grid-cols-3">

        title: 'Error',                        <div className="md:col-span-2 grid gap-4">

        description: 'Failed to submit top-up request',                         <FormField

        variant: 'destructive',                            control={form.control}

      });                            name="name"

    }                            render={({ field }) => (

  };                                <FormItem>

                                <FormLabel>Name</FormLabel>

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {                                <FormControl>

    updateUser({                                     <Input {...field} />

      name: values.name,                                </FormControl>

      phoneNumber: values.phoneNumber,                                <FormMessage />

      location: values.location,                                </FormItem>

    });                            )}

    toast({                            />

      title: "Profile Updated",                        <FormField

      description: "Your changes have been saved.",                            control={form.control}

    });                            name="email"

    setIsEditing(false);                            render={({ field }) => (

  };                                <FormItem>

                                <FormLabel>Email</FormLabel>

  if (!currentUser) {                                <FormControl>

    return (                                    <Input {...field} readOnly disabled />

      <div className="flex items-center justify-center min-h-[60vh]">                                </FormControl>

        <Card className="w-full max-w-md">                                <FormMessage />

          <CardHeader>                                </FormItem>

            <CardTitle>Please log in</CardTitle>                            )}

            <CardDescription>You need to be logged in to view your account details.</CardDescription>                            />

          </CardHeader>                        </div>

          <CardContent>                        <div className="flex flex-col items-center justify-center space-y-2">

            <Button asChild className="w-full">                            <Avatar className="w-24 h-24 text-4xl">

              <Link href="/login">Login</Link>                                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />

            </Button>                                <AvatarFallback>{currentUser.initials}</AvatarFallback>

          </CardContent>                            </Avatar>

        </Card>                            <Button variant="outline" size="sm">Change Avatar</Button>

      </div>                        </div>

    );                    </CardContent>

  }                </Card>



  const isAdmin = currentUser.role === 'Admin';                 <Card>

  const hasActiveSubscription = hasLoyalty || hasVip;                    <CardHeader>

                        <CardTitle>Dashboard Preferences</CardTitle>

  const getPaymentMethodIcon = (method: PaymentMethod) => {                        <CardDescription>Customize which widgets are visible on your home dashboard.</CardDescription>

    switch (method) {                    </CardHeader>

      case 'bizum':                    <CardContent className="grid gap-4 sm:grid-cols-2">

        return <Smartphone className="h-4 w-4" />;                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">

      case 'transfer':                           <FormLabel htmlFor="goal-progress">Goal Roadmap</FormLabel>

        return <Building2 className="h-4 w-4" />;                           <Switch id="goal-progress" checked={widgetConfig.goalProgress} onCheckedChange={() => handleWidgetToggle('goalProgress')} />

      case 'cash':                        </div>

        return <Euro className="h-4 w-4" />;                         <div className="flex items-center justify-between p-4 bg-muted rounded-lg">

      case 'card':                           <FormLabel htmlFor="quick-actions">Quick Actions</FormLabel>

        return <CreditCard className="h-4 w-4" />;                           <Switch id="quick-actions" checked={widgetConfig.quickActions} onCheckedChange={() => handleWidgetToggle('quickActions')} />

      default:                        </div>

        return <WalletIcon className="h-4 w-4" />;                         <div className="flex items-center justify-between p-4 bg-muted rounded-lg">

    }                           <FormLabel htmlFor="next-session">Next Session</FormLabel>

  };                           <Switch id="next-session" checked={widgetConfig.nextSession} onCheckedChange={() => handleWidgetToggle('nextSession')} />

                        </div>

  return (                         <div className="flex items-center justify-between p-4 bg-muted rounded-lg">

    <div className="space-y-6">                           <FormLabel htmlFor="recent-activity">Recent Activity</FormLabel>

      {/* Header */}                           <Switch id="recent-activity" checked={widgetConfig.recentActivity} onCheckedChange={() => handleWidgetToggle('recentActivity')} />

      <div className="flex items-center justify-between">                        </div>

        <div>                    </CardContent>

          <h1 className="text-3xl font-bold tracking-tight">Account</h1>                </Card>

          <p className="text-muted-foreground">Manage your profile, wallet, and subscription</p>

        </div>                 <Card>

        <Button variant="outline" onClick={() => router.push('/settings')}>                    <CardHeader>

          Settings                        <CardTitle>Linked Accounts</CardTitle>

        </Button>                        <CardDescription>Manage parent/child or caregiver profiles connected to your account.</CardDescription>

      </div>                    </CardHeader>

                    <CardContent className="overflow-x-auto">

      {/* Tabs */}                        <div className="border rounded-lg">

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">                        <Table>

        <TabsList className="grid w-full grid-cols-3">                            <TableHeader>

          <TabsTrigger value="profile">                                <TableRow>

            <User className="h-4 w-4 mr-2" />                                    <TableHead className="min-w-[150px]">User</TableHead>

            Profile                                    <TableHead>Role</TableHead>

          </TabsTrigger>                                    <TableHead className='text-right'>Actions</TableHead>

          <TabsTrigger value="wallet">                                </TableRow>

            <WalletIcon className="h-4 w-4 mr-2" />                            </TableHeader>

            Wallet                            <TableBody>

          </TabsTrigger>                                {linkedAccounts.map(account => (

          <TabsTrigger value="subscription">                                    <TableRow key={account.id}>

            <Crown className="h-4 w-4 mr-2" />                                        <TableCell>

            Subscription                                            <div className="flex items-center gap-3">

          </TabsTrigger>                                                <Avatar className="h-8 w-8">

        </TabsList>                                                    <AvatarImage src={account.avatarUrl} alt={account.name} />

                                                    <AvatarFallback>{account.initials}</AvatarFallback>

        {/* Profile Tab */}                                                </Avatar>

        <TabsContent value="profile" className="space-y-6">                                                <span className="font-medium whitespace-nowrap">{account.name}</span>

          <AnimatedCard delay={100}>                                            </div>

            <Card>                                        </TableCell>

              <CardHeader>                                        <TableCell>

                <div className="flex items-center justify-between">                                            <span className='text-muted-foreground'>{account.role}</span>

                  <CardTitle className="flex items-center gap-2">                                        </TableCell>

                    <User className="h-5 w-5" />                                        <TableCell className='text-right'>

                    Profile Information                                            <DropdownMenu>

                  </CardTitle>                                                <DropdownMenuTrigger asChild>

                  {!isEditing ? (                                                    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>

                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>                                                </DropdownMenuTrigger>

                      <Edit className="h-4 w-4 mr-2" />                                                <DropdownMenuContent>

                      Edit                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>

                    </Button>                                                    <DropdownMenuItem>Remove Link</DropdownMenuItem>

                  ) : (                                                </DropdownMenuContent>

                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>                                            </DropdownMenu>

                      Cancel                                        </TableCell>

                    </Button>                                    </TableRow>

                  )}                                ))}

                </div>                            </TableBody>

              </CardHeader>                        </Table>

              <CardContent>                        </div>

                {!isEditing ? (                         <Button variant="outline" className="mt-4 w-full sm:w-auto">Add Linked Account</Button>

                  <div className="space-y-6">                    </CardContent>

                    <div className="flex items-center gap-4">                </Card>

                      <Avatar className="h-20 w-20">

                        {currentUser.avatarUrl && <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />}                <Card>

                        <AvatarFallback className="text-2xl">{currentUser.initials}</AvatarFallback>                    <CardHeader>

                      </Avatar>                        <CardTitle>Subscription</CardTitle>

                      <div className="space-y-1">                        <CardDescription>Manage your billing information and subscription plan.</CardDescription>

                        <div className="flex items-center gap-2">                    </CardHeader>

                          <h3 className="text-2xl font-semibold">{currentUser.name || currentUser.displayName}</h3>                    <CardContent className="space-y-4">

                          {currentUser.isVip && currentUser.vipTier && (                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted rounded-lg">

                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">                            <div>

                              <Crown className="h-3 w-3 mr-1" />                                <p className="font-semibold">EKA {currentUser.role} Plan</p>

                              {currentUser.vipTier}                                <p className="text-sm text-muted-foreground">Billed monthly. Next payment on Sep 1, 2024.</p>

                            </Badge>                            </div>

                          )}                             <Button variant="outline" asChild className='w-full sm:w-auto'>

                        </div>                                <Link href="/account/vip">Manage Plan</Link>

                        <Badge variant="outline">{currentUser.role}</Badge>                            </Button>

                      </div>                        </div>

                    </div>                    </CardContent>

                </Card>

                    <div className="grid gap-4 md:grid-cols-2">

                      <div className="space-y-2">                 <Card>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">                    <CardHeader>

                          <Mail className="h-4 w-4" />                        <CardTitle>Data Export</CardTitle>

                          <span>Email</span>                        <CardDescription>Download all your data as a PDF or CSV file.</CardDescription>

                        </div>                    </CardHeader>

                        <p className="font-medium">{currentUser.email}</p>                    <CardContent className="flex flex-col sm:flex-row gap-4">

                      </div>                       <Button variant="secondary" className='w-full sm:w-auto'>Export as PDF</Button>

                       <Button variant="secondary" className='w-full sm:w-auto'>Export as CSV</Button>

                      {currentUser.phoneNumber && (                    </CardContent>

                        <div className="space-y-2">                </Card>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">

                            <Phone className="h-4 w-4" />                {/* Donation Seeker Application - Only show if NOT already a donation seeker */}

                            <span>Phone</span>                {!currentUser.isDonationSeeker && (

                          </div>                  <Card className="border-dashed">

                          <p className="font-medium">{currentUser.phoneNumber}</p>                    <CardHeader>

                        </div>                      <CardTitle className="flex items-center gap-2">

                      )}                        <HandHeart className="h-5 w-5 text-primary" />

                        Need Financial Support?

                      {currentUser.location && (                      </CardTitle>

                        <div className="space-y-2">                      <CardDescription>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">                        Apply to receive donations from the community to help with therapy costs

                            <MapPin className="h-4 w-4" />                      </CardDescription>

                            <span>Location</span>                    </CardHeader>

                          </div>                    <CardContent>

                          <p className="font-medium">{currentUser.location}</p>                      <p className="text-sm text-muted-foreground mb-4">

                        </div>                        If you're facing financial challenges accessing mental health care, our community is here to help. 

                      )}                        Submit an application to be considered for donation support.

                      </p>

                      {currentUser.createdAt && (                      <Button 

                        <div className="space-y-2">                        variant="outline" 

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">                        onClick={() => setShowDonationSeekerForm(true)}

                            <Calendar className="h-4 w-4" />                        className="w-full sm:w-auto"

                            <span>Member Since</span>                      >

                          </div>                        Apply to Receive Donations

                          <p className="font-medium">{format(new Date(currentUser.createdAt), 'MMMM dd, yyyy')}</p>                      </Button>

                        </div>                    </CardContent>

                      )}                  </Card>

                    </div>                )}

                  </div>

                ) : (                <div className='flex justify-end'>

                  <Form {...form}>                    <Button type="submit" className='w-full sm:w-auto'>Update Profile</Button>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">                </div>

                      <FormField            </form>

                        control={form.control}        </Form>

                        name="name"

                        render={({ field }) => (        {/* Donation Seeker Application Form Dialog */}

                          <FormItem>        <DonationSeekerApplicationForm 

                            <FormLabel>Name</FormLabel>          open={showDonationSeekerForm}

                            <FormControl>          onClose={() => setShowDonationSeekerForm(false)}

                              <Input placeholder="Your name" {...field} />          onSubmit={handleDonationSeekerSubmit}

                            </FormControl>        />

                            <FormMessage />    </div>

                          </FormItem>  );

                        )}}

                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} disabled />
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
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 234 567 8900" {...field} />
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
                              <Input placeholder="City, Country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <Button type="submit">
                          <Check className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-6">
          {/* Balance Card */}
          <AnimatedCard delay={100}>
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WalletIcon className="h-5 w-5" />
                    Wallet Balance
                  </div>
                  <Dialog open={topUpDialogOpen} onOpenChange={setTopUpDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Top Up
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Top Up Wallet</DialogTitle>
                        <DialogDescription>
                          Add funds to your wallet using your preferred payment method
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (€)</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="1"
                            placeholder="50.00"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="method">Payment Method</Label>
                          <Select value={topUpMethod} onValueChange={(value: PaymentMethod) => setTopUpMethod(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">
                                <div className="flex items-center gap-2">
                                  <Euro className="h-4 w-4" />
                                  Cash
                                </div>
                              </SelectItem>
                              <SelectItem value="bizum">
                                <div className="flex items-center gap-2">
                                  <Smartphone className="h-4 w-4" />
                                  Bizum
                                </div>
                              </SelectItem>
                              <SelectItem value="transfer">
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  Bank Transfer
                                </div>
                              </SelectItem>
                              <SelectItem value="card" disabled>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  Card (Coming Soon)
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="proof">Payment Proof / Reference</Label>
                          <Textarea
                            id="proof"
                            placeholder="Enter transaction reference or payment details..."
                            value={proofText}
                            onChange={(e) => setProofText(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                          <div className="flex gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                              <p className="font-medium text-foreground mb-1">Verification Required</p>
                              <p>Your top-up request will be verified by our team. Funds will be added to your wallet once approved.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setTopUpDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleTopUp}>
                          Submit Request
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6">
                    <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
                    <p className="text-4xl font-bold text-primary">
                      €{loadingWallet ? '...' : wallet?.balance.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  
                  {/* Pending Requests */}
                  {paymentRequests.filter(req => req.status === 'pending').length > 0 && (
                    <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
                      <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {paymentRequests.filter(req => req.status === 'pending').length} pending top-up request(s)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Recent Transactions */}
          <AnimatedCard delay={200}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activity</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingWallet ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : transactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-sm">
                            {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="font-medium">{transaction.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.type}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                              {transaction.type === 'credit' ? '+' : '-'}€{transaction.amount.toFixed(2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <WalletIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No transactions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          {!isAdmin && (
            <AnimatedCard delay={100}>
              {hasActiveSubscription ? (
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-primary" />
                      Active Subscription
                    </CardTitle>
                    <CardDescription>Your current plan and benefits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {hasVip && (
                            <>
                              <Crown className="h-5 w-5 text-yellow-500" />
                              <span className="font-semibold text-lg">VIP Membership</span>
                              {currentUser.vipTier && (
                                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                                  {currentUser.vipTier}
                                </Badge>
                              )}
                            </>
                          )}
                          {hasLoyalty && !hasVip && (
                            <>
                              <Shield className="h-5 w-5 text-blue-500" />
                              <span className="font-semibold text-lg">Loyal Membership</span>
                              {currentUser.loyalTier && (
                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                                  {currentUser.loyalTier}
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {hasVip ? 'Enjoy premium features and priority support' : 'Access to exclusive loyalty benefits'}
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => router.push('/account/subscriptions')}>
                        Manage
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">Active</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Status</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">Premium</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Features</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Upgrade Your Experience
                    </CardTitle>
                    <CardDescription>Unlock premium features with Loyal or VIP membership</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Take your wellness journey to the next level with exclusive benefits, personalized support, and priority access.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative group overflow-hidden rounded-lg border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-6 hover:border-blue-500/40 transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full" />
                        <Shield className="h-8 w-8 text-blue-500 mb-3" />
                        <h3 className="text-xl font-bold mb-2">Loyal</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Enhanced therapy sessions and exclusive rewards
                        </p>
                        <ul className="space-y-2 text-sm mb-4">
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-blue-500" />
                            Priority booking
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-blue-500" />
                            Loyalty points
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-blue-500" />
                            Special discounts
                          </li>
                        </ul>
                        <Button 
                          className="w-full bg-blue-500 hover:bg-blue-600"
                          asChild
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          <Link href="/subscriptions">Get Loyal</Link>
                        </Button>
                      </div>

                      <div className="relative group overflow-hidden rounded-lg border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-6 hover:border-yellow-500/40 transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-bl-full" />
                        <Crown className="h-8 w-8 text-yellow-500 mb-3" />
                        <h3 className="text-xl font-bold mb-2">VIP</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Premium experience with exclusive perks
                        </p>
                        <ul className="space-y-2 text-sm mb-4">
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-yellow-500" />
                            All Loyal benefits
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-yellow-500" />
                            24/7 priority support
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-yellow-500" />
                            Exclusive events
                          </li>
                        </ul>
                        <Button 
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                          asChild
                        >
                          <Crown className="h-4 w-4 mr-2" />
                          <Link href="/subscriptions">Get VIP</Link>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Gift className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Special launch offer: Get 20% off your first month
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </AnimatedCard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
