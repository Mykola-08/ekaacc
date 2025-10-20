"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Plus, Minus, TrendingUp, Wallet, Package } from "lucide-react";
import type { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  // Mock data - in real implementation, this would come from the database
  const [currentBalance, setCurrentBalance] = useState(150.00);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2025-10-15',
      type: 'credit',
      amount: 200.00,
      description: 'Initial balance',
      balance: 200.00,
    },
    {
      id: '2',
      date: '2025-10-18',
      type: 'debit',
      amount: 50.00,
      description: 'Physical Therapy Session',
      balance: 150.00,
    },
  ]);

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

    setTransactions([newTransaction, ...transactions]);
    setCurrentBalance(newBalance);
    setIsAddBalanceOpen(false);
    setAmount(0);
    setDescription('');

    toast({
      title: "Balance Added",
      description: `€${amount.toFixed(2)} has been added to ${client.name}'s account.`,
    });
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

    setTransactions([newTransaction, ...transactions]);
    setCurrentBalance(newBalance);
    setIsSubtractBalanceOpen(false);
    setAmount(0);
    setDescription('');

    toast({
      title: "Balance Deducted",
      description: `€${amount.toFixed(2)} has been deducted from ${client.name}'s account.`,
    });
  };

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
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      transaction.type === 'credit' ? 'default' : 
                      transaction.type === 'debit' ? 'secondary' : 
                      'outline'
                    }>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={`text-right font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
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
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
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
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleSubtractBalance}>Deduct Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
