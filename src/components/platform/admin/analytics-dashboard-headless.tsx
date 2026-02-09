'use client';

import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import {
  BarChart as BarChartIcon,
  Users,
  Activity,
  TrendingUp,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  LayoutGrid,
  PieChart as PieChartIcon,
  List,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { LoadingSpinner } from '@/components/ui/loading-states';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    totalRevenue: number;
    conversionRate: number;
    avgSessionDuration: number;
  };
  userGrowth: Array<{
    date: string;
    users: number;
    newUsers: number;
  }>;
  activityByHour: Array<{
    hour: number;
    activity: number;
  }>;
  topPages: Array<{
    path: string;
    views: number;
    uniqueVisitors: number;
  }>;
  userSegments: Array<{
    segment: string;
    count: number;
    percentage: number;
  }>;
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    responseTime: number;
    errorRate: number;
    lastCheck: string;
  };
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--destructive))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-1))',
];

export function AnalyticsDashboardHeadless() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Mock fetch function (replace with actual API call)
  const fetchAnalytics = async (selectedTimeframe: string = timeframe) => {
    // Simulating API call since the original used a relative API path which might not exist in this context or I want to ensure it works for demo
    // In a real scenario, uncomment the fetch and delete the mock
    /*
    try {
      const response = await fetch(`/api/admin/analytics?timeframe=${selectedTimeframe}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const data = await response.json()
      setAnalytics(data)
    } catch (error) { ... }
    */

    // Mock data for immediate visualization
    await new Promise((resolve) => setTimeout(resolve, 800));
    setAnalytics({
      overview: {
        totalUsers: 12543,
        activeUsers: 8432,
        newUsers: 120,
        totalRevenue: 45000,
        conversionRate: 3.2,
        avgSessionDuration: 345,
      },
      userGrowth: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
        users: 12000 + i * 100,
        newUsers: 50 + i * 10,
      })),
      activityByHour: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        activity: Math.floor(Math.random() * 100),
      })),
      topPages: [
        { path: '/dashboard', views: 5000, uniqueVisitors: 2000 },
        { path: '/settings', views: 1200, uniqueVisitors: 800 },
        { path: '/profile', views: 800, uniqueVisitors: 500 },
      ],
      userSegments: [
        { segment: 'Enterprise', count: 500, percentage: 20 },
        { segment: 'Pro', count: 1500, percentage: 60 },
        { segment: 'Free', count: 500, percentage: 20 },
      ],
      systemHealth: {
        status: 'healthy',
        uptime: 99.9,
        responseTime: 120,
        errorRate: 0.05,
        lastCheck: new Date().toISOString(),
      },
    });
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
  };

  const handleExport = async (format: 'csv' | 'json') => {
    console.log(`Exporting as ${format}...`);
    // Mock export
  };



  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 rounded-full bg-red-50 p-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-foreground text-lg font-semibold">Failed to load analytics</h3>
        <p className="text-muted-foreground mt-1 mb-6">We couldn't retrieve the latest data.</p>
        <button
          onClick={handleRefresh}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2.5 font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-4xl font-bold tracking-tight">
            <BarChartIcon className="text-muted-foreground/80 h-8 w-8" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">System metrics and user analytics.</p>
        </div>

        <div className="bg-card flex items-center gap-3 rounded-full p-1.5 shadow-sm ring-1 ring-slate-200">
          <select
            value={timeframe}
            onChange={(e) => {
              setTimeframe(e.target.value);
              fetchAnalytics(e.target.value);
            }}
            className="text-foreground/90 cursor-pointer border-0 bg-transparent py-2 pr-8 pl-4 text-sm font-medium focus:ring-0"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <div className="h-6 w-px bg-slate-200" />

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-muted-foreground hover:text-foreground p-2 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <div className="h-6 w-px bg-slate-200" />

          <button
            onClick={() => handleExport('csv')}
            className="text-foreground/90 hover:bg-muted/30 rounded-full px-4 py-2 text-sm font-medium transition-colors"
          >
            Export
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-xl p-6 shadow-sm ring-1 ring-slate-200/60">
          <div className="mb-4 flex items-start justify-between">
            <span className="text-muted-foreground text-sm font-medium">Total Users</span>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-foreground mb-2 text-3xl font-bold">
            {analytics.overview.totalUsers.toLocaleString()}
          </div>
          <div className="flex items-center text-sm">
            <span className="flex items-center rounded-full bg-green-50 px-2 py-0.5 font-medium text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />+{analytics.overview.newUsers}
            </span>
            <span className="text-muted-foreground/80 ml-2">this period</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm ring-1 ring-slate-200/60">
          <div className="mb-4 flex items-start justify-between">
            <span className="text-muted-foreground text-sm font-medium">Active Users</span>
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-foreground mb-2 text-3xl font-bold">
            {analytics.overview.activeUsers.toLocaleString()}
          </div>
          <div className="text-muted-foreground text-sm">
            {((analytics.overview.activeUsers / analytics.overview.totalUsers) * 100).toFixed(1)}%
            of total
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm ring-1 ring-slate-200/60">
          <div className="mb-4 flex items-start justify-between">
            <span className="text-muted-foreground text-sm font-medium">Conversion Rate</span>
            <BarChartIcon className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-foreground mb-2 text-3xl font-bold">
            {analytics.overview.conversionRate.toFixed(1)}%
          </div>
          <div className="flex items-center text-sm">
            <span className="flex items-center rounded-full bg-green-50 px-2 py-0.5 font-medium text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +2.1%
            </span>
            <span className="text-muted-foreground/80 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm ring-1 ring-slate-200/60">
          <div className="mb-4 flex items-start justify-between">
            <span className="text-muted-foreground text-sm font-medium">Avg Session</span>
            <Clock className="h-5 w-5 text-violet-500" />
          </div>
          <div className="text-foreground mb-2 text-3xl font-bold">
            {Math.floor(analytics.overview.avgSessionDuration / 60)}m{' '}
            {analytics.overview.avgSessionDuration % 60}s
          </div>
          <div className="text-muted-foreground text-sm">Session duration</div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-card rounded-[20px] p-8 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-foreground text-lg font-bold">System Health</h3>
            <p className="text-muted-foreground text-sm">Real-time status metrics</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <StatusBadge status={analytics.systemHealth.status} />

            <div className="hidden h-4 w-px bg-slate-200 md:block" />

            <div className="text-muted-foreground bg-muted/30 rounded-full px-3 py-1">
              <span className="font-medium">Uptime:</span>{' '}
              {analytics.systemHealth.uptime.toFixed(1)}%
            </div>

            <div className="text-muted-foreground bg-muted/30 rounded-full px-3 py-1">
              <span className="font-medium">Response:</span> {analytics.systemHealth.responseTime}ms
            </div>

            <div className="text-muted-foreground bg-muted/30 rounded-full px-3 py-1">
              <span className="font-medium">Error Rate:</span>{' '}
              {analytics.systemHealth.errorRate.toFixed(2)}%
            </div>

            <div className="text-muted-foreground/80 ml-auto text-xs md:ml-0">
              Last check: {format(new Date(analytics.systemHealth.lastCheck), 'HH:mm:ss')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tab.Group>
        <div className="mb-2 flex items-center justify-between">
          <Tab.List className="bg-muted flex space-x-1 rounded-full p-1">
            {['Overview', 'User Growth', 'Activity', 'Top Pages', 'Segments'].map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full min-w-[100px] rounded-full px-4 py-2.5 text-sm leading-5 font-medium',
                    'ring-slate-400 ring-offset-2 focus:ring-2 focus:outline-none',
                    selected
                      ? 'bg-card text-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground/90 hover:bg-card/[0.12]'
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
        </div>

        <Tab.Panels className="mt-6">
          <Tab.Panel className="space-y-6 focus:outline-none">
            {/* Overview Panel Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-card rounded-[20px] p-8 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
                <div className="mb-6">
                  <h3 className="text-foreground text-lg font-bold">User Growth Trend</h3>
                  <p className="text-muted-foreground text-sm">User acquisition over time</p>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.userGrowth}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      />
                      <Tooltip
                        labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="newUsers"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card rounded-[20px] p-8 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
                <div className="mb-6">
                  <h3 className="text-foreground text-lg font-bold">Activity by Hour</h3>
                  <p className="text-muted-foreground text-sm">Peak usage times</p>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.activityByHour}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="hour"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                      <Bar dataKey="activity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel className="focus:outline-none">
            {/* Users Panel - just duplication for tabs demo */}
            <div className="bg-card rounded-[20px] p-8 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
              <div className="mb-6">
                <h3 className="text-foreground text-lg font-bold">User Growth Details</h3>
                <p className="text-muted-foreground text-sm">Detailed user acquisition metrics</p>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.userGrowth}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      name="Total Users"
                      dot={{ r: 4, strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="newUsers"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={3}
                      name="New Users"
                      dot={{ r: 4, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel className="focus:outline-none">
            {/* Activity Panel */}
            <div className="bg-card rounded-[20px] p-8 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
              <div className="mb-6">
                <h3 className="text-foreground text-lg font-bold">Hourly Activity Pattern</h3>
                <p className="text-muted-foreground text-sm">User activity throughout the day</p>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.activityByHour}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                    <Bar dataKey="activity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel className="focus:outline-none">
            {/* Top Pages */}
            <div className="bg-card rounded-[20px] p-8 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
              <div className="mb-6">
                <h3 className="text-foreground text-lg font-bold">Most Visited Pages</h3>
                <p className="text-muted-foreground text-sm">Top performing content</p>
              </div>
              <div className="divide-y divide-border">
                {analytics.topPages.map((page, index) => (
                  <div
                    key={page.path}
                    className="hover:bg-muted/30/50 -mx-2 flex items-center justify-between rounded-xl px-2 py-4 transition-colors first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <span className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm font-semibold">
                          {page.path}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {page.uniqueVisitors.toLocaleString()} unique visitors
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground text-sm font-bold">
                        {page.views.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-xs">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel className="focus:outline-none">
            {/* Segments */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-card rounded-[20px] p-8 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
                <div className="mb-6">
                  <h3 className="text-foreground text-lg font-bold">User Segments</h3>
                  <p className="text-muted-foreground text-sm">User distribution by segment</p>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.userSegments}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ payload }: any) => `\${payload.percentage.toFixed(0)}%`}
                        outerRadius={100}
                        innerRadius={60}
                        fill="hsl(var(--primary))"
                        dataKey="count"
                      >
                        {analytics.userSegments.map((entry, index) => (
                          <Cell
                            key={`cell-\${index}`}
                            fill={COLORS[index % COLORS.length]}
                            strokeWidth={2}
                            stroke="hsl(var(--card))"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card rounded-[20px] p-8 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
                <div className="mb-6">
                  <h3 className="text-foreground text-lg font-bold">Segment Details</h3>
                  <p className="text-muted-foreground text-sm">Breakdown by user segments</p>
                </div>
                <div className="space-y-4">
                  {analytics.userSegments.map((segment, index) => (
                    <div
                      key={segment.segment}
                      className="bg-muted/30 hover:bg-muted flex items-center justify-between rounded-[20px] p-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-4 w-4 rounded-full ring-2 ring-white"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-foreground/90 text-sm font-semibold">
                          {segment.segment}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground text-sm font-bold">
                          {segment.count.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {segment.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
