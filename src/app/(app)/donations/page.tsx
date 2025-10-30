'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, HandHeart } from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { useToast } from '@/hooks/use-toast';
import type { Donation, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { DonationSeekerApplicationForm } from '@/components/eka/forms/donation-seeker-application-form';
import type { DonationSeekerData } from '@/components/eka/forms/donation-seeker-application-form';

export default function DonationsPage() {
  const { appUser: currentUser, user, refreshAppUser } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const { toast } = useToast();

  const [amount, setAmount] = useState<number | ''>('');
  const [recipient, setRecipient] = useState<string>('any');
  const [userDonations, setUserDonations] = useState<Donation[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    if (dataService && user?.uid) {
      setIsLoading(true);
      Promise.all([
        dataService.getDonations(user.uid),
        dataService.getAllUsers(),
      ]).then(([donations, users]) => {
        setUserDonations(donations || []);
        setAllUsers(users || []);
      }).finally(() => {
        setIsLoading(false);
      });
    } else if (!user) {
      setIsLoading(false);
    }
  }, [dataService, user]);

  const donationStats = useMemo(() => {
    if (!userDonations) {
      return { totalDonated: 0, sessionsFunded: 0, livesTouched: 0 };
    }
    const totalDonated = userDonations.reduce((acc, d) => acc + d.amount, 0);
    const sessionsFunded = Math.floor(totalDonated / 50); // Assuming 50 per session
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

  const potentialRecipients = useMemo(() => allUsers.filter(u => u.id !== currentUser?.id && u.isDonationSeeker), [allUsers, currentUser]);

  const handleDonate = async () => {
    if (!currentUser || !dataService || !amount) {
      toast({ title: 'Please select an amount', variant: 'destructive' });
      return;
    }

    toast({ title: 'Processing your donation...' });

    const newDonation: Omit<Donation, 'id'> = {
      donorId: currentUser.id,
      receiverId: recipient,
      amount: amount,
      date: new Date().toISOString(),
      isAnonymous: false, // Add UI for this later
    };

    const savedDonation = await dataService.addDonation(newDonation);

    if (savedDonation) {
      setUserDonations(prev => [...prev, savedDonation]);
      toast({
        title: 'Thank you for your donation!',
        description: `You successfully donated €${amount}.`,
      });
      setAmount('');
    } else {
      toast({
        title: 'Donation Failed',
        description: 'There was a problem processing your donation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleApplicationSubmit = async (data: DonationSeekerData) => {
    if (!dataService || !currentUser) return;

    console.log('Application submitted:', data);
    // Store application data - mark as pending for admin review
    await dataService.updateUser(currentUser.id, {
      isDonationSeekerApplicationPending: true,
      donationSeekerReason: data.reasonForSupport,
    });
    await refreshAppUser();

    toast({
      title: 'Application submitted!',
      description: 'Your donation seeker application has been submitted for review.',
    });
    setShowApplicationForm(false);
  };

  const isDonationSeeker = currentUser?.isDonationSeeker;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="custom-amount">Or Custom Amount (€)</Label>
                            <Input 
                                id="custom-amount" 
                                type="number" 
                                placeholder="e.g. 75" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="recipient">Recipient</Label>
                            <Select value={recipient} onValueChange={setRecipient}>
                                <SelectTrigger id="recipient">
                                    <SelectValue placeholder="Select a recipient" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Anyone in need</SelectItem>
                                    {potentialRecipients.map(user => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button 
                        size="lg" 
                        className="w-full text-lg" 
                        onClick={handleDonate}
                        disabled={!amount || amount <= 0}
                    >
                        <Heart className="mr-2 h-5 w-5" /> Donate €{amount || '...'}
                    </Button>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Your Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Total Donated</span>
                        <span className="font-bold text-xl">€{donationStats.totalDonated.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Sessions Funded</span>
                        <span className="font-bold text-xl">{donationStats.sessionsFunded}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Lives Touched</span>
                        <span className="font-bold text-xl">{donationStats.livesTouched}</span>
                    </div>
                </CardContent>
            </Card>

            {showApplicationForm ? (
              <DonationSeekerApplicationForm 
                onSubmit={handleApplicationSubmit} 
                onCancel={() => setShowApplicationForm(false)} 
                onClose={() => setShowApplicationForm(false)}
                open={true}
              />
            ) : (
              <Card className="bg-gray-50 dark:bg-gray-900/50">
                <CardHeader>
                  <CardTitle>Need Financial Assistance?</CardTitle>
                  <CardDescription>
                    {isDonationSeeker 
                      ? "Your profile is active to receive donations." 
                      : "Apply to receive support from our community."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isDonationSeeker && (
                    <Button className="w-full" onClick={() => setShowApplicationForm(true)}>
                      <HandHeart className="mr-2 h-4 w-4" /> Apply Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}




