'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { Progress } from '@/components/platform/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs';
import { ScrollArea } from '@/components/platform/ui/scroll-area';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  Zap,
  Star,
  Crown,
  Settings,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { NumberTicker } from '@/components/platform/magicui/number-ticker';
import { AnimatedGradientText } from '@/components/platform/magicui/animated-gradient-text';
import { RainbowButton } from '@/components/platform/magicui/rainbow-button';
import { ShimmerButton } from '@/components/platform/magicui/shimmer-button';
import { useInView } from '@/hooks/platform/use-in-view';
import { cn } from '@/lib/platform/utils';

interface AIDashboardProps {
  userId: string;
  subscriptionTier: 'basic' | 'premium' | 'vip';
}

interface AIUsageData {
  date: string;
  requests: number;
  tokens: number;
  cost: number;
}

interface AIModelPerformance {
  model: string;
  accuracy: number;
  speed: number;
  usage: number;
  satisfaction: number;
}

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  timestamp: string;
}

const subscriptionConfig = {
  basic: { limit: 50, color: 'bg-blue-500', icon: Star, name: 'Basic' },
  premium: { limit: 200, color: 'bg-purple-500', icon: Zap, name: 'Premium' },
  vip: { limit: 1000, color: 'bg-yellow-500', icon: Crown, name: 'VIP' }
};

const modelColors = {
  'gpt-4': '#3B82F6',
  'gpt-3.5-turbo': '#8B5CF6',
  'claude-3': '#10B981',
  'claude-2': '#F59E0B',
  'gemini-pro': '#EF4444'
};

export function AIDashboard({ userId, subscriptionTier }: AIDashboardProps) {
  const [usageData, setUsageData] = useState<AIUsageData[]>([]);
  const [modelPerformance, setModelPerformance] = useState<AIModelPerformance[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const ref = useRef(null);
  const isChartInView = useInView(ref);

  useEffect(() => {
    fetchDashboardData();
    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [timeRange, autoRefresh]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls
      const mockUsageData: AIUsageData[] = [
        { date: '2024-01-01', requests: 12, tokens: 2400, cost: 0.024 },
        { date: '2024-01-02', requests: 18, tokens: 3600, cost: 0.036 },
        { date: '2024-01-03', requests: 25, tokens: 5000, cost: 0.050 },
        { date: '2024-01-04', requests: 15, tokens: 3000, cost: 0.030 },
        { date: '2024-01-05', requests: 32, tokens: 6400, cost: 0.064 },
        { date: '2024-01-06', requests: 28, tokens: 5600, cost: 0.056 },
        { date: '2024-01-07', requests: 22, tokens: 4400, cost: 0.044 }
      ];

      const mockModelPerformance: AIModelPerformance[] = [
        { model: 'gpt-4', accuracy: 94, speed: 85, usage: 45, satisfaction: 4.8 },
        { model: 'gpt-3.5-turbo', accuracy: 88, speed: 95, usage: 35, satisfaction: 4.5 },
        { model: 'claude-3', accuracy: 92, speed: 88, usage: 15, satisfaction: 4.7 },
        { model: 'claude-2', accuracy: 89, speed: 92, usage: 3, satisfaction: 4.3 },
        { model: 'gemini-pro', accuracy: 86, speed: 90, usage: 2, satisfaction: 4.1 }
      ];

      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'trend',
          title: 'Usage Spike Detected',
          description: 'AI usage increased by 45% compared to last week',
          impact: 'high',
          timestamp: '2024-01-07T10:30:00Z'
        },
        {
          id: '2',
          type: 'achievement',
          title: 'Goal Completion Rate',
          description: 'Users with AI assistance achieve 73% more wellness goals',
          impact: 'medium',
          timestamp: '2024-01-06T14:15:00Z'
        },
        {
          id: '3',
          type: 'recommendation',
          title: 'Model Optimization',
          description: 'Consider switching to GPT-4 for better accuracy in therapy sessions',
          impact: 'medium',
          timestamp: '2024-01-05T09:45:00Z'
        },
        {
          id: '4',
          type: 'anomaly',
          title: 'Unusual Pattern',
          description: 'Higher than normal error rate in evening hours',
          impact: 'low',
          timestamp: '2024-01-04T18:20:00Z'
        }
      ];

      setUsageData(mockUsageData);
      setModelPerformance(mockModelPerformance);
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRequests = usageData.reduce((sum, day) => sum + day.requests, 0);
  const totalTokens = usageData.reduce((sum, day) => sum + day.tokens, 0);
  const totalCost = usageData.reduce((sum, day) => sum + day.cost, 0);
  const avgSatisfaction = modelPerformance.reduce((sum, model) => sum + model.satisfaction, 0) / modelPerformance.length;

  const pieData = modelPerformance.map(model => ({
    name: model.model,
    value: model.usage,
    color: modelColors[model.model as keyof typeof modelColors] || '#6B7280'
  }));

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      case 'achievement': return <Star className="w-4 h-4" />;
      case 'recommendation': return <Zap className="w-4 h-4" />;
      case 'anomaly': return <Eye className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'text-blue-500 bg-blue-50';
      case 'achievement': return 'text-green-500 bg-green-50';
      case 'recommendation': return 'text-purple-500 bg-purple-50';
      case 'anomaly': return 'text-orange-500 bg-orange-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <AnimatedGradientText className="text-3xl font-bold">
              <BarChart3 className="w-8 h-8 mr-3" />
              AI Analytics Dashboard
            </AnimatedGradientText>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={cn("gap-2", subscriptionConfig[subscriptionTier].color)}>
                {React.createElement(subscriptionConfig[subscriptionTier].icon, { className: "w-4 h-4" })}
                {subscriptionConfig[subscriptionTier].name} Plan
              </Badge>
              <ShimmerButton
                onClick={() => setShowSettings(!showSettings)}
                className="h-9 px-3 text-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </ShimmerButton>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <ShimmerButton
                onClick={fetchDashboardData}
                className="h-9 px-3 text-sm"
                disabled={loading}
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", { 'animate-spin': loading })} />
                Refresh
              </ShimmerButton>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                Auto-refresh
              </label>
              <RainbowButton size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </RainbowButton>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Dashboard Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chart Type</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                      <option>Area Chart</option>
                      <option>Line Chart</option>
                      <option>Bar Chart</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Refresh Interval</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                      <option value="30">30 seconds</option>
                      <option value="60">1 minute</option>
                      <option value="300">5 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Data Granularity</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                      <option>Hourly</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                    </select>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-1">
                <NumberTicker value={totalRequests} />
              </h3>
              <p className="text-sm text-slate-600">Total Requests</p>
              <div className="mt-3 text-xs text-green-600">+12% from last week</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-1">
                <NumberTicker value={totalTokens} />
              </h3>
              <p className="text-sm text-slate-600">Total Tokens</p>
              <div className="mt-3 text-xs text-green-600">+8% from last week</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-1">
                ${totalCost.toFixed(3)}
              </h3>
              <p className="text-sm text-slate-600">Total Cost</p>
              <div className="mt-3 text-xs text-green-600">Efficient usage</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-xs text-slate-500">Satisfaction</div>
              </div>
              <h3 className="text-2xl font-bold mb-1">
                {avgSatisfaction.toFixed(1)}
              </h3>
              <p className="text-sm text-slate-600">Avg Rating</p>
              <div className="mt-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn("w-3 h-3", {
                        'text-yellow-400 fill-yellow-400': star <= avgSatisfaction,
                        'text-slate-300': star > avgSatisfaction
                      })}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Usage Trend Chart */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Usage Trends</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Daily</Badge>
                  <Filter className="w-4 h-4 text-slate-500" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={usageData}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorRequests)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Model Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Model Performance</h3>
                <Badge variant="outline" className="text-xs">Accuracy %</Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="model" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="accuracy" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Model Usage Distribution and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Usage Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Model Usage Distribution</h3>
                <Badge variant="outline" className="text-xs">By Usage %</Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">AI Insights</h3>
                <Badge variant="outline" className="text-xs">{insights.length} New</Badge>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("p-2 rounded-lg", getInsightColor(insight.type))}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{insight.title}</h4>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", {
                                'border-red-500 text-red-500': insight.impact === 'high',
                                'border-yellow-500 text-yellow-500': insight.impact === 'medium',
                                'border-green-500 text-green-500': insight.impact === 'low'
                              })}
                            >
                              {insight.impact}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                          <div className="text-xs text-slate-500">
                            {new Date(insight.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}