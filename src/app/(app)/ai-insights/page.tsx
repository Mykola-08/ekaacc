'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Calendar,
  Activity
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type AIInsight = {
  id: string;
  type: 'success' | 'warning' | 'suggestion' | 'milestone';
  title: string;
  description: string;
  confidence: number;
  action?: {
    label: string;
    href: string;
  };
};

export default function AIInsightsPage() {
  // Mock AI-generated insights
  const insights: AIInsight[] = [
    {
      id: '1',
      type: 'success',
      title: 'Excellent Progress Detected',
      description: 'Your consistency over the past 2 weeks has resulted in a 25% reduction in reported pain levels. AI analysis shows optimal recovery trajectory.',
      confidence: 94,
      action: {
        label: 'View Progress',
        href: '/progress'
      }
    },
    {
      id: '2',
      type: 'warning',
      title: 'Potential Burnout Risk',
      description: 'AI noticed increased pain levels after high-intensity sessions. Consider spacing out intense workouts and adding more recovery days.',
      confidence: 82,
      action: {
        label: 'Adjust Schedule',
        href: '/sessions'
      }
    },
    {
      id: '3',
      type: 'suggestion',
      title: 'Recommended: Morning Stretching',
      description: 'Based on your journal entries, morning stiffness is most common. Adding 10 minutes of gentle stretching could reduce this by up to 40%.',
      confidence: 88,
      action: {
        label: 'View Exercises',
        href: '/exercises'
      }
    },
    {
      id: '4',
      type: 'milestone',
      title: 'Milestone Approaching!',
      description: '2 more sessions until you reach your 10-session goal. AI predicts 15% additional mobility improvement upon completion.',
      confidence: 91,
      action: {
        label: 'Book Session',
        href: '/sessions'
      }
    },
    {
      id: '5',
      type: 'suggestion',
      title: 'Optimal Session Timing',
      description: 'AI analysis of your journal shows best energy levels between 2-4 PM. Scheduling sessions during this window may enhance outcomes by 20%.',
      confidence: 85,
      action: {
        label: 'View Calendar',
        href: '/sessions'
      }
    }
  ];

  const stats = {
    totalInsights: 12,
    actionsCompleted: 8,
    averageConfidence: 87,
    trendsAnalyzed: 156
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-blue-600" />;
      case 'milestone':
        return <Sparkles className="h-5 w-5 text-purple-600" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20';
      case 'warning':
        return 'border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20';
      case 'suggestion':
        return 'border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20';
      case 'milestone':
        return 'border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground mt-1">
          Personalized recommendations powered by AI analysis
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.totalInsights}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actions Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.actionsCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.actionsCompleted / stats.totalInsights) * 100).toFixed(0)}% completion
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.averageConfidence}%</div>
            <Progress value={stats.averageConfidence} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trends Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.trendsAnalyzed}</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Personalized Insights</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Last 7 days
          </Button>
        </div>

        <div className="space-y-3">
          {insights.map((insight, index) => (
            <Card 
              key={insight.id} 
              className={`border transition-all duration-200 hover:shadow-md ${getInsightColor(insight.type)}`}
              style={{ 
                animationDelay: `${index * 50}ms`,
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-base font-semibold leading-none">
                        {insight.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {insight.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium shrink-0">
                    {insight.confidence}% confidence
                  </Badge>
                </div>
              </CardHeader>
              {insight.action && (
                <CardContent className="pt-0">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-8 text-xs font-medium"
                    asChild
                  >
                    <a href={insight.action.href}>
                      {insight.action.label}
                    </a>
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* AI Analysis Summary */}
      <Card className="border-0 shadow-subtle bg-muted/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <CardTitle className="text-lg">How AI Analyzes Your Data</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="font-medium text-sm">Pattern Recognition</p>
              </div>
              <p className="text-sm text-muted-foreground">
                AI identifies trends in your pain levels, mood, energy, and session outcomes.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <p className="font-medium text-sm">Predictive Analytics</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Machine learning predicts optimal recovery paths based on similar user journeys.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <p className="font-medium text-sm">Personalized Recommendations</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Tailored suggestions based on your unique goals, progress, and preferences.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                <p className="font-medium text-sm">Continuous Learning</p>
              </div>
              <p className="text-sm text-muted-foreground">
                AI refines insights as you log more data, improving accuracy over time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
