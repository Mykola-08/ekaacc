'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { HugeiconsIcon } from '@hugeicons/react';
import { Activity01Icon, Alert01Icon, AnalyticsUpIcon, BarChartIcon, Clock01Icon, Refresh01Icon, UserIcon } from '@hugeicons/core-free-icons'; Cell,
} from 'recharts';
import { format } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { Activity01Icon, Alert01Icon, AnalyticsUpIcon, BarChartIcon, Clock01Icon, Refresh01Icon, UserIcon } from '@hugeicons/core-free-icons';

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
  'var(--primary)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--destructive)',
  'var(--chart-5)',
  'var(--chart-1)',
];

export function AnalyticsDashboardHeadless() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch analytics from the real API endpoint
  const fetchAnalytics = async (selectedTimeframe: string = timeframe) => {
    try {
      const response = await fetch(`/api/admin/analytics?timeframe=${selectedTimeframe}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const json = await response.json();
      const d = json.data || {};

      const totalUsers = d.users?.total || 0;
      const activeUsers = d.users?.active || 0;
      const newUsers = d.users?.new || 0;
      const totalRevenue = d.revenue?.total || 0;
      const conversionRate = d.revenue?.successRate || 0;
      const avgSessionDuration = d.sessions?.averageDuration || 0;

      // Build a simple time-series for the growth chart
      const days = selectedTimeframe === '24h' ? 1 : selectedTimeframe === '30d' ? 30 : selectedTimeframe === '90d' ? 90 : 7;
      const userGrowth = Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - 1 - i) * 86400000).toISOString(),
        users: Math.max(0, totalUsers - (days - 1 - i) * Math.ceil(newUsers / Math.max(days, 1))),
        newUsers: Math.round(newUsers / Math.max(days, 1)),
      }));

      // Approximate hourly activity from session total
      const sessionsTotal = d.sessions?.total || 0;
      const activityByHour = Array.from({ length: 24 }, (_, i) => {
        const weight = Math.sin(((i - 6) / 24) * Math.PI * 2) * 0.5 + 0.5;
        return { hour: i, activity: Math.round((sessionsTotal / 24) * weight * 2) };
      });

      // User segments from byStatus
      const byStatus = d.users?.byStatus || {};
      const statusTotal = (byStatus.active || 0) + (byStatus.suspended || 0) + (byStatus.pending || 0) || 1;
      const userSegments = [
        { segment: 'Active', count: byStatus.active || 0, percentage: ((byStatus.active || 0) / statusTotal) * 100 },
        { segment: 'Suspended', count: byStatus.suspended || 0, percentage: ((byStatus.suspended || 0) / statusTotal) * 100 },
        { segment: 'Pending', count: byStatus.pending || 0, percentage: ((byStatus.pending || 0) / statusTotal) * 100 },
      ].filter((s) => s.count > 0);

      const errorRate = d.system?.errorRate || 0;

      setAnalytics({
        overview: { totalUsers, activeUsers, newUsers, totalRevenue, conversionRate, avgSessionDuration },
        userGrowth,
        activityByHour,
        topPages: [
          { path: '/dashboard', views: sessionsTotal, uniqueVisitors: activeUsers },
          { path: '/bookings', views: d.sessions?.completed || 0, uniqueVisitors: Math.round(activeUsers * 0.4) },
          { path: '/settings', views: Math.round(activeUsers * 0.3), uniqueVisitors: Math.round(activeUsers * 0.2) },
        ],
        userSegments: userSegments.length > 0 ? userSegments : [{ segment: 'All Users', count: totalUsers, percentage: 100 }],
        systemHealth: {
          status: errorRate > 5 ? 'critical' : errorRate > 1 ? 'warning' : 'healthy',
          uptime: 100 - errorRate,
          responseTime: d.performance?.averageResponseTime || 0,
          errorRate,
          lastCheck: json.generatedAt || new Date().toISOString(),
        },
      });
    } catch {
      // If API fails, show empty state
      setAnalytics(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
        <div className="bg-destructive/10 mb-4 rounded-full p-4">
          <HugeiconsIcon icon={Alert01Icon} className="text-destructive size-8"  />
        </div>
        <h3 className="text-foreground text-lg font-semibold">Failed to load analytics</h3>
        <p className="text-muted-foreground mt-1 mb-6">We couldn't retrieve the latest data.</p>
        <Button onClick={handleRefresh}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-4xl font-semibold tracking-tight">
            <HugeiconsIcon icon={BarChartIcon} className="text-muted-foreground/80 h-8 w-8" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">System metrics and user analytics.</p>
        </div>

        <div className="bg-card ring-border flex items-center gap-3 rounded-full p-1.5 ring-1">
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

          <div className="bg-border h-6 w-px" />

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-muted-foreground hover:text-foreground p-2 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <HugeiconsIcon icon={Refresh01Icon} className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}  />
          </button>

          <div className="bg-border h-6 w-px" />

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
        <div className="bg-card ring-border rounded-lg p-6 ring-1">
          <div className="mb-4 flex items-start justify-between">
            <span className="text-muted-foreground text-sm font-medium">Total UserMultipleIcon</span>
            <HugeiconsIcon icon={UserIcon} className="text-primary size-5"  />
          </div>
          <div className="text-foreground mb-2 text-3xl font-semibold">
            {analytics.overview.totalUsers.toLocaleString()}
          </div>
          <div className="flex items-center text-sm">
            <span className="bg-success text-success flex items-center rounded-full px-2 py-0.5 font-medium">
              <HugeiconsIcon icon={AnalyticsUpIcon} className="mr-1 size-3"  />+{analytics.overview.newUsers}
            </span>
            <span className="text-muted-foreground/80 ml-2">this period</span>
          </div>
        </div>

        <div className="bg-card ring-border rounded-lg p-6 ring-1">
          <div className="mb-4 flex items-start justify-between">
            <span className="text-muted-foreground text-sm font-medium">Active Users</span>
            <HugeiconsIcon icon={Activity01Icon} className="text-success h-5 w-5" />
          </div>
          <div className="text-foreground mb-2 text-3xl font-semibold">
            {analytics.overview.activeUsers.toLocaleString()}
          </div>
          <div className="text-muted-foreground text-sm">
            {((analytics.overview.activeUsers / analytics.overview.totalUsers) * 100).toFixed(1)}%
            of total
          </div>
        </div>

        <div className="bg-card ring-border rounded-lg p-6 ring-1">
          <div className="mb-4 flex items-start justify-between">
            <span className="text-muted-foreground text-sm font-medium">Conversion Rate</span>
            <HugeiconsIcon icon={BarChartIcon} className="text-warning h-5 w-5" />
          </div>
          <div className="text-foreground mb-2 text-3xl font-semibold">
            {analytics.overview.conversionRate.toFixed(1)}%
          </div>
          <div className="flex items-center text-sm">
            <span className="bg-success text-success flex items-center rounded-full px-2 py-0.5 font-medium">
              <HugeiconsIcon icon={AnalyticsUpIcon} className="mr-1 size-3"  />
              +2.1%
            </span>
            <span className="text-muted-foreground/80 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-card ring-border rounded-lg p-6 ring-1">
          <div className="mb-4 flex items-start justify-between">
            <span className="text-muted-foreground text-sm font-medium">Avg Session</span>
            <HugeiconsIcon icon={Clock01Icon} className="text-chart-4 size-5"  />
          </div>
          <div className="text-foreground mb-2 text-3xl font-semibold">
            {Math.floor(analytics.overview.avgSessionDuration / 60)}m{' '}
            {analytics.overview.avgSessionDuration % 60}s
          </div>
          <div className="text-muted-foreground text-sm">Session duration</div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-card ring-border rounded-lg p-8 ring-1">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-foreground text-lg font-semibold">System Health</h3>
            <p className="text-muted-foreground text-sm">Real-time status metrics</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <StatusBadge status={analytics.systemHealth.status} />

            <div className="bg-border hidden h-4 w-px md:block" />

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
          <Tab.List className="bg-muted flex rounded-full p-1">
            {['Overview', 'User Growth', 'Activity', 'Top Pages', 'Segments'].map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full min-w-25 rounded-full px-4 py-2.5 text-sm leading-5 font-medium',
                    'ring-border ring-offset-2 focus:ring-2 focus:outline-none',
                    selected
                      ? 'bg-card text-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground/90 hover:bg-card/12'
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
        </div>

        <Tab.Panels className="mt-6">
          <Tab.Panel className="focus:outline-none">
            {/* Overview Panel Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-card ring-border rounded-lg p-8 ring-1">
                <div className="mb-6">
                  <h3 className="text-foreground text-lg font-semibold">User Growth Trend</h3>
                  <p className="text-muted-foreground text-sm">User acquisition over time</p>
                </div>
                <div className="h-75 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.userGrowth}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                      />
                      <Tooltip
                        labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                        contentStyle={{
                          borderRadius: 'var(--radius)',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px var(--border)',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="newUsers"
                        stroke="var(--chart-2)"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card ring-border rounded-lg p-8 ring-1">
                <div className="mb-6">
                  <h3 className="text-foreground text-lg font-semibold">Activity by Hour</h3>
                  <p className="text-muted-foreground text-sm">Peak usage times</p>
                </div>
                <div className="h-75 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.activityByHour}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="hour"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{
                          borderRadius: 'var(--radius)',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px var(--border)',
                        }}
                      />
                      <Bar dataKey="activity" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel className="focus:outline-none">
            {/* Users Panel - just duplication for tabs demo */}
            <div className="bg-card ring-border rounded-lg p-8 ring-1">
              <div className="mb-6">
                <h3 className="text-foreground text-lg font-semibold">User Growth Details</h3>
                <p className="text-muted-foreground text-sm">Detailed user acquisition metrics</p>
              </div>
              <div className="h-100 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
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
                      stroke="var(--primary)"
                      strokeWidth={3}
                      name="Total Users"
                      dot={{ r: 4, strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="newUsers"
                      stroke="var(--chart-2)"
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
            <div className="bg-card ring-border rounded-lg p-8 ring-1">
              <div className="mb-6">
                <h3 className="text-foreground text-lg font-semibold">Hourly Activity01Icon Pattern</h3>
                <p className="text-muted-foreground text-sm">User activity throughout the day</p>
              </div>
              <div className="h-100 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.activityByHour}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'var(--muted)' }} />
                    <Bar dataKey="activity" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel className="focus:outline-none">
            {/* Top Pages */}
            <div className="bg-card ring-border rounded-lg p-8 ring-1">
              <div className="mb-6">
                <h3 className="text-foreground text-lg font-semibold">Most Visited Pages</h3>
                <p className="text-muted-foreground text-sm">Top performing content</p>
              </div>
              <div className="divide-border divide-y">
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
                      <p className="text-foreground text-sm font-semibold">
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
              <div className="bg-card ring-border rounded-lg p-8 ring-1">
                <div className="mb-6">
                  <h3 className="text-foreground text-lg font-semibold">User Segments</h3>
                  <p className="text-muted-foreground text-sm">User distribution by segment</p>
                </div>
                <div className="h-75 w-full">
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
                        fill="var(--primary)"
                        dataKey="count"
                      >
                        {analytics.userSegments.map((entry, index) => (
                          <Cell
                            key={`cell-\${index}`}
                            fill={COLORS[index % COLORS.length]}
                            strokeWidth={2}
                            stroke="var(--card)"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 'var(--radius)',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px var(--border)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card ring-border rounded-lg p-8 ring-1">
                <div className="mb-6">
                  <h3 className="text-foreground text-lg font-semibold">Segment Details</h3>
                  <p className="text-muted-foreground text-sm">Breakdown by user segments</p>
                </div>
                <div className="">
                  {analytics.userSegments.map((segment, index) => (
                    <div
                      key={segment.segment}
                      className="bg-muted/30 hover:bg-muted flex items-center justify-between rounded-lg p-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="ring-background h-4 w-4 rounded-full ring-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-foreground/90 text-sm font-semibold">
                          {segment.segment}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground text-sm font-semibold">
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
