import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  Star, 
  Award, 
  ArrowUp, 
  Settings, 
  History, 
  Gift, 
  Zap,
  Shield,
  Clock,
  Users,
  AlertCircle
} from 'lucide-react';
import { TierBadge, TierBadgeGradient } from '@/components/tiers/tier-badge';
import { 
  TierProgressIndicator, 
  CircularTierProgress,
  TierBenefitsList 
} from '@/components/tiers/tier-progress';
import { cn } from '@/lib/utils';
import { useTiers } from '@/hooks/use-tiers';
import type { VIPTier, LoyaltyTier } from '@/lib/subscription-types';

export interface UserTierDashboardProps {
  userId?: string;
  className?: string;
}

interface TierData {
  currentTiers: {
    vip: {
      tier: VIPTier;
      assignedAt: string;
      expiresAt: string | null;
    } | null;
    loyalty: {
      tier: LoyaltyTier;
      assignedAt: string;
      expiresAt: string | null;
    } | null;
  };
  nextTierProgress: {
    vip: {
      progress: number;
      nextRequirements: string[];
    } | null;
    loyalty: {
      progress: number;
      nextRequirements: string[];
    } | null;
  };
  usage: {
    vip: {
      sessionsUsed: number;
      sessionsRemaining: number;
      sessionsLimit?: number;
      supportRequests: number;
      storageUsed: number;
      storageLimit: number;
      storageRemaining: number;
    };
    loyalty: {
      pointsEarned: number;
      pointsMultiplier: number;
      discountUsed: number;
      discountAvailable: number;
    };
  };
  benefits: {
    hasPriorityBooking: boolean;
    hasDedicatedSupport: boolean;
    hasExclusiveContent: boolean;
    hasEarlyAccess: boolean;
    hasCustomFeatures: boolean;
    hasWhiteLabel: boolean;
    pointsMultiplier: number;
    discountPercentage: number;
  };
}

const mockTierData: TierData = {
  currentTiers: {
    vip: {
      tier: 'silver',
      assignedAt: '2024-01-15T10:30:00Z',
      expiresAt: null
    },
    loyalty: {
      tier: 'member',
      assignedAt: '2024-01-10T14:20:00Z',
      expiresAt: null
    }
  },
  nextTierProgress: {
    vip: {
      progress: 65,
      nextRequirements: [
        'Complete 10 more sessions',
        'Maintain 4.8+ rating for 3 months',
        'Refer 2 new users'
      ]
    },
    loyalty: {
      progress: 40,
      nextRequirements: [
        'Earn 500 more points',
        'Complete 5 more sessions',
        'Leave 3 more reviews'
      ]
    }
  },
  usage: {
    vip: {
      sessionsUsed: 8,
      sessionsRemaining: 7,
      supportRequests: 3,
      storageUsed: 2.5,
      storageLimit: 10
    },
    loyalty: {
      pointsEarned: 1250,
      pointsMultiplier: 1.5,
      discountUsed: 15,
      discountAvailable: 5
    }
  },
  benefits: {
    hasPriorityBooking: true,
    hasDedicatedSupport: true,
    hasExclusiveContent: true,
    hasEarlyAccess: false,
    hasCustomFeatures: false,
    hasWhiteLabel: false,
    pointsMultiplier: 1.5,
    discountPercentage: 5
  }
};

export function UserTierDashboard({ userId, className }: UserTierDashboardProps) {
  const { tierData, isLoading, error, fetchUserTiers } = useTiers();
  const [activeTab, setActiveTab] = useState<'overview' | 'benefits' | 'progress' | 'history'>('overview');

  useEffect(() => {
    fetchUserTiers();
  }, [fetchUserTiers]);

  // Move benefits arrays inside the component to avoid null access
  const getVipBenefits = (data: typeof tierData) => data ? [
    {
      name: 'Priority Booking',
      description: 'Skip the queue and book appointments first',
      available: data.benefits.hasPriorityBooking,
      icon: <Clock className="h-4 w-4" />
    },
    {
      name: 'Dedicated Support',
      description: 'Get help from our premium support team',
      available: data.benefits.hasDedicatedSupport,
      icon: <Shield className="h-4 w-4" />
    },
    {
      name: 'Exclusive Content',
      description: 'Access premium articles and resources',
      available: data.benefits.hasExclusiveContent,
      icon: <Star className="h-4 w-4" />
    },
    {
      name: 'Early Access',
      description: 'Try new features before everyone else',
      available: data.benefits.hasEarlyAccess,
      icon: <Zap className="h-4 w-4" />
    },
    {
      name: 'Custom Features',
      description: 'Personalized features just for you',
      available: data.benefits.hasCustomFeatures,
      icon: <Settings className="h-4 w-4" />
    },
    {
      name: 'White Label',
      description: 'Custom branding options',
      available: data.benefits.hasWhiteLabel,
      icon: <Award className="h-4 w-4" />
    }
  ] : [];

  const getLoyaltyBenefits = (data: typeof tierData) => data ? [
    {
      name: 'Points Multiplier',
      description: `${data.benefits.pointsMultiplier}x points on all activities`,
      available: data.benefits.pointsMultiplier > 1,
      icon: <Star className="h-4 w-4" />
    },
    {
      name: 'Discount',
      description: `${data.benefits.discountPercentage}% discount on services`,
      available: data.benefits.discountPercentage > 0,
      icon: <Gift className="h-4 w-4" />
    }
  ] : [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Crown className="h-4 w-4" /> },
    { id: 'benefits', label: 'Benefits', icon: <Gift className="h-4 w-4" /> },
    { id: 'progress', label: 'Progress', icon: <ArrowUp className="h-4 w-4" /> },
    { id: 'history', label: 'History', icon: <History className="h-4 w-4" /> }
  ];

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Your Membership</h2>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tier data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('space-y-6', className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!tierData) {
    return (
      <div className={cn('space-y-6', className)}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No tier data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Membership</h2>
          <p className="text-gray-600">Track your tier status and benefits</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Current Tier Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VIP Status */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-600 opacity-10 rounded-full -mr-16 -mt-16" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                VIP Status
              </CardTitle>
              {tierData?.currentTiers?.vip && (
                <TierBadgeGradient
                  tierType="vip"
                  tierName={tierData.currentTiers.vip?.tier || 'none'}
                  size="sm"
                />
              )}
            </div>
            <CardDescription>
              {tierData?.currentTiers?.vip 
                ? `Current tier: ${tierData.currentTiers.vip?.tier ? tierData.currentTiers.vip.tier.charAt(0).toUpperCase() + tierData.currentTiers.vip.tier.slice(1) : 'None'}`
                : 'No VIP tier active'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tierData?.currentTiers?.vip && tierData?.usage?.vip ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sessions Used</span>
                  <Badge variant="secondary">
                    {tierData.usage.vip.sessionsUsed} / {tierData.usage.vip.sessionsRemaining === -1 ? '∞' : tierData.usage.vip.sessionsRemaining + tierData.usage.vip.sessionsUsed}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage Used</span>
                  <Badge variant="secondary">
                    {tierData.usage.vip.storageUsed}GB / {tierData.usage.vip.storageLimit === -1 ? '∞' : tierData.usage.vip.storageLimit + 'GB'}
                  </Badge>
                </div>

                {tierData.nextTierProgress.vip && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Next Tier Progress</span>
                      <CircularTierProgress
                        progress={tierData.nextTierProgress.vip.progress}
                        size="sm"
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-gray-400 to-gray-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${tierData.nextTierProgress.vip.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">Upgrade to VIP for premium benefits</p>
                <Button size="sm" variant="outline">
                  View VIP Tiers
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loyalty Status */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-full -mr-16 -mt-16" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Loyalty Status
              </CardTitle>
              {tierData?.currentTiers?.loyalty && (
                <TierBadgeGradient
                  tierType="loyalty"
                  tierName={tierData.currentTiers.loyalty?.tier || 'none'}
                  size="sm"
                />
              )}
            </div>
            <CardDescription>
              {tierData?.currentTiers?.loyalty 
                ? `Current tier: ${tierData.currentTiers.loyalty?.tier ? tierData.currentTiers.loyalty.tier.charAt(0).toUpperCase() + tierData.currentTiers.loyalty.tier.slice(1) : 'None'}`
                : 'No loyalty tier active'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tierData?.currentTiers?.loyalty && tierData?.usage?.loyalty ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Points Earned</span>
                  <Badge variant="secondary">
                    {tierData.usage.loyalty.pointsEarned.toLocaleString()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Points Multiplier</span>
                  <Badge variant="secondary">
                    {tierData.usage.loyalty.pointsMultiplier}x
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Discount Available</span>
                  <Badge variant="secondary">
                    {tierData.usage.loyalty.discountAvailable}%
                  </Badge>
                </div>

                {tierData.nextTierProgress.loyalty && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Next Tier Progress</span>
                      <CircularTierProgress
                        progress={tierData.nextTierProgress.loyalty.progress}
                        size="sm"
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${tierData.nextTierProgress.loyalty.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">Join our loyalty program</p>
                <Button size="sm" variant="outline">
                  View Loyalty Tiers
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <span className={cn(
                'mr-2',
                activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              )}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  VIP Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TierBenefitsList benefits={getVipBenefits(tierData)} showUnavailable={false} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Loyalty Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TierBenefitsList benefits={getLoyaltyBenefits(tierData)} showUnavailable={false} />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Available Benefits</CardTitle>
                <CardDescription>
                  Based on your current {tierData.currentTiers.vip?.tier} VIP and {tierData.currentTiers.loyalty?.tier} Loyalty tiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Crown className="h-5 w-5" />
                      VIP Benefits
                    </h4>
                    <TierBenefitsList benefits={getVipBenefits(tierData)} showUnavailable={true} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Loyalty Benefits
                    </h4>
                    <TierBenefitsList benefits={getLoyaltyBenefits(tierData)} showUnavailable={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            {tierData.nextTierProgress.vip && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUp className="h-5 w-5" />
                    VIP Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TierProgressIndicator
                    currentProgress={tierData.nextTierProgress.vip.progress}
                    targetProgress={100}
                    requirements={tierData.nextTierProgress.vip.nextRequirements}
                    tierName="Gold"
                    showDetails={true}
                  />
                </CardContent>
              </Card>
            )}

            {tierData.nextTierProgress.loyalty && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUp className="h-5 w-5" />
                    Loyalty Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TierProgressIndicator
                    currentProgress={tierData.nextTierProgress.loyalty.progress}
                    targetProgress={100}
                    requirements={tierData.nextTierProgress.loyalty.nextRequirements}
                    tierName="Elite"
                    showDetails={true}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Tier History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <TierBadge tierType="vip" tierName="silver" size="sm" />
                  <div className="flex-1">
                    <p className="font-medium">VIP Silver Assigned</p>
                    <p className="text-sm text-gray-600">January 15, 2024</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <TierBadge tierType="loyalty" tierName="member" size="sm" />
                  <div className="flex-1">
                    <p className="font-medium">Loyalty Member Assigned</p>
                    <p className="text-sm text-gray-600">January 10, 2024</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}