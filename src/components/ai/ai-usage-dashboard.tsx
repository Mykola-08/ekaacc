import React, { useState, useEffect } from 'react';
import { tieredAI, UsageMetrics, ServiceTier } from '@/ai/tiered-ai-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Settings,
  RefreshCw,
  Download
} from 'lucide-react';

interface AIUsageDashboardProps {
  className?: string;
  refreshInterval?: number;
  showAlerts?: boolean;
}

interface CostBreakdown {
  provider: string;
  cost: number;
  requests: number;
  efficiency: number;
}

interface TierUsage {
  tier: ServiceTier;
  requests: number;
  cost: number;
  utilization: number;
  remaining: number;
}

export const AIUsageDashboard: React.FC<AIUsageDashboardProps> = ({ 
  className = '',
  refreshInterval = 30000,
  showAlerts = true
}) => {
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown[]>([]);
  const [tierUsage, setTierUsage] = useState<TierUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    loadMetrics();
    
    const interval = setInterval(() => {
      loadMetrics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const usageMetrics = tieredAI.getUsageMetrics();
      setMetrics(usageMetrics);
      setLastUpdated(new Date());
      
      // Calculate cost breakdown
      const breakdown = calculateCostBreakdown(usageMetrics);
      setCostBreakdown(breakdown);
      
      // Calculate tier usage
      const usage = calculateTierUsage(usageMetrics);
      setTierUsage(usage);
      
      // Generate alerts
      if (showAlerts) {
        const newAlerts = generateAlerts(usageMetrics, usage);
        setAlerts(newAlerts);
      }
      
    } catch (error) {
      console.error('Failed to load AI usage metrics:', error);
      setAlerts(['Failed to load AI usage metrics. Please check configuration.']);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCostBreakdown = (metrics: UsageMetrics): CostBreakdown[] => {
    const breakdown: CostBreakdown[] = [];
    
    // Calculate by provider
    Object.entries(metrics.requestsByProvider).forEach(([provider, requests]) => {
      const cost = metrics.costByTier[provider as ServiceTier] || 0;
      const efficiency = requests > 0 ? (metrics.totalRequests - requests) / metrics.totalRequests : 0;
      
      breakdown.push({
        provider: provider.charAt(0).toUpperCase() + provider.slice(1),
        cost,
        requests,
        efficiency
      });
    });
    
    return breakdown.sort((a, b) => b.cost - a.cost);
  };

  const calculateTierUsage = (metrics: UsageMetrics): TierUsage[] => {
    const usage: TierUsage[] = [];
    
    Object.entries(metrics.requestsByTier).forEach(([tier, requests]) => {
      const config = tieredAI.getTierConfig(tier as ServiceTier);
      if (config) {
        const cost = metrics.costByTier[tier as ServiceTier];
        const utilization = (requests / config.maxRequestsPerDay) * 100;
        const remaining = Math.max(0, config.costLimit - cost);
        
        usage.push({
          tier: tier as ServiceTier,
          requests,
          cost,
          utilization,
          remaining
        });
      }
    });
    
    return usage;
  };

  const generateAlerts = (metrics: UsageMetrics, tierUsage: TierUsage[]): string[] => {
    const alerts: string[] = [];
    
    // Check high cost usage
    tierUsage.forEach(usage => {
      if (usage.utilization > 80) {
        alerts.push(`${usage.tier.charAt(0).toUpperCase() + usage.tier.slice(1)} tier is at ${usage.utilization.toFixed(1)}% of daily request limit`);
      }
      
      if (usage.remaining < usage.cost * 0.2) {
        alerts.push(`${usage.tier.charAt(0).toUpperCase() + usage.tier.slice(1)} tier is approaching cost limit with $${usage.remaining.toFixed(2)} remaining`);
      }
    });
    
    // Check high latency
    if (metrics.averageLatency > 5000) {
      alerts.push(`High average latency detected: ${(metrics.averageLatency / 1000).toFixed(1)}s`);
    }
    
    // Check low cache hit rate
    if (metrics.cacheHitRate < 0.1 && metrics.totalRequests > 10) {
      alerts.push(`Low cache efficiency: ${(metrics.cacheHitRate * 100).toFixed(1)}% hit rate`);
    }
    
    return alerts;
  };

  const exportMetrics = () => {
    if (!metrics) return;
    
    const data = {
      timestamp: new Date().toISOString(),
      metrics,
      costBreakdown,
      tierUsage
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-usage-metrics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetMetrics = () => {
    if (confirm('Are you sure you want to reset all AI usage metrics? This action cannot be undone.')) {
      tieredAI.resetMetrics();
      loadMetrics();
    }
  };

  if (isLoading && !metrics) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>AI Usage Dashboard</CardTitle>
          <CardDescription>Loading usage metrics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>AI Usage Dashboard</CardTitle>
          <CardDescription>No usage data available</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Required</AlertTitle>
            <AlertDescription>
              AI usage metrics are not available. Please ensure AI services are properly configured.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Usage Dashboard</CardTitle>
            <CardDescription>
              Real-time monitoring of AI service usage and costs
              {lastUpdated && (
                <span className="text-xs text-muted-foreground ml-2">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadMetrics}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportMetrics}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showAlerts && alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index} variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="tiers">Tier Usage</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all tiers and providers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${metrics.totalCost.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Cumulative cost across all services
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Latency</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(metrics.averageLatency / 1000).toFixed(1)}s</div>
                  <p className="text-xs text-muted-foreground">
                    Response time across all requests
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(metrics.cacheHitRate * 100).toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Requests served from cache
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Requests by Tier</CardTitle>
                  <CardDescription>Distribution across service tiers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(metrics.requestsByTier).map(([tier, count]) => {
                      const percentage = metrics.totalRequests > 0 ? (count / metrics.totalRequests) * 100 : 0;
                      return (
                        <div key={tier} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">{tier}</span>
                            <span className="text-sm text-muted-foreground">{count.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Provider Distribution</CardTitle>
                  <CardDescription>Requests by AI provider</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(metrics.requestsByProvider).map(([provider, count]) => {
                      const percentage = metrics.totalRequests > 0 ? (count / metrics.totalRequests) * 100 : 0;
                      return (
                        <div key={provider} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{provider}</Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">{count.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cost by Tier</CardTitle>
                  <CardDescription>Cost distribution across service tiers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(metrics.costByTier).map(([tier, cost]) => {
                      const percentage = metrics.totalCost > 0 ? (cost / metrics.totalCost) * 100 : 0;
                      return (
                        <div key={tier} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">{tier}</span>
                            <span className="text-sm font-mono">${cost.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Efficiency</CardTitle>
                  <CardDescription>Cost per request by provider</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {costBreakdown.map((item) => (
                      <div key={item.provider} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.provider}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.requests.toLocaleString()} requests
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono">${item.cost.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.requests > 0 ? (item.cost / item.requests).toFixed(4) : '0.0000'} per request
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-4">
            <div className="grid gap-4">
              {tierUsage.map((usage) => {
                const config = tieredAI.getTierConfig(usage.tier);
                if (!config) return null;
                
                return (
                  <Card key={usage.tier}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="capitalize">{usage.tier} Tier</CardTitle>
                          <CardDescription>
                            {config.features.length} features available
                          </CardDescription>
                        </div>
                        <Badge variant={usage.utilization > 80 ? 'destructive' : usage.utilization > 60 ? 'warning' : 'default'}>
                          {usage.utilization.toFixed(1)}% utilized
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Daily Requests</p>
                          <p className="text-lg font-semibold">{usage.requests.toLocaleString()} / {config.maxRequestsPerDay.toLocaleString()}</p>
                          <Progress value={(usage.requests / config.maxRequestsPerDay) * 100} className="h-2 mt-2" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Daily Cost</p>
                          <p className="text-lg font-semibold">${usage.cost.toFixed(2)} / ${config.costLimit.toFixed(2)}</p>
                          <Progress value={(usage.cost / config.costLimit) * 100} className="h-2 mt-2" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Remaining Budget</p>
                          <p className="text-lg font-semibold">${usage.remaining.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            {usage.remaining > 0 ? 'Within budget' : 'Budget exceeded'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Available Features</p>
                        <div className="flex flex-wrap gap-1">
                          {config.features.slice(0, 8).map((feature: string) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature.replace('-', ' ')}
                            </Badge>
                          ))}
                          {config.features.length > 8 && (
                            <Badge variant="outline" className="text-xs">
                              +{config.features.length - 8} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Batch Efficiency</span>
                      <span className="text-sm font-mono">{(metrics.batchEfficiency * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cache Hit Rate</span>
                      <span className="text-sm font-mono">{(metrics.cacheHitRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Latency</span>
                      <span className="text-sm font-mono">{(metrics.averageLatency / 1000).toFixed(2)}s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Cost Efficiency</span>
                      <span className="text-sm font-mono">
                        ${metrics.totalRequests > 0 ? (metrics.totalCost / metrics.totalRequests).toFixed(4) : '0.0000'} per request
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optimization Recommendations</CardTitle>
                  <CardDescription>Suggestions to improve efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.cacheHitRate < 0.2 && (
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Improve Caching</p>
                          <p className="text-sm text-muted-foreground">
                            Consider enabling caching for more request types to reduce costs
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {metrics.batchEfficiency < 0.3 && (
                      <div className="flex items-start gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Increase Batching</p>
                          <p className="text-sm text-muted-foreground">
                            Batch similar requests to improve throughput
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {metrics.averageLatency > 3000 && (
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Optimize Response Time</p>
                          <p className="text-sm text-muted-foreground">
                            Consider upgrading to faster models or optimizing prompts
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {Object.values(metrics.costByTier).some(cost => cost > 0) && (
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-purple-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Cost Optimization</p>
                          <p className="text-sm text-muted-foreground">
                            Review tier usage and consider downgrading where appropriate
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={resetMetrics}
            className="text-destructive"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset Metrics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};