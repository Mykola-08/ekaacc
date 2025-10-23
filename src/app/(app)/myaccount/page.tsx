"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/unified-data-context";
import { AnimatedCard } from "@/components/eka/animated-card";
import { format } from "date-fns";
import type { Wallet, WalletTransaction, PaymentRequest, PaymentMethod } from "@/lib/wallet-types";
import { Wallet as WalletIcon, Plus, Check } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
});

export default function MyAccountPage() {
  const { currentUser, updateUser } = useData();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(searchParams.get("tab") ?? "profile");

  // Wallet state
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Top-up dialog
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpMethod, setTopUpMethod] = useState<PaymentMethod>("bizum");
  const [proofText, setProofText] = useState("");

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: "", email: "", phoneNumber: "", location: "", about: "" },
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name || currentUser.displayName || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
        location: (currentUser as any).location || "",
        about: (currentUser as any).about || "",
      });
      loadWalletData();
    }
  }, [currentUser]);

  const loadWalletData = async () => {
    if (!currentUser) return;
    try {
      setLoadingWallet(true);
      const { getWalletService } = await import("@/services/wallet-service");
      const { getPaymentService } = await import("@/services/payment-service");
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
      console.error("Error loading wallet data:", e);
    } finally {
      setLoadingWallet(false);
    }
  };

  const handleTopUp = async () => {
    if (!currentUser || !topUpAmount || parseFloat(topUpAmount) <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    try {
      const { getPaymentService } = await import("@/services/payment-service");
      const service = await getPaymentService();
      await service.createPaymentRequest(
        currentUser.id,
        parseFloat(topUpAmount),
        topUpMethod,
        "Wallet top-up",
        undefined,
        proofText
      );
      toast({ title: "Top-Up Request Submitted", description: `Your ${topUpMethod} payment of €${topUpAmount} is pending verification.` });
      setTopUpDialogOpen(false);
      setTopUpAmount("");
      setProofText("");
      loadWalletData();
    } catch (e) {
      toast({ title: "Error", description: "Failed to submit top-up request", variant: "destructive" });
    }
  };

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    updateUser({ name: values.name });
    toast({ title: "Profile Updated", description: "Your changes have been saved." });
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
          <Link href="/myaccount">Profile</Link>
          <Link href="/myaccount?tab=subscription">Subscription</Link>
          <Link href="/subscriptions">Plans</Link>
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
              <CardDescription>Compare plans and pick what suits you best.</CardDescription>
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
