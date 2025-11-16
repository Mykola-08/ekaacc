'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, X, Zap, Heart, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { BehavioralTrackingService, BehavioralPattern, PredictiveInsight } from '@/services/behavioral-tracking-service';
import { useAuth } from '@/lib/supabase-auth';
import { TextLoop } from '@/components/motion-primitives/text-loop';
import { InView } from '@/components/motion-primitives/in-view';
import { AnimatedGroup } from '@/components/motion-primitives/animated-group';

interface BehavioralInsightCardProps {
  pattern: BehavioralPattern;
  onResolve?: (patternId: string) => void;
}

const BehavioralInsightCard: React.FC<BehavioralInsightCardProps> = ({ pattern, onResolve }) => {
  const severityColors = {
    low: 'bg-green-500/10 text-green-600 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    high: 'bg-red-500/10 text-red-600 border-red-500/20'
  };

  const severityIcons = {
    low: CheckCircle,
    medium: AlertTriangle,
    high: Zap
  };

  const patternIcons = {
    engagement_decline: Target,
    mood_deterioration: Heart,
    session_frequency_drop: Brain,
    crisis_pattern: Zap,
    positive_progress: CheckCircle,
    goal_achievement: Target,
    adherence_increase: TrendingUp
  };

  const IconComponent = severityIcons[pattern.severity];
  const PatternIcon = patternIcons[pattern.pattern_type];

  return (
    <InView>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "apple-card apple-card-subtle apple-p-6 relative overflow-hidden",
          severityColors[pattern.severity],
          "apple-hover-lift apple-transition"
        )}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0"
          animate={{
            opacity: [0, 0.3, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="apple-card-icon apple-card-icon-blue"
              >
                <PatternIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="apple-title-card capitalize">
                  {pattern.pattern_type.replace(/_/g, ' ')}
                </h3>
                <div className="apple-flex apple-items-center apple-gap-2 apple-mt-1">
                  <Badge variant="outline" className={cn("apple-text-xs capitalize", severityColors[pattern.severity])}>
                    <IconComponent className="w-3 h-3 mr-1" />
                    {pattern.severity}
                  </Badge>
                  <Badge variant="secondary" className="apple-text-xs">
                    {Math.round(pattern.confidence_score * 100)}% confidence
                  </Badge>
                </div>
              </div>
            </div>
            {onResolve && pattern.status === 'active' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onResolve(pattern.id!)}
                className="apple-button-icon apple-hover-lift"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          <div className="apple-space-y-4">
            <div>
              <h4 className="apple-text-sm apple-font-medium apple-mb-3">Evidence</h4>
              <ul className="apple-space-y-2">
                {pattern.evidence.map((evidence, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="apple-text-sm apple-flex apple-items-start apple-gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{evidence}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="apple-flex-between apple-pt-4 apple-border-t">
              <div className="apple-text-xs">
                First detected: {new Date(pattern.first_detected).toLocaleDateString()}
              </div>
              <div className="apple-flex apple-items-center apple-gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="apple-text-xs">{pattern.status}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </InView>
  );
};

interface PredictiveInsightCardProps {
  insight: PredictiveInsight;
  onDismiss?: (insightId: string) => void;
}

const PredictiveInsightCard: React.FC<PredictiveInsightCardProps> = ({ insight, onDismiss }) => {
  const insightColors = {
    potential_crisis: 'bg-red-500/10 text-red-600 border-red-500/20',
    relapse_risk: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    treatment_resistance: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    engagement_decline: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    positive_outcome: 'bg-green-500/10 text-green-600 border-green-500/20'
  };

  const insightIcons = {
    potential_crisis: Zap,
    relapse_risk: AlertTriangle,
    treatment_resistance: Brain,
    engagement_decline: TrendingUp,
    positive_outcome: CheckCircle
  };

  const IconComponent = insightIcons[insight.insight_type];

  return (
    <InView>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -5 }}
        className={cn(
          "relative overflow-hidden rounded-xl border p-6 backdrop-blur-sm",
          insightColors[insight.insight_type]
        )}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: '200% 200%'
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"
              >
                <IconComponent className="w-6 h-6 text-blue-600" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-lg capitalize">
                  {insight.insight_type.replace(/_/g, ' ')}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className={cn("capitalize")}>
                    {insight.timeframe.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="secondary">
                    {Math.round(insight.probability * 100)}% probability
                  </Badge>
                </div>
              </div>
            </div>
            {onDismiss && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDismiss(insight.id!)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Contributing Factors</h4>
              <ul className="space-y-1">
                {insight.contributing_factors.map((factor, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm text-muted-foreground flex items-start space-x-2"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{factor}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Recommended Actions</h4>
              <ul className="space-y-1">
                {insight.recommended_actions.map((action, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="text-sm text-muted-foreground flex items-start space-x-2"
                  >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{action}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(insight.created_at).toLocaleDateString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Expires: {new Date(insight.expires_at).toLocaleDateString()}
                </div>
              </div>
              <Progress 
                value={((new Date(insight.expires_at).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000)) * 100} 
                className="mt-2 h-1"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </InView>
  );
};

const AIBehavioralInsights: React.FC = () => {
  const { user } = useAuth();
  const [patterns, setPatterns] = useState<BehavioralPattern[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'patterns' | 'insights'>('patterns');

  const trackingService = BehavioralTrackingService.getInstance();

  useEffect(() => {
    if (user) {
      loadBehavioralInsights();
    }
  }, [user]);

  const loadBehavioralInsights = async () => {
    try {
      setLoading(true);
      const data = await trackingService.getUserBehavioralInsights(user!.id);
      setPatterns(data.patterns);
      setInsights(data.insights);
    } catch (error) {
      console.error('Error loading behavioral insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolvePattern = async (patternId: string) => {
    try {
      await trackingService.markPatternAsResolved(patternId);
      setPatterns(patterns.map(p => p.id === patternId ? { ...p, status: 'resolved' } : p));
    } catch (error) {
      console.error('Error resolving pattern:', error);
    }
  };

  const handleDismissInsight = async (insightId: string) => {
    try {
      await trackingService.dismissInsight(insightId);
      setInsights(insights.filter(i => i.id !== insightId));
    } catch (error) {
      console.error('Error dismissing insight:', error);
    }
  };

  const activePatterns = patterns.filter(p => p.status === 'active');
  const resolvedPatterns = patterns.filter(p => p.status === 'resolved');
  const activeInsights = insights.filter(i => !i.is_dismissed && new Date(i.expires_at) > new Date());

  const tabVariants = {
    active: { scale: 1.05 },
    inactive: { scale: 1 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Behavioral Insights
            </h2>
            <p className="text-muted-foreground mt-2">
              Personalized insights powered by behavioral analysis and predictive modeling
            </p>
          </div>
        </motion.div>
      </InView>

      {/* Tab Navigation */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative bg-muted/50 rounded-lg p-1 flex space-x-1">
          {['patterns', 'insights'].map((tab) => (
            <motion.button
              key={tab}
              variants={tabVariants}
              animate={activeTab === tab ? 'active' : 'inactive'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab as 'patterns' | 'insights')}
              className={cn(
                "relative px-6 py-2 rounded-md font-medium capitalize transition-all duration-200",
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === 'patterns' ? (
                <>
                  Behavioral Patterns
                  <motion.span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {activePatterns.length}
                  </motion.span>
                </>
              ) : (
                <>
                  Predictive Insights
                  <motion.span
                    className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {activeInsights.length}
                  </motion.span>
                </>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'patterns' && (
          <motion.div
            key="patterns"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {activePatterns.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                  <span>Active Patterns</span>
                </h3>
                <AnimatedGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activePatterns.map((pattern) => (
                    <BehavioralInsightCard
                      key={pattern.id}
                      pattern={pattern}
                      onResolve={handleResolvePattern}
                    />
                  ))}
                </AnimatedGroup>
              </div>
            )}

            {resolvedPatterns.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Resolved Patterns</span>
                </h3>
                <AnimatedGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resolvedPatterns.map((pattern) => (
                    <BehavioralInsightCard key={pattern.id} pattern={pattern} />
                  ))}
                </AnimatedGroup>
              </div>
            )}

            {patterns.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mb-4"
                  >
                    <Brain className="w-16 h-16 text-muted-foreground/50" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">No Patterns Detected</h3>
                  <p className="text-muted-foreground max-w-md">
                    Our AI system is continuously monitoring your interactions. Patterns will appear here when detected.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {activeInsights.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Brain className="w-5 h-5 text-blue-500" />
                  </motion.div>
                  <span>AI Predictions</span>
                </h3>
                <AnimatedGroup className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  {activeInsights.map((insight) => (
                    <PredictiveInsightCard
                      key={insight.id}
                      insight={insight}
                      onDismiss={handleDismissInsight}
                    />
                  ))}
                </AnimatedGroup>
              </div>
            )}

            {activeInsights.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-4"
                  >
                    <Target className="w-16 h-16 text-muted-foreground/50" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">No Predictions Available</h3>
                  <p className="text-muted-foreground max-w-md">
                    Our AI system needs more interaction data to generate accurate predictions. Keep using the platform!
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-muted-foreground"
      >
        <p>AI insights are generated based on your interaction patterns and are updated in real-time.</p>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>System monitoring active</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AIBehavioralInsights;