"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/platform/ui/avatar';
import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Input } from '@/components/platform/ui/input';
import { Label } from '@/components/platform/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/platform/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/platform/ui/table';
import { useState } from "react";
;
;
;
;
;
;
;
import { useToast } from "@/hooks/platform/use-toast";
import { useEffect } from "react";
import fxService from '@/lib/platform/fx-service';
import { CreditCard, Plus, Minus, TrendingUp, Wallet, Package } from "lucide-react";
import { BillingPackages } from './billing-packages';
import type { User } from "@/lib/platform/types";
;

interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit' | 'payment' | 'refund';
  amount: number;
  description: string;
  balance: number;
}

interface ClientBillingProps {
  client: User;
  isAdmin: boolean;
}

export function ClientBilling({ client, isAdmin }: ClientBillingProps) {
  const { toast } = useToast();
  const [isAddBalanceOpen, setIsAddBalanceOpen] = useState(false);
  const [isSubtractBalanceOpen, setIsSubtractBalanceOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');

  const [currentBalance, setCurrentBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
  const [invoiceDesc, setInvoiceDesc] = useState<string>('');

  const packageUsage = {
    packageName: 'Wellness Package - 10 Sessions',
    totalSessions: 10,
    usedSessions: 3,
    remainingSessions: 7,
    expiryDate: '2025-12-31',
  };

  const handleAddBalance = () => {
    if (amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a positive amount.",
      });
      return;
    }

    const newBalance = currentBalance + amount;
    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'credit',
      amount,
      description: description || 'Manual balance addition',
      balance: newBalance,
    };

    // Persist via fxService
    (async () => {
      try {
        const tx = await fxService.applyAdjustment(client.id, amount, description || 'Manual balance addition');
        const res = await fxService.getBalanceForClient(client.id);
        setCurrentBalance(res.balance || 0);
        setTransactions((res.transactions || []).map((t:any)=>({ id: t.id, date: t.createdAt.split('T')[0], type: t.amountEUR >=0 ? 'credit' : 'debit', amount: Math.abs(t.amountEUR), description: t.note || '', balance: 0 })));
        toast({ title: "Balance Added", description: `€${amount.toFixed(2)} has been added to ${client.name}'s account.` });
      } catch (e) {
        toast({ variant: 'destructive', title: 'Add failed', description: (e as any)?.message || 'Could not add funds' });
      }
      setIsAddBalanceOpen(false);
      setAmount(0);
      setDescription('');
    })();
  };

  const handleSubtractBalance = () => {
    if (amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a positive amount.",
      });
      return;
    }

    if (amount > currentBalance) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "Cannot subtract more than the current balance.",
      });
      return;
    }

    const newBalance = currentBalance - amount;
    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'debit',
      amount,
      description: description || 'Manual balance deduction',
      balance: newBalance,
    };

    (async () => {
      try {
        const tx = await fxService.applyAdjustment(client.id, -Math.abs(amount), description || 'Manual balance deduction');
        const res = await fxService.getBalanceForClient(client.id);
        setCurrentBalance(res.balance || 0);
        setTransactions((res.transactions || []).map((t:any)=>({ id: t.id, date: t.createdAt.split('T')[0], type: t.amountEUR >=0 ? 'credit' : 'debit', amount: Math.abs(t.amountEUR), description: t.note || '', balance: 0 })));
        toast({ title: "Balance Deducted", description: `€${amount.toFixed(2)} has been deducted from ${client.name}'s account.` });
      } catch (e) {
        toast({ variant: 'destructive', title: 'Deduct failed', description: (e as any)?.message || 'Could not deduct funds' });
      }
      setIsSubtractBalanceOpen(false);
      setAmount(0);
      setDescription('');
    })();
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!client) return;
      setLoading(true);
      setTransactionsError(null);
      setInvoicesError(null);
      
      try {
        const res = await (fxService.getBalanceForClient ? fxService.getBalanceForClient(client.id) : { balance: 0, transactions: [] });
        if (!mounted) return;
        setCurrentBalance(res.balance);
        setTransactions(res.transactions.map((t: any) => ({
          id: t.id,
          date: t.createdAt.split('T')[0],
          type: t.amountEUR >= 0 ? 'credit' : 'debit',
          amount: Math.abs(t.amountEUR),
          description: t.note || '',
          balance: 0,
        })));
      } catch (error) {
        console.error('Failed to fetch balance and transactions:', error);
        setTransactionsError('Failed to load transaction history.');
        if (!mounted) return;
        setCurrentBalance(0);
        setTransactions([]);
      }
      
      // load invoices
      try {
        const invs = await fxService.getInvoicesForClient(client.id);
        if (mounted) setInvoices(invs || []);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
        setInvoicesError('Failed to load invoices.');
        if (mounted) setInvoices([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [client]);

  return (
    <div className="space-y-6">
      {/* Client Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={client.avatarUrl} alt={client.name} />
              <AvatarFallback>{client.initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{client.name}</CardTitle>
              <CardDescription>{client.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Internal Account Balance
          </CardTitle>
          <CardDescription>Current available balance in the client's internal account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-primary">€{currentBalance.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">Available Balance</p>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsAddBalanceOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Funds
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsSubtractBalanceOpen(true)}>
                  <Minus className="h-4 w-4 mr-1" />
                  Deduct Funds
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Package Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Package Usage
          </CardTitle>
          <CardDescription>Session packages and remaining credits.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{packageUsage.packageName}</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Used: {packageUsage.usedSessions}/{packageUsage.totalSessions}</span>
                <span>•</span>
                <span>Remaining: {packageUsage.remainingSessions}</span>
                <span>•</span>
                <span>Expires: {packageUsage.expiryDate}</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(packageUsage.usedSessions / packageUsage.totalSessions) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Packages */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Packages</CardTitle>
          <CardDescription>Sell session packages to this client.</CardDescription>
        </CardHeader>
        <CardContent>
          <BillingPackages clientId={client.id} />
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>Recent account activity and payment history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading transactions...
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!loading && transactionsError && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-red-500">
                      <p>{transactionsError}</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                        Retry
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!loading && !transactionsError && transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
              {!loading && !transactionsError && transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'credit' ? 'default' : 'outline'} className={
                      transaction.type === 'credit' 
                        ? 'text-success border-success/20 bg-success/5' 
                        : 'text-muted-foreground border-muted/30 bg-muted/10'
                    }>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={`text-right font-semibold ${
                    transaction.type === 'credit' ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}€{transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">€{transaction.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Outstanding invoices and history.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div />
            <div>
              <Button onClick={() => setIsCreateInvoiceOpen(true)}>Create Invoice</Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading invoices...
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!loading && invoicesError && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-red-500">
                      <p>{invoicesError}</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                        Retry
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!loading && !invoicesError && invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No invoices found
                  </TableCell>
                </TableRow>
              )}
              {!loading && !invoicesError && invoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.id}</TableCell>
                  <TableCell>€{inv.amountEUR.toFixed(2)}</TableCell>
                  <TableCell>{inv.description}</TableCell>
                  <TableCell>{inv.status}</TableCell>
                  <TableCell className="text-right">
                    {inv.status === 'open' && <Button size="sm" onClick={async ()=>{ try{ await fxService.markInvoicePaid(inv.id); const res = await fxService.getBalanceForClient(client.id); setCurrentBalance(res.balance || 0); setTransactions((res.transactions||[]).map((t:any)=>({ id: t.id, date: t.createdAt.split('T')[0], type: t.amountEUR>=0?'credit':'debit', amount: Math.abs(t.amountEUR), description: t.note||'', balance:0 }))); setInvoices(await fxService.getInvoicesForClient(client.id)); toast({ title: 'Invoice paid' }); } catch(e){ toast({ variant:'destructive', title:'Mark paid failed' }); } }}>Mark Paid</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Balance Dialog */}
      <Dialog open={isAddBalanceOpen} onOpenChange={setIsAddBalanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds to Account</DialogTitle>
            <DialogDescription>
              Add funds to {client.name}'s internal account balance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-amount">Amount (€)</Label>
              <Input
                id="add-amount"
                type="number"
                placeholder="0.00"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                min="0"
                step="10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-description">Description (Optional)</Label>
              <Input
                id="add-description"
                placeholder="e.g., Payment received, Package purchase"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBalanceOpen(false)}>Cancel</Button>
            <Button onClick={handleAddBalance}>Add Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subtract Balance Dialog */}
      <Dialog open={isSubtractBalanceOpen} onOpenChange={setIsSubtractBalanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deduct Funds from Account</DialogTitle>
            <DialogDescription>
              Deduct funds from {client.name}'s internal account balance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subtract-amount">Amount (€)</Label>
              <Input
                id="subtract-amount"
                type="number"
                placeholder="0.00"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                min="0"
                step="10"
                max={currentBalance}
              />
              <p className="text-sm text-muted-foreground">
                Available balance: €{currentBalance.toFixed(2)}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subtract-description">Description (Optional)</Label>
              <Input
                id="subtract-description"
                placeholder="e.g., Session payment, Refund issued"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubtractBalanceOpen(false)}>Cancel</Button>
            <Button variant="default" className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleSubtractBalance}>Deduct Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>Create an invoice for this client.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Amount (€)</Label>
              <Input type="number" value={invoiceAmount || ''} onChange={(e:any)=>setInvoiceAmount(parseFloat(e.target.value||'0'))} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={invoiceDesc} onChange={(e:any)=>setInvoiceDesc(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateInvoiceOpen(false)}>Cancel</Button>
            <Button onClick={async ()=>{ try{ const inv = await fxService.createInvoice(client.id, invoiceAmount, invoiceDesc); setInvoices(prev=>[inv, ...prev]); toast({ title: 'Invoice created' }); setIsCreateInvoiceOpen(false); setInvoiceAmount(0); setInvoiceDesc(''); }catch(e){ toast({ variant:'destructive', title:'Create invoice failed' }); } }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
