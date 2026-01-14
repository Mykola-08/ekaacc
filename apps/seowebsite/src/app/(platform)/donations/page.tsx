'use client';

import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Input } from '@/components/platform/ui/input';
import { Label } from '@/components/platform/ui/label';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/platform/ui/select';
import { Skeleton } from '@/components/platform/ui/skeleton';
import { useState, useMemo, useEffect } from 'react';
import { Heart, HandHeart } from "lucide-react";
import { useAuth } from '@/lib/platform/supabase/auth';
import { useAppStore } from '@/store/platform/app-store';
import { useToast } from '@/hooks/platform/ui/use-toast';
import type { Donation, User } from '@/lib/platform/types/types';
import { DonationSeekerApplicationForm } from '@/components/platform/eka/forms/donation-seeker-application-form';
import type { DonationSeekerData } from '@/components/platform/eka/forms/donation-seeker-application-form';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function DonationsPage() {
 const { user: currentUser } = useAuth();
 const dataService = useAppStore((state: any) => state.dataService);
 const { toast } = useToast();
 const { t } = useLanguage();

 const [amount, setAmount] = useState<number | ''>('');
 const [recipient, setRecipient] = useState<string>('any');
 const [userDonations, setUserDonations] = useState<Donation[]>([]);
 const [allUsers, setAllUsers] = useState<User[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [showApplicationForm, setShowApplicationForm] = useState(false);

 useEffect(() => {
  if (dataService && currentUser?.id) {
   setIsLoading(true);
   Promise.all([
    dataService.getDonations(currentUser.id),
    dataService.getAllUsers(),
   ]).then(([donations, users]) => {
    setUserDonations(donations || []);
    setAllUsers(users || []);
   }).finally(() => {
    setIsLoading(false);
   });
  } else if (!currentUser) {
   setIsLoading(false);
  }
 }, [dataService, currentUser]);

 const donationStats = useMemo(() => {
  if (!userDonations) {
   return { totalDonated: 0, sessionsFunded: 0, livesTouched: 0 };
  }
  const totalDonated = userDonations.reduce((acc: any, d: any) => acc + d.amount, 0);
  const sessionsFunded = Math.floor(totalDonated / 50); // Assuming 50 per session
  const uniqueReceivers = new Set(userDonations.map((d: any) => d.receiverId));
  return {
   totalDonated,
   sessionsFunded,
   livesTouched: uniqueReceivers.size,
  };
 }, [userDonations]);

 const handleAmountClick = (val: number) => {
  setAmount(val);
 };

 const potentialRecipients = useMemo(() => allUsers.filter((u: any) => u.id !== currentUser?.id && (u as any).user_metadata?.isDonationSeeker), [allUsers, currentUser]);

 const handleDonate = async () => {
  if (!currentUser || !dataService || !amount) {
   toast({ title: t('donations.page.pleaseSelectAmount'), variant: 'destructive' });
   return;
  }

  toast({ title: t('donations.page.processing') });

  const newDonation: Omit<Donation, 'id'> = {
   donorId: currentUser.id,
   receiverId: recipient,
   amount: amount,
   date: new Date().toISOString(),
   isAnonymous: false, // Add UI for this later
  };

  const savedDonation = await dataService.addDonation(newDonation);

  if (savedDonation) {
   setUserDonations((prev: any) => [...prev, savedDonation]);
   toast({
    title: t('donations.page.thankYouTitle'),
    description: t('donations.page.thankYouDesc').replace('{amount}', amount.toString()),
   });
   setAmount('');
  } else {
   toast({
    title: t('donations.page.failedTitle'),
    description: t('donations.page.failedDesc'),
    variant: 'destructive',
   });
  }
 };

 const handleApplicationSubmit = async (data: DonationSeekerData) => {
  if (!dataService || !currentUser) return;

  console.log('Application submitted:', data);
  // Store application data - mark as pending for admin review
  await dataService.updateUser(currentUser.id, {
   user_metadata: {
    ...(currentUser.user_metadata || {}),
    isDonationSeekerApplicationPending: true,
    donationSeekerReason: data.reasonForSupport,
   }
  } as any);

  toast({
   title: t('donations.page.applicationSubmittedTitle'),
   description: t('donations.page.applicationSubmittedDesc'),
  });
  setShowApplicationForm(false);
 };

 const isDonationSeeker = currentUser?.user_metadata?.isDonationSeeker;

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
          <CardTitle>{t('donations.page.makeDonation')}</CardTitle>
          <CardDescription>{t('donations.page.makeDonationDesc')}</CardDescription>
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
              <Label htmlFor="custom-amount">{t('donations.page.customAmount')}</Label>
              <Input 
                id="custom-amount" 
                type="number" 
                placeholder="e.g. 75" 
                value={amount}
                onChange={(e: any) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recipient">{t('donations.page.recipient')}</Label>
              <Select value={recipient} onValueChange={setRecipient}>
                <SelectValue placeholder={t('donations.page.recipientPlaceholder')} />
                <SelectContent>
                  <SelectItem value="any">{t('donations.page.recipientAny')}</SelectItem>
                  {potentialRecipients.map((user: any) => (
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
            <Heart className="mr-2 h-5 w-5" /> {t('donations.page.donateButton').replace('€', '')}€{amount || '...'}
          </Button>
        </CardContent>
      </Card>
    </div>
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('donations.page.yourImpact')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground dark:text-muted-foreground/80">{t('donations.page.totalDonated')}</span>
            <span className="font-bold text-xl">€{donationStats.totalDonated.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground dark:text-muted-foreground/80">{t('donations.page.sessionsFunded')}</span>
            <span className="font-bold text-xl">{donationStats.sessionsFunded}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground dark:text-muted-foreground/80">{t('donations.page.livesTouched')}</span>
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
       <Card className="bg-muted/30 dark:bg-gray-900/50">
        <CardHeader>
         <CardTitle>{t('donations.page.needHelpTitle')}</CardTitle>
         <CardDescription>
          {isDonationSeeker 
           ? t('donations.page.seekerActive')
           : t('donations.page.applyDesc')}
         </CardDescription>
        </CardHeader>
        <CardContent>
         {!isDonationSeeker && (
          <Button className="w-full" onClick={() => setShowApplicationForm(true)}>
           <HandHeart className="mr-2 h-4 w-4" /> {t('donations.page.applyButton')}
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




