'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Crown, Sparkles, User, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import type { SubscriptionType, LoyalTier, VipTier } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

export function SubscriptionTestSwitcher() {
  const { appUser: currentUser, refreshAppUser } = useAuth();
  const { dataService, initDataService } = useAppStore();
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>(
    currentUser?.subscriptionType || 'Free'
  );
  const [loyalTier, setLoyalTier] = useState<LoyalTier>(
    currentUser?.loyalTier || 'Normal'
  );
  const [vipTier, setVipTier] = useState<VipTier>(
    currentUser?.vipTier || 'Bronze'
  );
  const [isDonationSeeker, setIsDonationSeeker] = useState(
    currentUser?.isDonationSeeker || false
  );
  const [donationSeekerApproved, setDonationSeekerApproved] = useState(
    currentUser?.donationSeekerApproved || false
  );

  useEffect(() => {
    initDataService();
  }, [initDataService]);

  const updateUser = async (data: any) => {
    if (!dataService || !currentUser) return;
    try {
      await dataService.updateUser(currentUser.id, data);
      await refreshAppUser();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const handleApplySubscription = () => {
    const updates: any = {
      subscriptionType,
    };

    if (subscriptionType === 'Loyal') {
      updates.isLoyal = true;
      updates.loyalTier = loyalTier;
      updates.isVip = false;
      updates.vipTier = undefined;
      
      // Set Loyal benefits based on tier
      const loyalBenefits: { [key in LoyalTier]: any } = {
        Normal: {
          discountPercentage: 5,
          sessionCreditsPerMonth: 1,
          prioritySupport: false,
          groupSessionAccess: false,
          advancedAIFeatures: false,
        },
        Plus: {
          discountPercentage: 10,
          sessionCreditsPerMonth: 2,
          prioritySupport: true,
          groupSessionAccess: true,
          advancedAIFeatures: true,
        },
        Pro: {
          discountPercentage: 15,
          sessionCreditsPerMonth: 3,
          prioritySupport: true,
          groupSessionAccess: true,
          advancedAIFeatures: true,
        },
        ProMax: {
          discountPercentage: 20,
          sessionCreditsPerMonth: 4,
          prioritySupport: true,
          groupSessionAccess: true,
          advancedAIFeatures: true,
        },
      };
      updates.loyalBenefits = loyalBenefits[loyalTier];
    } else if (subscriptionType === 'VIP') {
      updates.isVip = true;
      updates.vipTier = vipTier;
      updates.isLoyal = false;
      updates.loyalTier = undefined;
      
      // Set VIP benefits based on tier
      const vipBenefits: { [key in VipTier]: any } = {
        Bronze: {
          priorityBooking: true,
          discountPercentage: 10,
          freeSessionsPerMonth: 1,
          dedicatedTherapist: false,
        },
        Silver: {
          priorityBooking: true,
          discountPercentage: 15,
          freeSessionsPerMonth: 2,
          dedicatedTherapist: false,
        },
        Gold: {
          priorityBooking: true,
          discountPercentage: 20,
          freeSessionsPerMonth: 3,
          dedicatedTherapist: true,
        },
        Platinum: {
          priorityBooking: true,
          discountPercentage: 25,
          freeSessionsPerMonth: 4,
          dedicatedTherapist: true,
        },
        Diamond: {
          priorityBooking: true,
          discountPercentage: 30,
          freeSessionsPerMonth: 5,
          dedicatedTherapist: true,
        },
      };
      updates.vipBenefits = vipBenefits[vipTier];
    } else {
      updates.isLoyal = false;
      updates.loyalTier = undefined;
      updates.isVip = false;
      updates.vipTier = undefined;
    }

    // Add donation seeker status
    updates.isDonationSeeker = isDonationSeeker;
    updates.donationSeekerApproved = isDonationSeeker ? donationSeekerApproved : false;
    updates.donationSeekerReason = isDonationSeeker 
      ? "Test donation seeker account - seeking support for therapy costs" 
      : undefined;

    updateUser(updates);
  };

  return (
    <Card className="border-2 border-dashed border-orange-500">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-orange-500">Test Mode: Subscription Switcher</CardTitle>
        </div>
        <CardDescription>
          Quickly switch between subscription types for testing. This component should be removed in production.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Subscription Type</label>
          <Select value={subscriptionType} onValueChange={(value) => setSubscriptionType(value as SubscriptionType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Free">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Free
                </div>
              </SelectItem>
              <SelectItem value="Loyal">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Loyal
                </div>
              </SelectItem>
              <SelectItem value="VIP">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  VIP
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {subscriptionType === 'Loyal' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Loyal Tier</label>
            <Select value={loyalTier} onValueChange={(value) => setLoyalTier(value as LoyalTier)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Normal">Normal - €49/mo</SelectItem>
                <SelectItem value="Plus">Plus - €89/mo (Popular)</SelectItem>
                <SelectItem value="Pro">Pro - €139/mo</SelectItem>
                <SelectItem value="ProMax">Pro Max - €199/mo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {subscriptionType === 'VIP' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">VIP Tier</label>
            <Select value={vipTier} onValueChange={(value) => setVipTier(value as VipTier)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bronze">Bronze Elite - €390/mo</SelectItem>
                <SelectItem value="Silver">Silver Elite - €690/mo</SelectItem>
                <SelectItem value="Gold">Gold Elite - €990/mo</SelectItem>
                <SelectItem value="Platinum">Platinum Elite - €1,290/mo</SelectItem>
                <SelectItem value="Diamond">Diamond Elite - €1,590/mo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Separator className="my-4" />

        {/* Donation Seeker Status */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Heart className="h-4 w-4 text-pink-500" />
            <span>Donation Seeker Status</span>
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="donation-seeker" className="text-sm">
              Enable Donation Seeker
            </Label>
            <Switch
              id="donation-seeker"
              checked={isDonationSeeker}
              onCheckedChange={setIsDonationSeeker}
            />
          </div>

          {isDonationSeeker && (
            <div className="flex items-center justify-between space-x-2 pl-4">
              <Label htmlFor="donation-approved" className="text-sm">
                Application Approved
              </Label>
              <Switch
                id="donation-approved"
                checked={donationSeekerApproved}
                onCheckedChange={setDonationSeekerApproved}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleApplySubscription} className="flex-1">
            Apply All Changes
          </Button>
          <Badge variant={subscriptionType === 'Free' ? 'secondary' : subscriptionType === 'Loyal' ? 'default' : 'destructive'}>
            Current: {currentUser?.subscriptionType || 'Free'}
            {currentUser?.isLoyal && ` - ${currentUser.loyalTier}`}
            {currentUser?.isVip && ` - ${currentUser.vipTier}`}
            {currentUser?.isDonationSeeker && ' 💖'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
