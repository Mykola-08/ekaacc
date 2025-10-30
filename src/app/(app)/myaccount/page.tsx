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
import { useAuth } from "@/context/auth-context";
import { useAppStore } from "@/store/app-store";
import { AnimatedCard } from "@/components/eka/animated-card";
import { format } from "date-fns";
import type { Wallet, WalletTransaction, PaymentRequest, PaymentMethod } from "@/lib/wallet-types";
import { Wallet as WalletIcon, Plus, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/lib/types";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
});

export default function MyAccountPage() {
  const { appUser: currentUser, refreshAppUser, loading: authLoading } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
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
        location: currentUser.location || "",
        about: currentUser.bio || "",
      });
      loadWalletData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, form]);

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

  const handleProfileUpdate = async (values: z.infer<typeof profileFormSchema>) => {
    if (!currentUser || !dataService) return;
    try {
      await dataService.updateUser(currentUser.id, {
        name: values.name,
        displayName: values.name,
        phoneNumber: values.phoneNumber,
        location: values.location,
        bio: values.about,
      });
      await refreshAppUser();
      toast({ title: "Profile Updated", description: "Your account details have been saved." });
    } catch (error) {
      console.error("Failed to update profile", error);
      toast({ title: "Update Failed", description: "Could not save your profile.", variant: "destructive" });
    }
  };

  const handleTopUp = async () => {
    if (!currentUser || !topUpAmount || parseFloat(topUpAmount) <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    try {
      const { getPaymentService } = await import("@/services/payment-service");
      const paymentService = await getPaymentService();
      const proof = await paymentService.requestPayment({
        userId: currentUser.id,
        amount: parseFloat(topUpAmount),
        method: topUpMethod,
        description: "Wallet Top-up",
      });
      setProofText(proof.proof);
    } catch (e) {
      console.error("Error requesting payment:", e);
      toast({ title: "Top-up Failed", description: "Could not initiate top-up.", variant: "destructive" });
    }
  };

  const handleMarkAsPaid = async (requestId: string) => {
    try {
      const { getPaymentService } = await import("@/services/payment-service");
      const paymentService = await getPaymentService();
      await paymentService.markAsPaid(requestId);
      toast({ title: "Payment Confirmed", description: "The payment has been marked as paid." });
      loadWalletData(); // Refresh data
    } catch (e) {
      console.error("Error marking as paid:", e);
      toast({ title: "Confirmation Failed", variant: "destructive" });
    }
  };

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Tabs
            orientation="vertical"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full h-auto">
              <TabsTrigger value="profile" className="w-full justify-start p-3">Profile</TabsTrigger>
              <TabsTrigger value="wallet" className="w-full justify-start p-3">Wallet</TabsTrigger>
              <TabsTrigger value="subscriptions" className="w-full justify-start p-3">Subscriptions</TabsTrigger>
              <TabsTrigger value="security" className="w-full justify-start p-3">Security</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="md:col-span-2">
          <Tabs value={activeTab}>
            <TabsContent value="profile">
              <AnimatedCard>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
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
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} disabled />
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
                              <Input placeholder="+1 234 567 890" {...field} />
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
                      <FormField
                        control={form.control}
                        name="about"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About Me</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Tell us a little about yourself" className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </AnimatedCard>
            </TabsContent>
            <TabsContent value="wallet">
              <AnimatedCard>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>My Wallet</CardTitle>
                      <CardDescription>View your balance and transaction history.</CardDescription>
                    </div>
                    <Button onClick={() => setTopUpDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Top Up
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loadingWallet ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-40 w-full" />
                    </div>
                  ) : (
                    <>
                      <Card className="flex items-center justify-between p-6 bg-primary text-primary-foreground">
                        <div>
                          <p className="text-sm">Current Balance</p>
                          <p className="text-4xl font-bold">€{wallet?.balance.toFixed(2) ?? "0.00"}</p>
                        </div>
                        <WalletIcon className="h-12 w-12" />
                      </Card>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
                        {paymentRequests.length > 0 ? (
                          <div className="space-y-2">
                            {paymentRequests.map((req) => (
                              <Card key={req.id} className="flex justify-between items-center p-3">
                                <div>
                                  <p><strong>€{req.amount.toFixed(2)}</strong> via {req.method}</p>
                                  <p className="text-xs text-muted-foreground">{req.description}</p>
                                </div>
                                <Button size="sm" onClick={() => handleMarkAsPaid(req.id)}>
                                  <Check className="mr-2 h-4 w-4" /> I've Paid
                                </Button>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No pending payments.</p>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {transactions.length > 0 ? (
                              transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                  <TableCell>{format(new Date(tx.date), "MMM d, yyyy")}</TableCell>
                                  <TableCell>{tx.description}</TableCell>
                                  <TableCell className={`text-right font-medium ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                                    {tx.type === 'credit' ? '+' : '-'}€{tx.amount.toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center">No transactions yet.</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                </CardContent>
              </AnimatedCard>
            </TabsContent>
            <TabsContent value="subscriptions">
              <AnimatedCard>
                <CardHeader>
                  <CardTitle>Subscriptions</CardTitle>
                  <CardDescription>Manage your EKA subscription plans.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-medium">Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">
                      Subscription management will be available here shortly.
                    </p>
                  </div>
                </CardContent>
              </AnimatedCard>
            </TabsContent>
            <TabsContent value="security">
              <AnimatedCard>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your password and account security.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Change Password</Button>
                </CardContent>
              </AnimatedCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={topUpDialogOpen} onOpenChange={setTopUpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Your Wallet</DialogTitle>
            <DialogDescription>
              {proofText ? "Complete your payment and your balance will be updated shortly." : "Enter the amount and choose your payment method."}
            </DialogDescription>
          </DialogHeader>
          {proofText ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please use the following information to complete your payment of <strong>€{topUpAmount}</strong> via <strong>{topUpMethod}</strong>.
              </p>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                <pre className="text-sm whitespace-pre-wrap">{proofText}</pre>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Your balance will be updated automatically once payment is confirmed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (€)</Label>
                <Input id="amount" type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select value={topUpMethod} onValueChange={(v) => setTopUpMethod(v as PaymentMethod)}>
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bizum">Bizum</SelectItem>
                    <SelectItem value="revolut">Revolut</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setTopUpDialogOpen(false); setProofText(""); }}>
              {proofText ? "Close" : "Cancel"}
            </Button>
            {!proofText && <Button onClick={handleTopUp}>Request Payment</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
