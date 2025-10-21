
'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";
import { useData } from '@/context/unified-data-context';
import { useToast } from '@/hooks/use-toast';
import type { Donation, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DonationsPage() {
  const { currentUser, allUsers } = useData();
  const { toast } = useToast();
  const [amount, setAmount] = useState<number | ''>('');
  const [recipient, setRecipient] = useState<string>('any');
  const isLoadingUsers = !allUsers;
  const [userDonations, setUserDonations] = useState<any[]>([]);
  const isLoadingDonations = false;

  const donationStats = useMemo(() => {
    if (!userDonations) {
      return { totalDonated: 0, sessionsFunded: 0, livesTouched: 0 };
    }
    const totalDonated = userDonations.reduce((acc, d) => acc + d.amount, 0);
    const sessionsFunded = Math.floor(totalDonated / 50);
    const uniqueReceivers = new Set(userDonations.map(d => d.receiverId));
    return {
      totalDonated,
      sessionsFunded,
      livesTouched: uniqueReceivers.size,
    };
  }, [userDonations]);

  const handleAmountClick = (val: number) => {
    setAmount(val);
  };

  const potentialRecipients = useMemo(() => (allUsers || []).filter(u => u.role !== 'Admin'), [allUsers]);

  const handleDonate = () => {
    if (!currentUser) return;
    toast({ title: 'Processing your donation...' });
    const newDonation = {
      donorId: currentUser.uid,
      receiverId: recipient,
      amount: amount,
      date: new Date().toISOString(),
      isAnonymous: false,
    };
    setTimeout(() => {
      setUserDonations(prev => [...prev, newDonation]);
      toast({
        title: 'Thank you for your donation!',
        description: `You successfully donated €${amount}.`,
      });
      setAmount('');
    }, 700);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Make a Donation</CardTitle>
                    <CardDescription>Support someone's journey to wellness. Your contribution makes a real difference.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[25, 50, 100, 250].map(val => (
                            <Button 
                                key={val} 
                                variant={amount === val ? 'default' : 'outline'} 
                                className="h-16 text-lg"
                                onClick={() => handleAmountClick(val)}
                            >
                                €{val}
                            </Button>
                        ))}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Or enter a custom amount</Label>
                        <Input 
                            id="amount" 
                            type="number" 
                            placeholder="€50.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : '')} 
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="recipient">Recipient</Label>
                        <Select value={recipient} onValueChange={setRecipient}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a recipient (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Help anyone in need</SelectItem>
                                {isLoadingUsers ? <SelectItem value="loading" disabled>Loading...</SelectItem> : potentialRecipients?.map(user => (
                                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="w-full sm:w-auto sm:justify-self-end" onClick={handleDonate} disabled={isLoadingDonations}>
                        Donate Now
                    </Button>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /> Your Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoadingDonations ? (
                    <div className="space-y-6">
                      {[1,2,3].map(i => (
                        <div key={i} className="text-center space-y-1">
                          <Skeleton className="h-4 w-24 mx-auto" />
                          <Skeleton className="h-10 w-32 mx-auto" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                          <p className="text-sm text-muted-foreground">Total Donated</p>
                          <p className="text-4xl font-bold">€{donationStats.totalDonated.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                          <p className="text-sm text-muted-foreground">Sessions Funded</p>
                          <p className="text-4xl font-bold">{donationStats.sessionsFunded}</p>
                      </div>
                      <div className="text-center">
                          <p className="text-sm text-muted-foreground">Lives Touched</p>
                          <p className="text-4xl font-bold">{donationStats.livesTouched}</p>
                      </div>
                    </>
                  )}
                </CardContent>
            </Card>
        </div>
    </div>
  	);
  }




    