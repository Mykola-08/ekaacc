'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Calendar, 
  Heart, 
  Target,
  Zap,
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  MessageSquare,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { BehavioralTrackingService } from '@/services/behavioral-tracking-service';
import { useAuth } from '@/lib/supabase-auth';
import { InView } from '@/components/motion-primitives/in-view';
import { AnimatedGroup } from '@/components/motion-primitives/animated-group';
import { TextLoop } from '@/components/motion-primitives/text-loop';

interface BehavioralInsightsWidgetProps {
  className?: string;
}

interface InsightMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
}

const BehavioralInsightsWidget: React.FC<BehavioralInsightsWidgetProps> = ({ className }) => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  const trackingService = BehavioralTrackingService.getInstance();

  useEffect(() => {
    if (user) {
      loadInsights();
    }
  }, [user, selectedTimeframe]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const data = await trackingService.getUserBehavioralInsights(user!.id);
      
      // Calculate metrics
      const metrics = calculateMetrics(data);
      
      setInsights({
        patterns: data.patterns,
        insights: data.insights,
        metrics,
        recentInteractions: data.recentInteractions
      });
    } catch (error) {
      console.error('Error loading behavioral insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (data: any): InsightMetric[] => {
    const patterns = data.patterns || [];
    const interactions = data.recentInteractions || [];
    
    const recentInteractions = interactions.filter((i: any) => 
      new Date(i.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    const activePatterns = patterns.filter((p: any) => p.status === 'active');
    const highSeverityPatterns = activePatterns.filter((p: any) => p.severity === 'high');
    
    const sessionInteractions = recentInteractions.filter((i: any) => i.interaction_type === 'session_start');
    const moodInteractions = recentInteractions.filter((i: any) => i.interaction_type === 'mood_logged');
    const exerciseInteractions = recentInteractions.filter((i: any) => i.interaction_type === 'exercise_completed');

    return [
      {
        label: 'Active Patterns',
        value: activePatterns.length,
        change: activePatterns.length - Math.max(0, activePatterns.length - 1),
        trend: activePatterns.length > 0 ? 'down' : 'stable',
        icon: Brain,
        color: 'text-blue-600'
      },
      {
        label: 'High Priority',
        value: highSeverityPatterns.length,
        change: highSeverityPatterns.length,
        trend: highSeverityPatterns.length > 0 ? 'up' : 'stable',
        icon: AlertTriangle,
        color: 'text-red-600'
      },
      {
        label: 'Sessions This Month',
        value: sessionInteractions.length,
        change: sessionInteractions.length - Math.max(0, sessionInteractions.length - 2),
        trend: sessionInteractions.length > 5 ? 'up' : 'down',
        icon: Calendar,
        color: 'text-green-600'
      },
      {
        label: 'Mood Logs',
        value: moodInteractions.length,
        change: moodInteractions.length,
        trend: moodInteractions.length > 10 ? 'up' : 'stable',
        icon: Heart,
        color: 'text-purple-600'
      }
    ];
  };

  const MetricCard: React.FC<{ metric: InsightMetric }> = ({ metric }) => {
    const Icon = metric.icon;
    const trendColor = metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600';
    const trendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? AlertTriangle : Activity;

    return (
      <InView>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative group"
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% 200%'
            }}
          />
          
          <Card className="relative bg-background/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon className={cn("w-5 h-5", metric.color)} />
                    <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                  </div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center space-x-1">
                    {React.createElement(trendIcon, { className: cn("w-3 h-3", trendColor) })}
                    <span className={cn("text-xs", trendColor)}>
                      {metric.change > 0 ? '+' : ''}{metric.change}
                    </span>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="p-2 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"
                >
                  <Icon className={cn("w-6 h-6", metric.color)} />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </InView>
    );
  };

  const PatternPreview: React.FC<{ pattern: any }> = ({ pattern }) => {
    const severityColors = {
      low: 'bg-green-500/10 text-green-600 border-green-500/20',
      medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      high: 'bg-red-500/10 text-red-600 border-red-500/20'
    };

    const patternIcons = {
      engagement_decline: Target,
      mood_deterioration: Heart,
      session_frequency_drop: Brain,
      crisis_pattern: Zap,
      positive_progress: CheckCircle,
      goal_achievement: Target,
      adherence_increase: Activity
    };

    const Icon = patternIcons[pattern.pattern_type as keyof typeof patternIcons] || Brain;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "p-4 rounded-lg border transition-all duration-200 cursor-pointer",
          severityColors[pattern.severity as keyof typeof severityColors]
        )}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"
          >
            <Icon className="w-4 h-4" />
          </motion.div>
          <div className="flex-1">
            <div className="font-medium capitalize text-sm">
              {pattern.pattern_type.replace(/_/g, ' ')}
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round(pattern.confidence_score * 100)}% confidence
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </div>
      </motion.div>
    );
  };

  const InsightPreview: React.FC<{ insight: any }> = ({ insight }) => {
    const insightColors = {
      potential_crisis: 'bg-red-500/10 text-red-600',
      relapse_risk: 'bg-orange-500/10 text-orange-600',
      treatment_resistance: 'bg-yellow-500/10 text-yellow-600',
      engagement_decline: 'bg-blue-500/10 text-blue-600',
      positive_outcome: 'bg-green-500/10 text-green-600'
    };

    const insightIcons = {
      potential_crisis: Zap,
      relapse_risk: AlertTriangle,
      treatment_resistance: Brain,
      engagement_decline: TrendingUp,
      positive_outcome: CheckCircle
    };

    const Icon = insightIcons[insight.insight_type as keyof typeof insightIcons] || Brain;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "p-4 rounded-lg border transition-all duration-200",
          insightColors[insight.insight_type as keyof typeof insightColors]
        )}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"
          >
            <Icon className="w-4 h-4" />
          </motion.div>
          <div className="flex-1">
            <div className="font-medium capitalize text-sm">
              {insight.insight_type.replace(/_/g, ' ')}
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.round(insight.probability * 100)}% probability
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {insight.timeframe.replace(/_/g, ' ')}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <Brain className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-muted-foreground max-w-md">
            Start using the platform to generate behavioral insights and AI predictions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const activePatterns = insights.patterns.filter((p: any) => p.status === 'active');
  const recentInsights = insights.insights.slice(0, 3);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <InView>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"
          >
            <Brain className="w-8 h-8 text-blue-600" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Behavioral Insights
            </h2>
            <p className="text-muted-foreground mt-1">
              AI-powered analysis of your engagement patterns
            </p>
          </div>
        </motion.div>
      </InView>

      {/* Metrics Grid */}
      <AnimatedGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {insights.metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </AnimatedGroup>

      {/* Insights Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Patterns */}
        <InView>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-background/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                  <span>Active Patterns</span>
                  <Badge variant="secondary" className="ml-auto">
                    {activePatterns.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Current behavioral patterns detected by our AI system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activePatterns.slice(0, 3).map((pattern: any) => (
                    <PatternPreview key={pattern.id} pattern={pattern} />
                  ))}
                  {activePatterns.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No active patterns detected</p>
                    </div>
                  )}
                </div>
                {activePatterns.length > 3 && (
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    View All Patterns
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </InView>

        {/* AI Predictions */}
        <InView>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-background/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Brain className="w-5 h-5 text-blue-500" />
                  </motion.div>
                  <span>AI Predictions</span>
                  <Badge variant="secondary" className="ml-auto">
                    {recentInsights.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Predictive insights about your treatment progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentInsights.map((insight: any) => (
                    <InsightPreview key={insight.id} insight={insight} />
                  ))}
                  {recentInsights.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No predictions available yet</p>
                    </div>
                  )}
                </div>
                {recentInsights.length > 3 && (
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    View All Insights
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </InView>
      </div>

      {/* Recent Activity */}
      <InView>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-background/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-500" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Your latest interactions and engagement patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.recentInteractions.slice(0, 5).map((interaction: any, index: number) => (
                  <motion.div
                    key={interaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <div className="flex-1">
                      <div className="font-medium capitalize text-sm">
                        {interaction.interaction_type.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(interaction.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {interaction.device_type}
                    </Badge>
                  </motion.div>
                ))}
                {insights.recentInteractions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent activity to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </InView>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-muted-foreground"
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>AI monitoring active • Insights updated in real-time</span>
        </div>
      </motion.div>
    </div>
  );
};

export default BehavioralInsightsWidget;