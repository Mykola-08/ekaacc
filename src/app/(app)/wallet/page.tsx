'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/context/unified-data-context';
import { Wallet as WalletIcon, Plus, TrendingUp, TrendingDown, Clock, CreditCard, ShoppingCart, Eye, Upload } from 'lucide-react';
import type { Wallet, WalletTransaction, PaymentRequest, PaymentMethod, PurchasableItem, Purchase } from '@/lib/wallet-types';

export default function WalletPage() {
  const { currentUser } = useData();
  const { toast } = useToast();
  
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [purchasableItems, setPurchasableItems] = useState<PurchasableItem[]>([]);
  const [userPurchases, setUserPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Funds Dialog
  const [addFundsDialogOpen, setAddFundsDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bizum');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [proofText, setProofText] = useState('');
  const [proofImageUrl, setProofImageUrl] = useState('');
  
  // Purchase Dialog
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PurchasableItem | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadWalletData();
    }
  }, [currentUser]);

  const loadWalletData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const { getWalletService } = await import('@/services/wallet-service');
      const { getPaymentService } = await import('@/services/payment-service');
      
      const walletService = await getWalletService();
      const paymentService = await getPaymentService();

      const [
        walletData,
        transactionsData,
        paymentsData,
        itemsData,
        purchasesData
      ] = await Promise.all([
        walletService.getWallet(currentUser.id),
        walletService.getTransactions(currentUser.id),
        paymentService.getUserPaymentRequests(currentUser.id),
        walletService.getPurchasableItems(),
        walletService.getPurchases(currentUser.id)
      ]);

      setWallet(walletData);
      setTransactions(transactionsData);
      setPaymentRequests(paymentsData);
      setPurchasableItems(itemsData.filter(item => item.isActive));
      setUserPurchases(purchasesData);
    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wallet data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!currentUser || !paymentAmount || parseFloat(paymentAmount) <= 0) return;

    try {
      const { getPaymentService } = await import('@/services/payment-service');
      const service = await getPaymentService();

      await service.createPaymentRequest(
        currentUser.id,
        parseFloat(paymentAmount),
        paymentMethod,
        paymentDescription || 'Add funds to wallet',
        proofImageUrl || undefined,
        proofText || undefined
      );

      toast({
        title: 'Payment Request Created',
        description: 'Your payment request has been submitted for review',
      });

      setAddFundsDialogOpen(false);
      resetAddFundsForm();
      loadWalletData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create payment request',
        variant: 'destructive',
      });
    }
  };

  const handlePurchase = async () => {
    if (!currentUser || !selectedItem || !wallet) return;

    try {
      const { getWalletService } = await import('@/services/wallet-service');
      const service = await getWalletService();

      // Check if can afford
      const canAfford = await service.canAfford(currentUser.id, selectedItem.price);
      if (!canAfford) {
        toast({
          title: 'Insufficient Funds',
          description: 'You do not have enough balance for this purchase',
          variant: 'destructive',
        });
        return;
      }

      await service.createPurchase(
        currentUser.id,
        selectedItem.id,
        1,
        0
      );

      toast({
        title: 'Purchase Successful',
        description: `You have purchased ${selectedItem.name}`,
      });

      setPurchaseDialogOpen(false);
      setSelectedItem(null);
      loadWalletData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete purchase',
        variant: 'destructive',
      });
    }
  };

  const handleCancelPayment = async (paymentId: string) => {
    if (!currentUser) return;

    try {
      const { getPaymentService } = await import('@/services/payment-service');
      const service = await getPaymentService();

      await service.cancelPaymentRequest(paymentId, currentUser.id);

      toast({
        title: 'Payment Cancelled',
        description: 'Your payment request has been cancelled',
      });

      loadWalletData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel payment request',
        variant: 'destructive',
      });
    }
  };

  const resetAddFundsForm = () => {
    setPaymentAmount('');
    setPaymentMethod('bizum');
    setPaymentDescription('');
    setProofText('');
    setProofImageUrl('');
  };

  const getTransactionIcon = (type: string) => {
    if (type.includes('credit') || type.includes('reward') || type === 'refund') {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getTransactionColor = (type: string) => {
    if (type.includes('credit') || type.includes('reward') || type === 'refund') {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      rejected: 'destructive',
      cancelled: 'outline',
      expired: 'outline',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading your wallet...</div>
      </div>
    );
  }

  if (!currentUser || !wallet) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Not Available</CardTitle>
            <CardDescription>Unable to load wallet information</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Wallet</h1>
          <p className="text-muted-foreground">Manage your balance and purchases</p>
        </div>
        <Dialog open={addFundsDialogOpen} onOpenChange={setAddFundsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Funds to Wallet</DialogTitle>
              <DialogDescription>
                Submit a payment request to add funds to your wallet
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Amount (€) *</Label>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="50.00"
                />
              </div>

              <div>
                <Label>Payment Method *</Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bizum">Bizum</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  placeholder="Add funds to my wallet"
                  rows={2}
                />
              </div>

              {paymentMethod === 'bizum' && (
                <div>
                  <Label>Reference Number</Label>
                  <Input
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    placeholder="Bizum transaction reference"
                  />
                </div>
              )}

              <div>
                <Label>Proof Image URL (Optional)</Label>
                <Input
                  type="url"
                  value={proofImageUrl}
                  onChange={(e) => setProofImageUrl(e.target.value)}
                  placeholder="https://example.com/proof.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload screenshot of payment proof to image hosting service
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAddFundsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddFunds}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
              >
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletIcon className="h-6 w-6" />
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold mb-4">
            €{wallet.balance.toFixed(2)}
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <div className="text-purple-100">Status</div>
              <div className="font-semibold">
                {wallet.isPaused ? '⏸️ Paused' : '✓ Active'}
              </div>
            </div>
            <div>
              <div className="text-purple-100">Last Updated</div>
              <div className="font-semibold">
                {new Date((wallet.lastTransactionAt || wallet.createdAt) as string).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payments">Payment Requests</TabsTrigger>
          <TabsTrigger value="shop">Shop</TabsTrigger>
          <TabsTrigger value="purchases">My Purchases</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent wallet activity</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.createdAt as string).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTransactionIcon(transaction.type)}
                            <span className="capitalize">{transaction.type.replace(/_/g, ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className={`text-right font-bold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type.includes('credit') || transaction.type.includes('reward') || transaction.type === 'refund' ? '+' : '-'}
                          €{transaction.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Requests Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Requests</CardTitle>
              <CardDescription>Track your fund addition requests</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No payment requests yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentRequests.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {new Date(payment.createdAt as string).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-bold">€{payment.amount.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{payment.method}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>
                          {payment.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelPayment(payment.id)}
                            >
                              Cancel
                            </Button>
                          )}
                          {payment.status === 'rejected' && payment.rejectionReason && (
                            <p className="text-sm text-red-600">{payment.rejectionReason}</p>
                          )}
                          {payment.status === 'confirmed' && (
                            <p className="text-sm text-green-600">✓ Confirmed</p>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shop Tab */}
        <TabsContent value="shop">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchasableItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <Badge>{item.type}</Badge>
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-purple-600">
                      €{item.price.toFixed(2)}
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedItem(item);
                        setPurchaseDialogOpen(true);
                      }}
                      disabled={wallet.balance < item.price || wallet.isPaused}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy
                    </Button>
                  </div>
                  {wallet.balance < item.price && (
                    <p className="text-sm text-red-600 mt-2">Insufficient balance</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Purchases Tab */}
        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>My Purchases</CardTitle>
              <CardDescription>Your purchase history</CardDescription>
            </CardHeader>
            <CardContent>
              {userPurchases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No purchases yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>
                          {new Date(purchase.createdAt as string).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{purchase.itemName}</div>
                            <div className="text-sm text-muted-foreground">Qty: {purchase.quantity}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge>{purchase.itemType}</Badge>
                        </TableCell>
                        <TableCell className="font-bold">€{purchase.finalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          {getStatusBadge(purchase.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              Are you sure you want to purchase this item?
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Item:</div>
                <div className="font-medium">{selectedItem.name}</div>
                
                <div className="text-muted-foreground">Price:</div>
                <div className="font-medium">€{selectedItem.price}</div>
                
                <div className="text-muted-foreground">Current Balance:</div>
                <div className="font-medium">€{wallet.balance.toFixed(2)}</div>
                
                <div className="text-muted-foreground">After Purchase:</div>
                <div className="font-medium">€{(wallet.balance - selectedItem.price).toFixed(2)}</div>
              </div>

              <div className="p-4 bg-muted rounded">
                <p className="text-sm">{selectedItem.description}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPurchaseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePurchase}>
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
