"use client";

import { useState } from "react";
import { useData } from "@/context/unified-data-context";
import fxService from '@/lib/fx-service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Beaker, User, CreditCard, Crown, Gift } from "lucide-react";

const allRoles = [
  "Patient",
  "Therapist",
  "Admin",
  "Donor",
  "Donation Receiver",
  "Student",
  "Office Workers",
  "Athletes",
  "Artists",
  "Musicians",
] as const;

const vipTiers = ["Bronze Elite", "Silver Elite", "Gold Elite"] as const;
const loyalTiers = ["Normal", "Plus", "Pro", "ProMax"] as const;

interface TestToolsProps {
  isTestMode?: boolean;
}

export function TestTools({ isTestMode = false }: TestToolsProps) {
  const { currentUser, updateUser } = useData();
  const { toast } = useToast();
  
  const [selectedRole, setSelectedRole] = useState<string>(currentUser?.role || "Patient");
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [isVip, setIsVip] = useState(currentUser?.isVip || false);
  const [vipTier, setVipTier] = useState<string>(currentUser?.vipTier || "Bronze Elite");
  const [isLoyal, setIsLoyal] = useState(currentUser?.isLoyal || false);
  const [loyalTier, setLoyalTier] = useState<string>(currentUser?.loyalTier || "Normal");
  const [isDonationSeeker, setIsDonationSeeker] = useState(currentUser?.isDonationSeeker || false);

  // Don't render in production mode
  if (!isTestMode) {
    return null;
  }

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    updateUser({ role: role as any });
    toast({
      title: "Role Updated",
      description: `Your role has been changed to ${role}.`,
    });
  };

  const handleAddBalance = async () => {
    if (accountBalance <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a positive amount." });
      return;
    }
    try {
      if (!currentUser) throw new Error('No user');
      const tx = await fxService.applyAdjustment(currentUser.id, accountBalance, 'TestTools add balance');
      toast({ title: "Balance Added", description: `€${accountBalance} has been added to ${currentUser.displayName || currentUser.email}.` });
      // try to refresh unified data if available
      try { (useData() as any).refreshData && (await (useData() as any).refreshData()); } catch (_) { /* ignore */ }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Add balance failed', description: (e as any)?.message || 'Could not add balance' });
    } finally {
      setAccountBalance(0);
    }
  };

  const handleVipToggle = (checked: boolean) => {
    setIsVip(checked);
    updateUser({ 
      isVip: checked,
      vipTier: checked ? vipTier as any : undefined,
      vipSince: checked ? new Date().toISOString() : undefined,
    });
    toast({
      title: checked ? "VIP Activated" : "VIP Deactivated",
      description: checked ? `You are now a ${vipTier} member.` : "VIP membership has been removed.",
    });
  };

  const handleVipTierChange = (tier: string) => {
    setVipTier(tier);
    if (isVip) {
      updateUser({ vipTier: tier as any });
      toast({
        title: "VIP Tier Updated",
        description: `Your VIP tier has been changed to ${tier}.`,
      });
    }
  };

  const handleLoyalToggle = (checked: boolean) => {
    setIsLoyal(checked);
    updateUser({ 
      isLoyal: checked,
      loyalTier: checked ? loyalTier as any : undefined,
      loyalSince: checked ? new Date().toISOString() : undefined,
    });
    toast({
      title: checked ? "Loyal Subscription Activated" : "Loyal Subscription Deactivated",
      description: checked ? `You are now on the ${loyalTier} plan.` : "Loyal subscription has been cancelled.",
    });
  };

  const handleLoyalTierChange = (tier: string) => {
    setLoyalTier(tier);
    if (isLoyal) {
      updateUser({ loyalTier: tier as any });
      toast({
        title: "Loyal Tier Updated",
        description: `Your Loyal tier has been changed to ${tier}.`,
      });
    }
  };

  const handleDonationSeekerToggle = (checked: boolean) => {
    setIsDonationSeeker(checked);
    updateUser({ 
      isDonationSeeker: checked,
      donationSeekerApproved: checked,
    });
    toast({
      title: checked ? "Donation Seeker Activated" : "Donation Seeker Deactivated",
      description: checked ? "You can now receive donations." : "Donation seeker status removed.",
    });
  };

  const handleResetAll = () => {
    setSelectedRole("Patient");
    setIsVip(false);
    setIsLoyal(false);
    setIsDonationSeeker(false);
    updateUser({
      role: "Patient",
      isVip: false,
      vipTier: undefined,
      isLoyal: false,
      loyalTier: undefined,
      isDonationSeeker: false,
    });
    toast({
      title: "Test Settings Reset",
      description: "All test configurations have been reset to defaults.",
    });
  };

  return (
    <Card className="border-dashed border-2 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-700 dark:text-yellow-500">Test Tools</CardTitle>
          </div>
          <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-700">
            Test Mode Active
          </Badge>
        </div>
        <CardDescription>
          Simulate different user roles, subscriptions, and account states for testing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Label className="font-semibold">User Role</Label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {allRoles.map(role => (
              <Button
                key={role}
                variant={selectedRole === role ? "default" : "outline"}
                size="sm"
                onClick={() => handleRoleChange(role)}
              >
                {role}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* VIP Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-muted-foreground" />
              <Label className="font-semibold">VIP Membership</Label>
            </div>
            <Switch checked={isVip} onCheckedChange={handleVipToggle} />
          </div>
          {isVip && (
            <Select value={vipTier} onValueChange={handleVipTierChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select VIP tier" />
              </SelectTrigger>
              <SelectContent>
                {vipTiers.map(tier => (
                  <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Separator />

        {/* Loyal Subscription */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-muted-foreground" />
              <Label className="font-semibold">Loyal Subscription</Label>
            </div>
            <Switch checked={isLoyal} onCheckedChange={handleLoyalToggle} />
          </div>
          {isLoyal && (
            <Select value={loyalTier} onValueChange={handleLoyalTierChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Loyal tier" />
              </SelectTrigger>
              <SelectContent>
                {loyalTiers.map(tier => (
                  <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Separator />

        {/* Internal Account Balance */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <Label className="font-semibold">Add Internal Account Balance</Label>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount (€)"
              value={accountBalance || ''}
              onChange={(e) => setAccountBalance(parseFloat(e.target.value) || 0)}
              min="0"
              step="10"
            />
            <Button onClick={handleAddBalance}>Add Balance</Button>
          </div>
        </div>

        <Separator />

        {/* Donation Seeker */}
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Donation Seeker</Label>
          <Switch checked={isDonationSeeker} onCheckedChange={handleDonationSeekerToggle} />
        </div>

        <Separator />

        {/* Reset Button */}
        <Button variant="outline" onClick={handleResetAll} className="w-full">
          Reset All Test Settings
        </Button>
      </CardContent>
    </Card>
  );
}
