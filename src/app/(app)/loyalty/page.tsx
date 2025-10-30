'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { Star, Gift, Trophy, TrendingUp, Sparkles, Crown, Zap, Award, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  const { appUser: currentUser } = useAuth();
  const { initDataService } = useAppStore();
  const [currentPoints, setCurrentPoints] = useState(0);
  const [lifetimePoints, setLifetimePoints] = useState(0);

  useEffect(() => {
    initDataService();
  }, [initDataService]);

  useEffect(() => {
    if (currentUser) {
      // Use loyalBenefits or calculate from other fields
      setCurrentPoints(0); // TODO: Add loyalty points tracking
      setLifetimePoints(0); // TODO: Add lifetime points tracking
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
      color: 'text-gray-400',
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
      benefits: ['20% discount on sessions', '2 free consultations/month', 'VIP events access', 'Personal wellness coach'],
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
    return [...tiers].reverse().find(tier => lifetimePoints >= tier.minPoints) || tiers[0];
  };

  const getNextTier = () => {
    const current = getCurrentTier();
    const currentIndex = tiers.findIndex(t => t.name === current.name);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNextTier = nextTier 
    ? ((lifetimePoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  const handleRedeemReward = (reward: Reward) => {
    if (currentPoints >= reward.pointsCost) {
      setCurrentPoints(prev => prev - reward.pointsCost);
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
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
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
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm opacity-90 mb-1">Available Points</p>
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
                <currentTier.icon className={cn('h-6 w-6', currentTier.color)} />
                {currentTier.name} Tier
              </CardTitle>
              <CardDescription>
                {nextTier 
                  ? `${nextTier.minPoints - lifetimePoints} points to ${nextTier.name} tier`
                  : 'Maximum tier reached!'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progressToNextTier} className="mb-4" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{currentTier.name}</span>
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
            <Gift className="h-4 w-4 mr-2" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="tiers">
            <Trophy className="h-4 w-4 mr-2" />
            Tiers
          </TabsTrigger>
          <TabsTrigger value="activity">
            <TrendingUp className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={cn(
                  'h-full transition-all hover:shadow-md',
                  !reward.available && 'opacity-60'
                )}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={cn(
                        'p-3 rounded-lg',
                        reward.category === 'discount' && 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
                        reward.category === 'service' && 'bg-green-100 text-green-600 dark:bg-green-900/30',
                        reward.category === 'exclusive' && 'bg-purple-100 text-purple-600 dark:bg-purple-900/30'
                      )}>
                        <reward.icon className="h-6 w-6" />
                      </div>
                      <Badge variant={reward.available ? 'default' : 'secondary'}>
                        {reward.pointsCost} pts
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-3">{reward.title}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      disabled={currentPoints < reward.pointsCost || !reward.available}
                      onClick={() => handleRedeemReward(reward)}
                    >
                      {!reward.available ? 'Coming Soon' : currentPoints < reward.pointsCost ? 'Not Enough Points' : 'Redeem'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Tiers Tab */}
        <TabsContent value="tiers" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {tiers.map((tier, index) => {
              const isCurrentTier = tier.name === currentTier.name;
              const isUnlocked = lifetimePoints >= tier.minPoints;

              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={cn(
                    'transition-all',
                    isCurrentTier && 'ring-2 ring-primary shadow-lg'
                  )}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'p-3 rounded-lg bg-muted',
                            isCurrentTier && 'bg-primary/10'
                          )}>
                            <tier.icon className={cn('h-8 w-8', tier.color)} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                              {tier.name}
                              {isCurrentTier && (
                                <Badge>Current</Badge>
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {tier.minPoints.toLocaleString()}+ points
                            </p>
                          </div>
                        </div>
                        {isUnlocked && (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold mb-2">Benefits:</p>
                        <ul className="space-y-1">
                          {tier.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
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
        <TabsContent value="activity" className="space-y-4 mt-6">
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
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 text-green-600 rounded-full dark:bg-green-900/30">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">+{activity.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
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
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold mb-1">Book a Session</p>
                  <p className="text-sm text-muted-foreground mb-2">Earn 50 points</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold mb-1">Complete a Session</p>
                  <p className="text-sm text-muted-foreground mb-2">Earn 100 points</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold mb-1">Refer a Friend</p>
                  <p className="text-sm text-muted-foreground mb-2">Earn 200 points</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold mb-1">Leave a Review</p>
                  <p className="text-sm text-muted-foreground mb-2">Earn 25 points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
