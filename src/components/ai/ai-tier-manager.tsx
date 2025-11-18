import React, { useState, useEffect } from 'react';
// @ts-ignore - tiered-ai-service module not yet implemented
import { tieredAI, ServiceTier, TierConfig, UsageMetrics } from '@/ai/tiered-ai-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Settings,
  BarChart3,
  Zap,
  Star,
  Crown
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AITierManagerProps {
  className?: string;
  currentTier?: ServiceTier;
  onTierChange?: (newTier: ServiceTier) => void;
  showUsageAnalytics?: boolean;
  allowDowngrade?: boolean;
}

interface TierComparison {
  tier: ServiceTier;
  config: TierConfig;
  currentUsage?: {
    requests: number;
    cost: number;
    utilization: number;
  };
  recommendation?: 'upgrade' | 'downgrade' | 'maintain';
  estimatedSavings?: number;
  estimatedCostIncrease?: number;
}

export function AITierManager({ 
  className = '',
  currentTier = 'basic',
  onTierChange,
  showUsageAnalytics = true,
  allowDowngrade = true
}: AITierManagerProps) {
  const [selectedTier, setSelectedTier] = useState<ServiceTier>(currentTier);
  const [isLoading, setIsLoading] = useState(true);
  const [tierComparisons, setTierComparisons] = useState<TierComparison[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [pendingTierChange, setPendingTierChange] = useState<ServiceTier | null>(null);

  useEffect(() => {
    loadTierData();
  }, [currentTier]);

  const loadTierData = async () => {
    try {
      setIsLoading(true);
      
      // Get current usage metrics
      const metrics = tieredAI.getUsageMetrics();
      setUsageMetrics(metrics);
      
      // Build tier comparisons
      const comparisons = buildTierComparisons(metrics, currentTier);
      setTierComparisons(comparisons);
      
    } catch (error) {
      console.error('Failed to load tier data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildTierComparisons = (metrics: UsageMetrics, current: ServiceTier): TierComparison[] => {
    const tiers: ServiceTier[] = ['basic', 'premium', 'enterprise'];
    const comparisons: TierComparison[] = [];
    
    tiers.forEach(tier => {
      const config = tieredAI.getTierConfig(tier);
      if (!config) return;
      
      const currentRequests = metrics.requestsByTier[tier];
      const currentCost = metrics.costByTier[tier];
      const utilization = (currentRequests / config.maxRequestsPerDay) * 100;
      
      // Calculate recommendations based on usage patterns
      let recommendation: 'upgrade' | 'downgrade' | 'maintain' = 'maintain';
      let estimatedSavings = 0;
      let estimatedCostIncrease = 0;
      
      if (tier === current) {
        // Current tier analysis
        if (utilization > 80) {
          recommendation = 'upgrade';
        } else if (utilization < 20 && tier !== 'basic') {
          recommendation = 'downgrade';
        }
      }
      
      comparisons.push({
        tier,
        config,
        currentUsage: {
          requests: currentRequests,
          cost: currentCost,
          utilization
        },
        recommendation,
        estimatedSavings,
        estimatedCostIncrease
      });
    });
    
    return comparisons;
  };

  const handleTierChange = (newTier: ServiceTier) => {
    if (newTier === currentTier) return;
    
    setPendingTierChange(newTier);
    setShowUpgradeDialog(true);
  };

  const confirmTierChange = () => {
    if (!pendingTierChange) return;
    
    setSelectedTier(pendingTierChange);
    onTierChange?.(pendingTierChange);
    setShowUpgradeDialog(false);
    setPendingTierChange(null);
  };

  const getTierIcon = (tier: ServiceTier) => {
    switch (tier) {
      case 'basic':
        return <Settings className="h-5 w-5" />;
      case 'premium':
        return <Star className="h-5 w-5" />;
      case 'enterprise':
        return <Crown className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const getTierColor = (tier: ServiceTier) => {
    switch (tier) {
      case 'basic':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'premium':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'enterprise':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationColor = (recommendation?: string) => {
    switch (recommendation) {
      case 'upgrade':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'downgrade':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'maintain':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>AI Tier Management</CardTitle>
          <CardDescription>Loading tier information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentComparison = tierComparisons.find(c => c.tier === currentTier);
  const recommendedTier = tierComparisons.find(c => c.recommendation && c.recommendation !== 'maintain');

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Tier Management</CardTitle>
              <CardDescription>
                Manage your AI service tiers and optimize costs
              </CardDescription>
            </div>
            <Badge className={`${getTierColor(currentTier)} border`}>
              {getTierIcon(currentTier)}
              <span className="ml-1 capitalize">{currentTier}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Tier Status */}
          {currentComparison && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTierIcon(currentTier)}
                    <div>
                      <CardTitle className="text-lg">Current Tier: {currentTier}</CardTitle>
                      <CardDescription>Your active AI service tier</CardDescription>
                    </div>
                  </div>
                  {recommendedTier && recommendedTier.tier !== currentTier && (
                    <Badge className={`${getRecommendationColor(recommendedTier.recommendation)} border`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Recommended: {recommendedTier.recommendation}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Requests</p>
                    <p className="text-2xl font-bold">{currentComparison.currentUsage?.requests.toLocaleString() || 0}</p>
                    <Progress 
                      value={currentComparison.currentUsage?.utilization || 0} 
                      className="h-2 mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {currentComparison.currentUsage?.utilization.toFixed(1)}% of limit
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Cost</p>
                    <p className="text-2xl font-bold">${currentComparison.currentUsage?.cost.toFixed(2) || '0.00'}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Budget: ${currentComparison.config.costLimit.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Features Available</p>
                    <p className="text-2xl font-bold">{currentComparison.config.features.length}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {currentComparison.config.maxRequestsPerHour.toLocaleString()} req/hour
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Analytics */}
          {showUsageAnalytics && usageMetrics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Usage Analytics
                </CardTitle>
                <CardDescription>Recent usage patterns and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {usageMetrics.totalRequests.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total AI Requests</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      ${usageMetrics.totalCost.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {(usageMetrics.cacheHitRate * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Cache Efficiency</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {(usageMetrics.averageLatency / 1000).toFixed(2)}s
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tier Comparison */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Available Tiers</h3>
              {recommendedTier && recommendedTier.tier !== currentTier && (
                <Badge className={`${getRecommendationColor(recommendedTier.recommendation)} border`}>
                  <Zap className="h-3 w-3 mr-1" />
                  Recommended: Switch to {recommendedTier.tier}
                </Badge>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              {tierComparisons.map((comparison) => (
                <Card 
                  key={comparison.tier} 
                  className={`relative ${comparison.tier === currentTier ? 'border-2 border-primary' : ''}`}
                >
                  {comparison.tier === currentTier && (
                    <Badge className="absolute -top-2 left-3 bg-primary text-primary-foreground">
                      Current
                    </Badge>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getTierColor(comparison.tier)}`}>
                          {getTierIcon(comparison.tier)}
                        </div>
                        <div>
                          <CardTitle className="text-lg capitalize">{comparison.tier}</CardTitle>
                          <CardDescription>
                            {comparison.config.features.length} features
                          </CardDescription>
                        </div>
                      </div>
                      {comparison.recommendation && (
                        <Badge className={`${getRecommendationColor(comparison.recommendation)} border`}>
                          {comparison.recommendation}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Daily Requests</span>
                        <span className="font-mono text-sm">
                          {comparison.config.maxRequestsPerDay.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Daily Cost Limit</span>
                        <span className="font-mono text-sm">
                          ${comparison.config.costLimit.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Hourly Limit</span>
                        <span className="font-mono text-sm">
                          {comparison.config.maxRequestsPerHour.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Key Features</p>
                      <div className="space-y-1">
                        {comparison.config.features.slice(0, 5).map((feature: string) => (
                          <div key={feature} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-muted-foreground">
                              {feature.replace('-', ' ')}
                            </span>
                          </div>
                        ))}
                        {comparison.config.features.length > 5 && (
                          <p className="text-xs text-muted-foreground ml-5">
                            +{comparison.config.features.length - 5} more
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {comparison.tier !== currentTier && (
                      <Button
                        onClick={() => handleTierChange(comparison.tier)}
                        variant={comparison.tier === 'enterprise' ? 'default' : 'outline'}
                        className="w-full"
                        disabled={comparison.tier === 'basic' && !allowDowngrade && currentTier !== 'basic'}
                      >
                        {comparison.tier === 'basic' && currentTier !== 'basic' ? (
                          <>
                            <ArrowDownCircle className="h-4 w-4 mr-2" />
                            Downgrade to Basic
                          </>
                        ) : (
                          <>
                            <ArrowUpCircle className="h-4 w-4 mr-2" />
                            Upgrade to {comparison.tier.charAt(0).toUpperCase() + comparison.tier.slice(1)}
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade/Downgrade Confirmation Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingTierChange === 'basic' ? 'Downgrade' : 'Upgrade'} AI Service Tier
            </DialogTitle>
            <DialogDescription>
              {pendingTierChange === 'basic' 
                ? 'You are about to downgrade to the Basic tier. This will reduce your available features and limits.'
                : `You are about to upgrade to the ${pendingTierChange?.charAt(0).toUpperCase() + pendingTierChange?.slice(1)} tier. This will provide enhanced features and increased limits.`
              }
            </DialogDescription>
          </DialogHeader>
          
          {pendingTierChange && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Current: {currentTier}</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• {currentComparison?.config.features.length || 0} features</p>
                    <p>• {currentComparison?.config.maxRequestsPerDay.toLocaleString() || 0} daily requests</p>
                    <p>• ${currentComparison?.config.costLimit.toFixed(2) || '0.00'} daily cost limit</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">
                    New: {pendingTierChange.charAt(0).toUpperCase() + pendingTierChange.slice(1)}
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {(() => {
                      const newConfig = tieredAI.getTierConfig(pendingTierChange);
                      return newConfig ? (
                        <>
                          <p>• {newConfig.features.length} features</p>
                          <p>• {newConfig.maxRequestsPerDay.toLocaleString()} daily requests</p>
                          <p>• ${newConfig.costLimit.toFixed(2)} daily cost limit</p>
                        </>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
              
              {pendingTierChange !== 'basic' && (
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    Upgrading will unlock advanced AI features including predictive analytics, 
                    personalized recommendations, and enhanced processing capabilities.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUpgradeDialog(false);
                setPendingTierChange(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmTierChange}>
              {pendingTierChange === 'basic' ? 'Downgrade' : 'Upgrade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}