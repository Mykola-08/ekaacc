'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/platform/auth-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs';
import { Progress } from '@/components/platform/ui/progress';
import { Separator } from '@/components/platform/ui/separator';
import { toast } from 'sonner';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Calendar,
  Clock,
  Heart,
  Zap,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { EnhancedAIChat } from '@/components/platform/ai/enhanced-ai-chat';
import { AIPersonalizationService } from '@/ai/ai-personalization-service';
import { AIBackgroundMonitor } from '@/ai/ai-background-monitor';
import { PageContainer } from '@/components/platform/eka/page-container';
import { PageHeader } from '@/components/platform/eka/page-header';
import { SurfacePanel } from '@/components/platform/eka/surface-panel';

interface AIInsight {
  id: string;
  type: 'wellness' | 'behavior' | 'therapy' | 'goal';
  title: string;
  description: string;
  confidence: number;
  trend: 'improving' | 'declining' | 'stable';
  timestamp: number;
  actionable: boolean;
  metadata?: Record<string, any>;
}

interface AIPersonalizationData {
  userId: string;
  preferences: {
    personalizationLevel: 'minimal' | 'balanced' | 'comprehensive';
    proactiveSuggestions: boolean;
    wellnessMonitoring: boolean;
    therapyInsights: boolean;
  };
  patterns: {
    navigation: any[];
    engagement: any[];
    wellness: any[];
  };
  insights: AIInsight[];
  lastUpdated: number;
}

export default function AIInsightsPage() {
  const { user } = useAuth();
  const [personalizationData, setPersonalizationData] = useState<AIPersonalizationData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [insights, setInsights] = useState<AIInsight[]>([]);

  const wellnessInsights = insights.filter((i: any) => i.type === 'wellness');
  const behaviorInsights = insights.filter((i: any) => i.type === 'behavior');
  const therapyInsights = insights.filter((i: any) => i.type === 'therapy');
  const goalInsights = insights.filter((i: any) => i.type === 'goal');

  // Initialize AI services and load data
  useEffect(() => {
    if (user?.id) {
      initializeAIData();
    }
  }, [user?.id, lastRefresh]);

  const initializeAIData = async () => {
    try {
      setIsLoading(true);

      // Initialize background monitoring
      const aiMonitor = new AIBackgroundMonitor();
      await aiMonitor.initializeMonitoring(user!.id, {
        privacyLevel: 'comprehensive',
        proactiveSuggestions: true,
      } as any);

      // Get personalized insights
      const aiPersonalization = new AIPersonalizationService();
      const insights = await aiPersonalization.getPersonalizedInsights({
        userId: user!.id,
        context: {
          currentPage: 'dashboard_overview',
          recentActivity: [],
          subscriptionTier: 'premium',
        },
        limit: 20,
      } as any);

      // Generate mock AI insights for demonstration
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'wellness',
          title: 'Mood Stability Improving',
          description:
            'Your mood patterns show increased stability over the past 2 weeks, with fewer significant fluctuations.',
          confidence: 87,
          trend: 'improving',
          timestamp: Date.now() - 86400000,
          actionable: true,
          metadata: { metric: 'mood_stability', change: '+15%' },
        },
        {
          id: '2',
          type: 'behavior',
          title: 'Session Engagement Increased',
          description:
            "You've shown higher engagement in therapy sessions, with more active participation and questions.",
          confidence: 92,
          trend: 'improving',
          timestamp: Date.now() - 172800000,
          actionable: false,
          metadata: { metric: 'session_engagement', change: '+23%' },
        },
        {
          id: '3',
          type: 'therapy',
          title: 'Coping Strategy Effectiveness',
          description:
            "The breathing exercises you've been practicing show 78% effectiveness in reducing anxiety levels.",
          confidence: 78,
          trend: 'stable',
          timestamp: Date.now() - 259200000,
          actionable: true,
          metadata: { strategy: 'breathing_exercises', effectiveness: 0.78 },
        },
        {
          id: '4',
          type: 'goal',
          title: 'Goal Progress Acceleration',
          description:
            'Your progress toward stress management goals has accelerated significantly this month.',
          confidence: 85,
          trend: 'improving',
          timestamp: Date.now() - 345600000,
          actionable: true,
          metadata: { goal: 'stress_management', progress: 0.68 },
        },
        {
          id: '5',
          type: 'wellness',
          title: 'Sleep Pattern Analysis',
          description:
            'Your sleep quality has improved, with more consistent sleep schedules and fewer nighttime awakenings.',
          confidence: 81,
          trend: 'improving',
          timestamp: Date.now() - 432000000,
          actionable: true,
          metadata: { metric: 'sleep_quality', improvement: '+12%' },
        },
        {
          id: '6',
          type: 'behavior',
          title: 'App Usage Optimization',
          description:
            "You're using the platform more efficiently, spending quality time on high-impact features.",
          confidence: 89,
          trend: 'improving',
          timestamp: Date.now() - 518400000,
          actionable: false,
          metadata: { metric: 'app_usage_efficiency', change: '+18%' },
        },
      ];

      setInsights([...insights, ...(mockInsights as any[])]);

      // Load personalization data
      const personalization = await aiPersonalization.getPersonalizationProfile(user!.id);
      setPersonalizationData({
        userId: user!.id,
        preferences: {
          personalizationLevel: 'balanced',
          proactiveSuggestions: true,
          wellnessMonitoring: true,
          therapyInsights: true,
        },
        patterns: {
          navigation: [],
          engagement: [],
          wellness: [],
        },
        insights: (insights as any[]).slice(0, 5),
        lastUpdated: Date.now(),
      });

      // Track page visit
      aiPersonalization.trackUserInteraction({
        id: `interaction_${Date.now()}`,
        userId: user!.id,
        type: 'page_view',
        timestamp: new Date(),
        metadata: {
          action: 'ai_dashboard_accessed',
          section: 'ai_insights',
          page: 'ai_insights',
          section_detail: 'dashboard',
        },
        context: {
          page: 'ai_insights',
          section: 'dashboard',
        },
      });
    } catch (error) {
      console.error('Failed to load AI data:', error);
      toast.error('Failed to load AI insights');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setLastRefresh(Date.now());
    toast.success('Refreshing AI insights...');
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'wellness':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'behavior':
        return <Activity className="h-5 w-5 text-blue-500" />;
      case 'therapy':
        return <Brain className="h-5 w-5 text-purple-500" />;
      case 'goal':
        return <Target className="h-5 w-5 text-green-500" />;
      default:
        return <Zap className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTrendIcon = (trend: AIInsight['trend']) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Activity className="text-muted-foreground h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 70) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          icon={Brain}
          title="AI Insights"
          description="Personalized wellness intelligence"
          badge="AI Powered"
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          }
        />
        <SurfacePanel className="animate-pulse">
          <div className="mb-8 h-8 w-64 rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <div className="h-4 w-32 rounded bg-gray-200"></div>
                  <div className="h-3 w-full rounded bg-gray-200"></div>
                  <div className="h-3 w-24 rounded bg-gray-200"></div>
                </div>
              </Card>
            ))}
          </div>
        </SurfacePanel>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        icon={Brain}
        title="AI Insights"
        description="Personalized wellness intelligence"
        badge="AI Powered"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        }
        className="mt-2"
      />
      <SurfacePanel className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-muted shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-900">Total Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">{insights.length}</div>
                <p className="mt-1 text-sm text-blue-700">Active AI observations</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-muted shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-900">
                  Improving Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">
                  {insights.filter((i: any) => i.trend === 'improving').length}
                </div>
                <p className="mt-1 text-sm text-green-700">Positive developments</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-muted shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-900">
                  Avg. Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">
                  {insights.length > 0
                    ? Math.round(
                        insights.reduce((acc: any, i: any) => acc + i.confidence, 0) /
                          insights.length
                      )
                    : 0}
                  %
                </div>
                <p className="mt-1 text-sm text-purple-700">AI prediction accuracy</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-muted shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-orange-900">
                  Actionable Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-900">
                  {insights.filter((i: any) => i.actionable).length}
                </div>
                <p className="mt-1 text-sm text-orange-700">Recommended actions</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Insights</span>
            </TabsTrigger>
            <TabsTrigger value="personalization" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Personalization</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>AI Assistant</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Wellness Insights */}
              <Card className="border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Wellness Insights</span>
                    <Badge variant="secondary">{wellnessInsights.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {wellnessInsights.slice(0, 3).map((insight: any) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-muted/40 border-border rounded-xl border p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getInsightIcon(insight.type)}
                          <span className="text-foreground font-medium">{insight.title}</span>
                        </div>
                        {getTrendIcon(insight.trend)}
                      </div>
                      <p className="text-muted-foreground mb-3 text-sm">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className={`h-full ${getConfidenceColor(insight.confidence)}`}
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {insight.confidence}%
                          </span>
                        </div>
                        {insight.actionable && (
                          <Badge variant="outline" className="text-xs">
                            Actionable
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {wellnessInsights.length === 0 && (
                    <p className="text-muted-foreground py-4 text-center text-sm">
                      No wellness insights available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Behavior Insights */}
              <Card className="border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span>Behavior Insights</span>
                    <Badge variant="secondary">{behaviorInsights.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {behaviorInsights.slice(0, 3).map((insight: any) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-muted/40 border-border rounded-xl border p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getInsightIcon(insight.type)}
                          <span className="text-foreground font-medium">{insight.title}</span>
                        </div>
                        {getTrendIcon(insight.trend)}
                      </div>
                      <p className="text-muted-foreground mb-3 text-sm">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className={`h-full ${getConfidenceColor(insight.confidence)}`}
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {insight.confidence}%
                          </span>
                        </div>
                        {insight.actionable && (
                          <Badge variant="outline" className="text-xs">
                            Actionable
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {behaviorInsights.length === 0 && (
                    <p className="text-muted-foreground py-4 text-center text-sm">
                      No behavior insights available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Therapy Insights */}
              <Card className="border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-indigo-500" />
                    <span>Therapy Insights</span>
                    <Badge variant="secondary">{therapyInsights.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {therapyInsights.slice(0, 3).map((insight: any) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-muted/40 border-border rounded-xl border p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getInsightIcon(insight.type)}
                          <span className="text-foreground font-medium">{insight.title}</span>
                        </div>
                        {getTrendIcon(insight.trend)}
                      </div>
                      <p className="text-muted-foreground mb-3 text-sm">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className={`h-full ${getConfidenceColor(insight.confidence)}`}
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {insight.confidence}%
                          </span>
                        </div>
                        {insight.actionable && (
                          <Badge variant="outline" className="text-xs">
                            Actionable
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {therapyInsights.length === 0 && (
                    <p className="text-muted-foreground py-4 text-center text-sm">
                      No therapy insights available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Goal Insights */}
              <Card className="border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-emerald-500" />
                    <span>Goal Insights</span>
                    <Badge variant="secondary">{goalInsights.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goalInsights.slice(0, 3).map((insight: any) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-muted/40 border-border rounded-xl border p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getInsightIcon(insight.type)}
                          <span className="text-foreground font-medium">{insight.title}</span>
                        </div>
                        {getTrendIcon(insight.trend)}
                      </div>
                      <p className="text-muted-foreground mb-3 text-sm">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className={`h-full ${getConfidenceColor(insight.confidence)}`}
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {insight.confidence}%
                          </span>
                        </div>
                        {insight.actionable && (
                          <Badge variant="outline" className="text-xs">
                            Actionable
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {goalInsights.length === 0 && (
                    <p className="text-muted-foreground py-4 text-center text-sm">
                      No goal insights available
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              {insights.map((insight: any, index: number) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-border shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-3">
                          {getInsightIcon(insight.type)}
                          <span>{insight.title}</span>
                          <Badge variant="outline">{insight.type}</Badge>
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(insight.trend)}
                          <Badge variant="secondary">{insight.confidence}% Confidence</Badge>
                        </div>
                      </div>
                      <CardDescription>
                        <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(insight.timestamp).toLocaleTimeString()}</span>
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/90 mb-4">{insight.description}</p>
                      {insight.metadata && (
                        <div className="bg-muted/40 rounded-xl p-3">
                          <h4 className="text-foreground mb-2 text-sm font-medium">
                            Additional Details
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(insight.metadata).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground capitalize">
                                  {key.replace('_', ' ')}:
                                </span>
                                <span className="text-foreground font-medium">
                                  {typeof value === 'number' && key.includes('percentage')
                                    ? `${value}%`
                                    : typeof value === 'number' && value < 1
                                      ? `${Math.round(value * 100)}%`
                                      : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {insights.length === 0 && (
                <Card className="border-border shadow-lg">
                  <CardContent className="py-12 text-center">
                    <Brain className="text-muted-foreground/80 mx-auto mb-4 h-12 w-12" />
                    <h3 className="text-foreground mb-2 text-lg font-medium">
                      No Insights Available
                    </h3>
                    <p className="text-muted-foreground">
                      AI insights will appear here as you continue using the platform.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="personalization" className="space-y-6">
            {personalizationData ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-indigo-500" />
                      <span>Privacy Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Personalization Level</span>
                        <Badge variant="outline" className="capitalize">
                          {personalizationData.preferences.personalizationLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Proactive Suggestions</span>
                        <Badge
                          variant={
                            personalizationData.preferences.proactiveSuggestions
                              ? 'default'
                              : 'outline'
                          }
                        >
                          {personalizationData.preferences.proactiveSuggestions
                            ? 'Enabled'
                            : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Wellness Monitoring</span>
                        <Badge
                          variant={
                            personalizationData.preferences.wellnessMonitoring
                              ? 'default'
                              : 'outline'
                          }
                        >
                          {personalizationData.preferences.wellnessMonitoring
                            ? 'Active'
                            : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Therapy Insights</span>
                        <Badge
                          variant={
                            personalizationData.preferences.therapyInsights ? 'default' : 'outline'
                          }
                        >
                          {personalizationData.preferences.therapyInsights ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      <span>Activity Patterns</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Navigation Patterns</span>
                          <span className="text-muted-foreground text-sm">
                            {personalizationData.patterns.navigation.length} tracked
                          </span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Engagement History</span>
                          <span className="text-muted-foreground text-sm">
                            {personalizationData.patterns.engagement.length} events
                          </span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Wellness Data</span>
                          <span className="text-muted-foreground text-sm">
                            {personalizationData.patterns.wellness.length} entries
                          </span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                    </div>
                    <Separator />
                    <div className="text-muted-foreground text-sm">
                      Last updated: {new Date(personalizationData.lastUpdated).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-border shadow-lg">
                <CardContent className="py-12 text-center">
                  <Shield className="text-muted-foreground/80 mx-auto mb-4 h-12 w-12" />
                  <h3 className="text-foreground mb-2 text-lg font-medium">
                    Personalization Data Loading
                  </h3>
                  <p className="text-muted-foreground">
                    Your personalized settings will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="assistant" className="space-y-6">
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>AI Assistant</span>
                  <Badge variant="default">Interactive</Badge>
                </CardTitle>
                <CardDescription>
                  Chat with our AI assistant for personalized support and guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedAIChat userId={user?.id || ''} subscriptionTier="premium" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SurfacePanel>
    </PageContainer>
  );
}
