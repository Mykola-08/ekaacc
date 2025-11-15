"use client";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, Select, SelectContent, SelectItem, SelectValue, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsItem, TabsList, Textarea } from '@/components/keep';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/supabase-auth";
import { useAppStore } from "@/store/app-store";
import { format } from "date-fns";
import { Wallet as WalletIcon, Plus, Save } from "lucide-react";
;
;
;
;
;
;
import { SettingsShell } from "@/components/eka/settings/settings-shell";
import { SettingsHeader } from "@/components/eka/settings/settings-header";

import type { User } from "@/lib/types";
import type { Wallet, WalletTransaction, PaymentRequest, PaymentMethod } from "@/lib/wallet-types";

// Helper function to convert Timestamp or string to Date
function toDate(timestamp: Date | string): Date {
    if (typeof timestamp === 'string') return new Date(timestamp);
    if (timestamp instanceof Date) return timestamp;
    return new Date();
}

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().readonly(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function MyAccountPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(searchParams.get("tab") ?? "profile");

  return (
    <SettingsShell>
      <SettingsHeader
        title="My Account"
        description="Manage your profile, wallet, and personal information."
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsItem value="profile">Profile</TabsItem>
          <TabsItem value="wallet">Wallet</TabsItem>
        </TabsList>
        <TabsContent value="profile">
          <ProfileSection currentUser={currentUser} refreshAppUser={refreshAppUser} authLoading={authLoading} />
        </TabsContent>
        <TabsContent value="wallet">
          <WalletSection currentUser={currentUser} authLoading={authLoading} />
        </TabsContent>
      </Tabs>
    </SettingsShell>
  );
}

// #region Profile Section
function ProfileSection({ currentUser, refreshAppUser, authLoading }: { currentUser: User | null, refreshAppUser: () => Promise<void>, authLoading: boolean }) {
  const dataService = useAppStore((state) => state.dataService);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: "", email: "", phoneNumber: "", location: "", about: "" },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name || currentUser.displayName || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
        location: currentUser.location || "",
        about: currentUser.bio || "",
      });
    }
  }, [currentUser, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!currentUser || !dataService) return;
    setIsSaving(true);
    try {
      await dataService.updateUser(currentUser.id, {
        name: data.name,
        phoneNumber: data.phoneNumber,
        location: data.location,
        bio: data.about,
      });
      await refreshAppUser();
      toast({ title: "Profile Updated", description: "Your information has been saved." });
      form.reset(data, { keepValues: true }); // keep the new values and reset dirty state
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) return <ProfileSkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      <Input placeholder="your@email.com" {...field} readOnly className="cursor-not-allowed bg-muted/50" />
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
                      <Input placeholder="(123) 456-7890" {...field} />
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
            </div>
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About You</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function ProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64 mt-1" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
// #endregion

// #region Wallet Section
function WalletSection({ currentUser, authLoading }: { currentUser: User | null, authLoading: boolean }) {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpMethod, setTopUpMethod] = useState<PaymentMethod>("bizum");
  const [proofText, setProofText] = useState("");

  const loadWalletData = useCallback(async () => {
    if (!currentUser) return;
    setLoadingWallet(true);
    try {
      const { getWalletService } = await import("@/services/wallet-service");
      const { getPaymentService } = await import("@/services/payment-service");
      const walletService = await getWalletService();
      const paymentService = await getPaymentService();
      const [walletData, transactionsData, paymentsData] = await Promise.all([
        walletService.getWallet(currentUser.id),
        walletService.getTransactions(currentUser.id, 5),
        paymentService.getUserPaymentRequests(currentUser.id),
      ]);
      setWallet(walletData);
      setTransactions(transactionsData);
      setPaymentRequests(paymentsData);
    } catch (e) {
      console.error("Error loading wallet data:", e);
      toast({ title: "Error", description: "Could not load wallet data.", variant: "destructive" });
    } finally {
      setLoadingWallet(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  const handleTopUpRequest = async () => {
    if (!currentUser) return;
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid positive number.", variant: "destructive" });
      return;
    }

    try {
      const { getPaymentService } = await import("@/services/payment-service");
      const paymentService = await getPaymentService();
      await paymentService.createPaymentRequest(
        currentUser.id,
        amount,
        topUpMethod,
        "pending",
        proofText,
        currentUser.name || "N/A",
      );
      toast({ title: "Top-up Request Submitted", description: "Your request is pending approval." });
      setTopUpDialogOpen(false);
      setTopUpAmount("");
      setProofText("");
      loadWalletData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit top-up request.", variant: "destructive" });
    }
  };

  if (loadingWallet || authLoading) return <WalletSkeleton />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          <WalletIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{wallet?.balance.toFixed(2) ?? '0.00'}</div>
          <p className="text-xs text-muted-foreground">
            Available funds for sessions and services.
          </p>
          <Button size="sm" className="mt-4" onClick={() => setTopUpDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Top Up Wallet
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your last 5 wallet movements.</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionTable transactions={transactions} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
          <CardDescription>Top-up requests awaiting admin approval.</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentRequestTable requests={paymentRequests.filter(r => r.status === 'pending')} />
        </CardContent>
      </Card>

      <TopUpDialog
        open={topUpDialogOpen}
        onOpenChange={setTopUpDialogOpen}
        amount={topUpAmount}
        setAmount={setTopUpAmount}
        method={topUpMethod}
        setMethod={setTopUpMethod}
        proof={proofText}
        setProof={setProofText}
        onSubmit={handleTopUpRequest}
      />
    </div>
  );
}

function TransactionTable({ transactions }: { transactions: WalletTransaction[] }) {
  if (transactions.length === 0) return <p className="text-sm text-muted-foreground">No transactions yet.</p>;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>{format(toDate(tx.createdAt), "MMM d, yyyy")}</TableCell>
            <TableCell>{tx.description}</TableCell>
            <TableCell className={`text-right font-medium ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
              {tx.type === 'credit' ? '+' : '-'}€{tx.amount.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function PaymentRequestTable({ requests }: { requests: PaymentRequest[] }) {
  if (requests.length === 0) return <p className="text-sm text-muted-foreground">No pending payments.</p>;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <TableRow key={req.id}>
            <TableCell>{format(toDate(req.createdAt), "MMM d, yyyy")}</TableCell>
            <TableCell className="capitalize">{req.method}</TableCell>
            <TableCell className="text-right font-medium">€{req.amount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TopUpDialog({ open, onOpenChange, amount, setAmount, method, setMethod, proof, setProof, onSubmit }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: string;
  setAmount: (amount: string) => void;
  method: PaymentMethod;
  setMethod: (method: PaymentMethod) => void;
  proof: string;
  setProof: (proof: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Request Wallet Top-up</ModalTitle>
          <ModalDescription>
            Submit a request for manual balance top-up. An admin will approve it shortly.
          </ModalDescription>
        </ModalHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (€)</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={method} onValueChange={(value) => setMethod(value as PaymentMethod)}>
              <SelectValue placeholder="Select method"  />
              <SelectContent>
                <SelectItem value="bizum">Bizum</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="proof">Proof / Reference</Label>
            <Textarea id="proof" value={proof} onChange={(e) => setProof(e.target.value)} placeholder="e.g., Transaction ID, or a note for the admin" />
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSubmit}>Submit Request</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function WalletSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-9 w-32 mt-4" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56 mt-1" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
// #endregion
