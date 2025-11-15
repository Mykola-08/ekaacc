'use client';

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Tabs, TabsContent, TabsItem, TabsList } from '@/components/keep';
import { useState } from 'react';
;
;
;
;
;
import { useAuth } from '@/lib/supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { Users, Share2, Gift, Copy, Check, Mail, MessageCircle, Facebook, Twitter, Instagram, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

type Referral = {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'active' | 'completed';
  dateReferred: Date;
  reward: number;
};

export default function ReferralsPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  // Generate referral code
  const referralCode = currentUser?.id ? `EKA${currentUser.id.slice(0, 6).toUpperCase()}` : 'EKAXXXXX';
  const referralLink = `https://eka.app/join/${referralCode}`;

  const [totalRewards, setTotalRewards] = useState(350);
  const [pendingRewards, setPendingRewards] = useState(100);
  const [successfulReferrals, setSuccessfulReferrals] = useState(7);

  const [referrals] = useState<Referral[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      status: 'completed',
      dateReferred: new Date('2025-09-15'),
      reward: 50,
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'm.chen@example.com',
      status: 'active',
      dateReferred: new Date('2025-10-01'),
      reward: 50,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      status: 'pending',
      dateReferred: new Date('2025-10-18'),
      reward: 50,
    },
    {
      id: '4',
      name: 'David Park',
      email: 'd.park@example.com',
      status: 'completed',
      dateReferred: new Date('2025-08-22'),
      reward: 50,
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      email: 'lisa.a@example.com',
      status: 'active',
      dateReferred: new Date('2025-10-10'),
      reward: 50,
    },
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: 'Link Copied!',
      description: 'Referral link copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = () => {
    if (!emailInput) {
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter an email address',
      });
      return;
    }

    toast({
      title: 'Invitation Sent!',
      description: `Referral invitation sent to ${emailInput}`,
    });
    setEmailInput('');
  };

  const shareButtons = [
    { icon: Mail, label: 'Email', color: 'bg-blue-500' },
    { icon: MessageCircle, label: 'WhatsApp', color: 'bg-green-500' },
    { icon: Facebook, label: 'Facebook', color: 'bg-blue-600' },
    { icon: Twitter, label: 'Twitter', color: 'bg-sky-500' },
    { icon: Instagram, label: 'Instagram', color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Referral Program
        </h1>
        <p className="text-muted-foreground mt-1">
          Share EKA with friends and earn rewards together
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalRewards}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From referrals
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successfulReferrals}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Friends joined
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{pendingRewards}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Being processed
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Referral Link Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link with friends to earn €50 for each successful referral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button onClick={handleCopyLink} className="shrink-0">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="pt-2">
            <p className="text-sm font-semibold mb-3">Share via:</p>
            <div className="flex gap-2 flex-wrap">
              {shareButtons.map((button) => (
                <Button
                  key={button.label}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <button.icon className="h-4 w-4" />
                  {button.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="referrals" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsItem value="referrals">
            <Users className="h-4 w-4 mr-2" />
            My Referrals
          </TabsItem>
          <TabsItem value="invite">
            <Mail className="h-4 w-4 mr-2" />
            Send Invite
          </TabsItem>
        </TabsList>

        {/* Referrals List */}
        <TabsContent value="referrals" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
              <CardDescription>Track your referrals and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {referrals.map((referral, index) => (
                  <motion.div
                    key={referral.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {referral.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{referral.name}</p>
                        <p className="text-sm text-muted-foreground">{referral.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Referred {format(referral.dateReferred, 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <Badge variant="base">
                        {referral.status}
                      </Badge>
                      <p className="text-sm font-semibold text-green-600">
                        €{referral.reward}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Send Invite */}
        <TabsContent value="invite" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Invite Friends by Email</CardTitle>
              <CardDescription>
                Send a personalized referral invitation directly to your friends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Friend's Email Address
                </label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="friend@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <Button onClick={handleSendInvite} className="shrink-0">
                    <Mail className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Email Preview:</h3>
                <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
                  <p>Hi there!</p>
                  <p>
                    I've been using EKA for my therapy sessions and thought you might be interested too.
                    Join using my referral link and we'll both get €50 in credits!
                  </p>
                  <p className="font-mono bg-background p-2 rounded border">
                    {referralLink}
                  </p>
                  <p>
                    EKA offers personalized therapy sessions with certified professionals. Sign up today!
                  </p>
                  <p>Best regards,<br />{currentUser?.name || currentUser?.displayName || 'Your Friend'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card>
            <CardHeader>
              <CardTitle>How Referrals Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Share your link</p>
                    <p className="text-sm text-muted-foreground">
                      Send your unique referral link to friends and family
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">They sign up</p>
                    <p className="text-sm text-muted-foreground">
                      Your friend creates an account using your referral link
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Both get rewarded</p>
                    <p className="text-sm text-muted-foreground">
                      When they book their first session, you both receive €50 in credits
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
