'use client';

import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/platform/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/platform/supabase/auth';
import { useAppStore } from '@/store/platform/app-store';
import {
  Star,
  Gift,
  Trophy,
  TrendingUp,
  Sparkles,
  Crown,
  Zap,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/platform/utils/css-utils';

type Reward = {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  icon: React.ElementType;
  category: 'discount' | 'service' | 'exclusive';
  available: boolean;
};

type LoyaltyTier = {
  name: string;
  minPoints: number;
  icon: React.ElementType;
  color: string;
  benefits: string[];
};

export default function LoyaltyPage() {
  const { user: currentUser } = useAuth();
  const { initDataService } = useAppStore();
  const [currentPoints, setCurrentPoints] = useState(0);
  const [lifetimePoints, setLifetimePoints] = useState(0);

  useEffect(() => {
    initDataService?.();
  }, [initDataService]);

  useEffect(() => {
    if (currentUser) {
      const lp = (currentUser as any).user_metadata?.loyaltyPoints || {};
      setCurrentPoints(lp.current || 0);
      setLifetimePoints(lp.lifetime || 0);
    }
  }, [currentUser]);

  const tiers: LoyaltyTier[] = [
    {
      name: 'Bronze',
      minPoints: 0,
      icon: Award,
      color: 'text-amber-700',
      benefits: ['5% discount on sessions', 'Priority booking', 'Monthly newsletter'],
    },
    {
      name: 'Silver',
      minPoints: 500,
      icon: Star,
      color: 'text-muted-foreground/80',
      benefits: ['10% discount on sessions', 'Free rescheduling', 'Exclusive content access'],
    },
    {
      name: 'Gold',
      minPoints: 1000,
      icon: Trophy,
      color: 'text-yellow-500',
      benefits: ['15% discount on sessions', '1 free consultation/month', 'Priority support'],
    },
    {
      name: 'Platinum',
      minPoints: 2000,
      icon: Crown,
      color: 'text-purple-500',
      benefits: [
        '20% discount on sessions',
        '2 free consultations/month',
        'VIP events access',
        'Personal wellness coach',
      ],
    },
  ];

  const rewards: Reward[] = [
    {
      id: '1',
      title: 'Free 30min Session',
      description: 'Redeem for a complimentary 30-minute therapy session',
      pointsCost: 500,
      icon: Gift,
      category: 'service',
      available: true,
    },
    {
      id: '2',
      title: '20% Off Next Session',
      description: 'Get 20% discount on your next therapy session',
      pointsCost: 200,
      icon: Sparkles,
      category: 'discount',
      available: true,
    },
    {
      id: '3',
      title: 'Wellness Package',
      description: '3 sessions + personalized exercise plan',
      pointsCost: 1500,
      icon: Zap,
      category: 'exclusive',
      available: true,
    },
    {
      id: '4',
      title: 'VIP Consultation',
      description: '60min session with senior therapist',
      pointsCost: 800,
      icon: Crown,
      category: 'exclusive',
      available: true,
    },
    {
      id: '5',
      title: '10% Off Merchandise',
      description: 'Discount on therapy equipment and tools',
      pointsCost: 150,
      icon: Gift,
      category: 'discount',
      available: true,
    },
    {
      id: '6',
      title: 'Premium Report',
      description: 'Detailed AI-powered progress analysis',
      pointsCost: 300,
      icon: TrendingUp,
      category: 'service',
      available: false,
    },
  ];

  const getCurrentTier = () => {
    return [...tiers].reverse().find((tier) => lifetimePoints >= tier.minPoints) || tiers[0];
  };

  const getNextTier = () => {
    const current = getCurrentTier();
    const currentIndex = tiers.findIndex((t) => t.name === current?.name);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNextTier =
    nextTier && currentTier
      ? ((lifetimePoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) *
        100
      : 100;

  const handleRedeemReward = (reward: Reward) => {
    if (currentPoints >= reward.pointsCost) {
      setCurrentPoints((prev) => prev - reward.pointsCost);
      // Show success toast or confirmation
    }
  };

  const recentActivity = [
    { action: 'Booked session', points: 50, date: '2 days ago' },
    { action: 'Completed session', points: 100, date: '5 days ago' },
    { action: 'Referral bonus', points: 200, date: '1 week ago' },
    { action: 'Profile completed', points: 50, date: '2 weeks ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Trophy className="text-primary h-8 w-8" />
          Loyalty Program
        </h1>
        <p className="text-muted-foreground mt-1">
          Earn points with every session and unlock exclusive rewards
        </p>
      </div>

      {/* Points Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="from-primary to-primary/80 text-primary-foreground border-0 bg-linear-to-br shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm opacity-90">Available Points</p>
                  <h2 className="text-4xl font-bold">{currentPoints.toLocaleString()}</h2>
                </div>
                <Star className="h-16 w-16 opacity-20" />
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <TrendingUp className="h-4 w-4" />
                <span>Lifetime: {lifetimePoints.toLocaleString()} points earned</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentTier && <currentTier.icon className={cn('h-6 w-6', currentTier.color)} />}
                {currentTier?.name} Tier
              </CardTitle>
              <CardDescription>
                {nextTier
                  ? `${nextTier.minPoints - lifetimePoints} points to ${nextTier.name} tier`
                  : 'Maximum tier reached!'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progressToNextTier}%` }}
                />
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <span>{currentTier?.name}</span>
                {nextTier && <span>{nextTier.name}</span>}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rewards">
            <Gift className="mr-2 h-4 w-4" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="tiers">
            <Trophy className="mr-2 h-4 w-4" />
            Tiers
          </TabsTrigger>
          <TabsTrigger value="activity">
            <TrendingUp className="mr-2 h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={cn(
                    'h-full transition-all hover:shadow-md',
                    !reward.available && 'opacity-60'
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          'rounded-xl p-3',
                          reward.category === 'discount' &&
                            'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
                          reward.category === 'service' &&
                            'bg-green-100 text-green-600 dark:bg-green-900/30',
                          reward.category === 'exclusive' &&
                            'bg-purple-100 text-purple-600 dark:bg-purple-900/30'
                        )}
                      >
                        <reward.icon className="h-6 w-6" />
                      </div>
                      <Badge
                        className={
                          reward.available ? 'bg-green-500 text-white' : 'bg-muted/300 text-white'
                        }
                      >
                        {reward.pointsCost} pts
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg">{reward.title}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      disabled={currentPoints < reward.pointsCost || !reward.available}
                      onClick={() => handleRedeemReward(reward)}
                    >
                      {!reward.available
                        ? 'Coming Soon'
                        : currentPoints < reward.pointsCost
                          ? 'Not Enough Points'
                          : 'Redeem'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Tiers Tab */}
        <TabsContent value="tiers" className="mt-6 space-y-4">
          <div className="grid gap-4">
            {tiers.map((tier, index) => {
              const isCurrentTier = tier.name === currentTier?.name;
              const isUnlocked = lifetimePoints >= tier.minPoints;

              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className={cn(
                      'transition-all',
                      isCurrentTier && 'ring-primary shadow-lg ring-2'
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'bg-muted rounded-xl p-3',
                              isCurrentTier && 'bg-primary/10'
                            )}
                          >
                            <tier.icon className={cn('h-8 w-8', tier.color)} />
                          </div>
                          <div>
                            <h3 className="flex items-center gap-2 text-2xl font-bold">
                              {tier.name}
                              {isCurrentTier && <Badge>Current</Badge>}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {tier.minPoints.toLocaleString()}+ points
                            </p>
                          </div>
                        </div>
                        {isUnlocked && <CheckCircle2 className="h-6 w-6 text-green-600" />}
                      </div>
                      <div className="space-y-2">
                        <p className="mb-2 text-sm font-semibold">Benefits:</p>
                        <ul className="space-y-1">
                          {tier.benefits.map((benefit, idx) => (
                            <li
                              key={idx}
                              className="text-muted-foreground flex items-center gap-2 text-sm"
                            >
                              <CheckCircle2 className="text-primary h-4 w-4" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest point-earning actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">{activity.action}</p>
                        <p className="text-muted-foreground text-sm">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">+{activity.points}</p>
                      <p className="text-muted-foreground text-xs">points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How to Earn More */}
          <Card>
            <CardHeader>
              <CardTitle>How to Earn More Points</CardTitle>
              <CardDescription>Ways to boost your loyalty rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <p className="mb-1 font-semibold">Book a Session</p>
                  <p className="text-muted-foreground mb-2 text-sm">Earn 50 points</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="mb-1 font-semibold">Complete a Session</p>
                  <p className="text-muted-foreground mb-2 text-sm">Earn 100 points</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="mb-1 font-semibold">Refer a Friend</p>
                  <p className="text-muted-foreground mb-2 text-sm">Earn 200 points</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="mb-1 font-semibold">Leave a Review</p>
                  <p className="text-muted-foreground mb-2 text-sm">Earn 25 points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
