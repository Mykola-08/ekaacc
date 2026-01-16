import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/platform/ui/alert';
import { Progress } from '@/components/platform/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs';
import { Separator } from '@/components/platform/ui/separator';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  TrendingUp,
  Users,
  Calendar,
  Settings,
  Database,
  ArrowRightLeft,
  BarChart3,
  Zap,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { 
  bidirectionalSyncService,
  type SyncStatistic,
  type SyncConflict,
  type SyncQueueItem,
  type SyncOptions
} from '@/services/bidirectional-sync-service';
import { isSquareAppointmentsEnabled, isSquareSyncEnabled } from '@/lib/platform/feature-flags';
import { AnimatedGradientText } from '@/components/platform/ui/animated-gradient-text';
import { NumberTicker } from '@/components/platform/ui/number-ticker';
import { BlurIn } from '@/components/platform/ui/blur-in';
import { cn } from '@/lib/platform/utils';

interface SyncHealth {
  overall: 'healthy' | 'warning' | 'error';
  lastSync: string | null;
  pendingItems: number;
  failedItems: number;
  conflictCount: number;
  avgSyncTime: number;
}

export default function SyncMonitoringDashboard() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [statistics, setStatistics] = useState<SyncStatistic[]>([]);
  const [conflicts, setConflicts] = useState<SyncConflict[]>([]);
  const [queueItems, setQueueItems] = useState<SyncQueueItem[]>([]);
  const [syncHealth, setSyncHealth] = useState<SyncHealth>({
    overall: 'healthy',
    lastSync: null,
    pendingItems: 0,
    failedItems: 0,
    conflictCount: 0,
    avgSyncTime: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Check if features are enabled
  useEffect(() => {
    setIsEnabled(isSquareAppointmentsEnabled());
    setSyncEnabled(isSquareSyncEnabled());
  }, []);

  // Fetch sync data
  const fetchSyncData = async () => {
    if (!isEnabled || !syncEnabled) return;

    try {
      setIsLoading(true);
      
      // Fetch statistics
      const stats = await bidirectionalSyncService.getSyncStatistics();
      setStatistics(stats || []);

      // Fetch pending conflicts
      const pendingConflicts = await bidirectionalSyncService.getPendingConflicts();
      setConflicts(pendingConflicts || []);

      // Fetch queue items (recent ones)
      const queueData = await bidirectionalSyncService.getSyncQueue(20);
      setQueueItems(queueData || []);

      // Calculate health metrics
      calculateHealthMetrics(stats || [], pendingConflicts || [], queueData || []);

    } catch (error) {
      console.error('Failed to fetch sync data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate health metrics
  const calculateHealthMetrics = (
    stats: SyncStatistic[], 
    conflicts: SyncConflict[], 
    queue: SyncQueueItem[]
  ) => {
    const recentStats = stats.filter(s => {
      const dateStr = s.date || s.timestamp;
      return dateStr && new Date(dateStr) > new Date(Date.now() - 24 * 60 * 60 * 1000);
    });

    const totalOps = recentStats.reduce((sum, s) => sum + (s.total_operations ?? 0), 0);
    const failedOps = recentStats.reduce((sum, s) => sum + (s.failure_count ?? 0), 0);
    const successRate = totalOps > 0 ? (totalOps - failedOps) / totalOps : 1;
    
    const avgSyncTime = recentStats.length > 0 
      ? recentStats.reduce((sum, s) => sum + (s.avg_sync_time_ms ?? 0), 0) / recentStats.length 
      : 0;

    const pendingItems = queue.filter(q => q.status === 'pending').length;
    const failedItems = queue.filter(q => q.status === 'failed').length;

    let overall: 'healthy' | 'warning' | 'error' = 'healthy';
    if (successRate < 0.8 || failedItems > 10) overall = 'error';
    else if (successRate < 0.95 || pendingItems > 50) overall = 'warning';

    const lastSync = stats.length > 0 ? (stats[0]?.date ?? stats[0]?.timestamp ?? null) : null;

    setSyncHealth({
      overall,
      lastSync,
      pendingItems,
      failedItems,
      conflictCount: conflicts.length,
      avgSyncTime,
    });
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && isEnabled && syncEnabled) {
      fetchSyncData();
      const interval = setInterval(fetchSyncData, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
    return () => {}; // Empty cleanup function
  }, [autoRefresh, isEnabled, syncEnabled]);

  // Initial fetch
  useEffect(() => {
    if (isEnabled && syncEnabled) {
      fetchSyncData();
    }
  }, [isEnabled, syncEnabled]);

  // Manual sync trigger
  const handleManualSync = async () => {
    if (isSyncing) return;

    try {
      setIsSyncing(true);
      const result = await bidirectionalSyncService.syncBidirectional({
        direction: 'bidirectional',
        conflictResolution: 'merge',
        batchSize: 50
      });

      console.log('Manual sync completed:', result);
      
      // Refresh data after sync
      await fetchSyncData();
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Resolve conflict
  const handleResolveConflict = async (conflictId: string, strategy: string) => {
    try {
      await bidirectionalSyncService.resolveConflict(conflictId, strategy as 'local_wins' | 'external_wins' | 'merge');

      // Refresh data after resolution
      await fetchSyncData();
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
    }
  };

  // Retry failed queue item
  const handleRetryQueueItem = async (itemId: string) => {
    try {
      await bidirectionalSyncService.retryQueueItem(itemId);

      // Refresh data after retry
      await fetchSyncData();
    } catch (error) {
      console.error('Failed to retry queue item:', error);
    }
  };

  if (!isEnabled || !syncEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-4xl mx-auto">
          <BlurIn>
            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <AnimatedGradientText className="text-2xl font-bold mb-2">
                  Square Sync Monitoring
                </AnimatedGradientText>
                <CardDescription className="text-base">
                  Square Appointments sync is currently disabled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
                  <AlertOctagon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-blue-900 dark:text-blue-100">Feature Disabled</AlertTitle>
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    Square Appointments integration is not enabled. Please enable it in the settings to use sync monitoring.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </BlurIn>
        </div>
      </div>
    );
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case 'processing': return <Badge variant="outline" className="bg-blue-50 text-blue-700">Processing</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header with AceternityUI */}
        <BlurIn delay={0.1}>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <AnimatedGradientText className="text-3xl font-bold">
                Square Sync Monitoring
              </AnimatedGradientText>
              <p className="text-muted-foreground text-lg">
                Monitor bidirectional sync status between Square and Supabase
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="default"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={cn(
                  "transition-all duration-300",
                  autoRefresh ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800' : ''
                )}
              >
                <RefreshCw className={cn(`h-4 w-4 mr-2`, autoRefresh ? 'animate-spin' : '')} />
                Auto Refresh
              </Button>
              <Button
                onClick={handleManualSync}
                disabled={isSyncing}
                size="default"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RefreshCw className={cn(`h-4 w-4 mr-2`, isSyncing ? 'animate-spin' : '')} />
                {isSyncing ? 'Syncing...' : 'Manual Sync'}
              </Button>
            </div>
          </div>
        </BlurIn>

      {/* Enhanced Health Overview with AceternityUI */}
      <div className="grid gap-6 md:grid-cols-4">
        <BlurIn delay={0.2}>
          <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sync Health</CardTitle>
              <div className={cn(
                "p-2 rounded-full transition-all duration-300 group-hover:opacity-80",
                syncHealth.overall === 'healthy' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                syncHealth.overall === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              )}>
                <ShieldCheck className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-3xl font-bold mb-2 transition-colors duration-300",
                syncHealth.overall === 'healthy' ? 'text-green-600 dark:text-green-400' :
                syncHealth.overall === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              )}>
                {syncHealth.overall.charAt(0).toUpperCase() + syncHealth.overall.slice(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                {syncHealth.lastSync ? `Last sync: ${new Date(syncHealth.lastSync).toLocaleTimeString()}` : 'No sync yet'}
              </p>
              <Progress 
                value={syncHealth.overall === 'healthy' ? 100 : syncHealth.overall === 'warning' ? 70 : 30} 
                className="mt-3 h-2"
              />
            </CardContent>
          </Card>
        </BlurIn>

        <BlurIn delay={0.3}>
          <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Items</CardTitle>
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:opacity-80">
                <Clock className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <NumberTicker value={syncHealth.pendingItems} className="text-3xl font-bold mb-2" />
              <p className="text-xs text-muted-foreground">
                Items waiting to sync
              </p>
              <Progress 
                value={Math.min((syncHealth.pendingItems / 100) * 100, 100)} 
                className="mt-3 h-2"
              />
            </CardContent>
          </Card>
        </BlurIn>

        <BlurIn delay={0.4}>
          <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed Items</CardTitle>
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 transition-all duration-300 group-hover:opacity-80">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <NumberTicker value={syncHealth.failedItems} className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2" />
              <p className="text-xs text-muted-foreground">
                Items that need attention
              </p>
              <Progress 
                value={Math.min((syncHealth.failedItems / 20) * 100, 100)} 
                className="mt-3 h-2 bg-red-100 dark:bg-red-900/30"
              />
            </CardContent>
          </Card>
        </BlurIn>

        <BlurIn delay={0.5}>
          <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conflicts</CardTitle>
              <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 transition-all duration-300 group-hover:opacity-80">
                <Users className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <NumberTicker value={syncHealth.conflictCount} className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2" />
              <p className="text-xs text-muted-foreground">
                Data conflicts to resolve
              </p>
              <Progress 
                value={Math.min((syncHealth.conflictCount / 10) * 100, 100)} 
                className="mt-3 h-2 bg-orange-100 dark:bg-orange-900/30"
              />
            </CardContent>
          </Card>
        </BlurIn>
      </div>

      {/* Enhanced Sync Queue with Tabs */}
      <BlurIn delay={0.6}>
        <Tabs defaultValue="queue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Queue
            </TabsTrigger>
            <TabsTrigger value="conflicts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Conflicts
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-4">
            <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Recent Sync Queue Items
                </CardTitle>
                <CardDescription>
                  Latest synchronization activities and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : queueItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground text-lg">No recent sync activities</p>
                    <p className="text-sm text-muted-foreground/70">Sync queue is empty</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {queueItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 group">
                        <div className="flex items-center gap-4">
                          {getStatusBadge(item.status)}
                          <div>
                            <div className="font-medium capitalize flex items-center gap-2">
                              {item.entity_type} {item.operation}
                              {item.direction === 'to_external' ? (
                                <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                              ) : (
                                <ArrowRightLeft className="h-4 w-4 text-purple-500" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                item.direction === 'to_external' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                              )}>
                                {item.direction === 'to_external' ? '→ Square' : '← Square'}
                              </span>
                              <span>•</span>
                              <span>{new Date(item.created_at).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {item.status === 'failed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRetryQueueItem(item.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              Retry
                            </Button>
                          )}
                          {item.error_message && (
                            <span className="text-sm text-red-600 dark:text-red-400 max-w-xs truncate bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                              {item.error_message}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conflicts" className="space-y-4">
            {conflicts.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">No conflicts to resolve</p>
                  <p className="text-sm text-muted-foreground/70">All sync operations are running smoothly</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Pending Conflicts ({conflicts.length})
                  </CardTitle>
                  <CardDescription>
                    Data conflicts that need manual resolution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conflicts.map((conflict) => (
                      <div key={conflict.id} className="p-5 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-medium capitalize flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              {conflict.entity_type} Conflict
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                {(conflict.conflict_type ?? conflict.type ?? 'unknown').replace('_', ' ')}
                              </span>
                              <span>•</span>
                              <span>{new Date(conflict.created_at).toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveConflict(conflict.id, 'local_wins')}
                              className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
                            >
                              Keep Local
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveConflict(conflict.id, 'external_wins')}
                              className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/30"
                            >
                              Keep External
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveConflict(conflict.id, 'merge')}
                              className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
                            >
                              Merge
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">Local ID:</span>
                            <code className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">{conflict.local_id}</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">External ID:</span>
                            <code className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">{conflict.external_id}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            {statistics.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">No statistics available</p>
                  <p className="text-sm text-muted-foreground/70">Start syncing to see performance metrics</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sync Statistics (Last 30 Days)
                  </CardTitle>
                  <CardDescription>
                    Historical sync performance and success rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statistics.slice(0, 7).map((stat) => (
                      <div key={stat.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 group">
                        <div>
                          <div className="font-medium capitalize flex items-center gap-2">
                            {stat.entity_type} {stat.operation}
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              stat.sync_direction === 'to_external' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            )}>
                              {stat.sync_direction}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(stat.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">{stat.success_count ?? 0}</span>
                          </div>
                          {(stat.failure_count ?? 0) > 0 && (
                            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="font-medium">{stat.failure_count}</span>
                            </div>
                          )}
                          {(stat.conflict_count ?? 0) > 0 && (
                            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">{stat.conflict_count}</span>
                            </div>
                          )}
                          <div className="text-muted-foreground font-medium">
                            {stat.avg_sync_time_ms ?? 0}ms
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </BlurIn>

      </div>
    </div>
  );
}