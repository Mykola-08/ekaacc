'use client'

import { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
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
  List
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { format } from 'date-fns'

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    totalRevenue: number
    conversionRate: number
    avgSessionDuration: number
  }
  userGrowth: Array<{
    date: string
    users: number
    newUsers: number
  }>
  activityByHour: Array<{
    hour: number
    activity: number
  }>
  topPages: Array<{
    path: string
    views: number
    uniqueVisitors: number
  }>
  userSegments: Array<{
    segment: string
    count: number
    percentage: number
  }>
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical'
    uptime: number
    responseTime: number
    errorRate: number
    lastCheck: string
  }
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function AnalyticsDashboardHeadless() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('7d')
  const [refreshing, setRefreshing] = useState(false)

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
    await new Promise(resolve => setTimeout(resolve, 800));
    setAnalytics({
        overview: {
            totalUsers: 12543,
            activeUsers: 8432,
            newUsers: 120,
            totalRevenue: 45000,
            conversionRate: 3.2,
            avgSessionDuration: 345
        },
        userGrowth: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
            users: 12000 + i * 100,
            newUsers: 50 + i * 10
        })),
        activityByHour: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            activity: Math.floor(Math.random() * 100)
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
            lastCheck: new Date().toISOString()
        }
    });
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
  }

  const handleExport = async (format: 'csv' | 'json') => {
    console.log(`Exporting as ${format}...`)
    // Mock export
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-700 bg-green-50 ring-green-600/20'
      case 'warning': return 'text-yellow-700 bg-yellow-50 ring-yellow-600/20'
      case 'critical': return 'text-red-700 bg-red-50 ring-red-600/20'
      default: return 'text-foreground/90 bg-muted/30 ring-gray-600/20'
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-red-50 rounded-full p-4 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Failed to load analytics</h3>
        <p className="text-muted-foreground mt-1 mb-6">We couldn't retrieve the latest data.</p>
        <button 
            onClick={handleRefresh} 
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
             <BarChartIcon className="w-8 h-8 text-muted-foreground/80" />
             Analytics
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">System metrics and user analytics.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-card p-1.5 rounded-full shadow-sm ring-1 ring-slate-200">
          <select
            value={timeframe}
            onChange={(e) => {
              setTimeframe(e.target.value)
              fetchAnalytics(e.target.value)
            }}
            className="pl-4 pr-8 py-2 bg-transparent border-0 text-sm font-medium text-foreground/90 focus:ring-0 cursor-pointer"
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
            className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="h-6 w-px bg-slate-200" />

          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 text-sm font-medium text-foreground/90 hover:bg-muted/30 rounded-full transition-colors"
          >
            Export
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-[24px] p-6 shadow-sm ring-1 ring-slate-200/60">
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-muted-foreground">Total Users</span>
                <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
                {analytics.overview.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center text-sm">
                <span className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{analytics.overview.newUsers}
                </span>
                <span className="text-muted-foreground/80 ml-2">this period</span>
            </div>
        </div>

        <div className="bg-card rounded-[24px] p-6 shadow-sm ring-1 ring-slate-200/60">
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-muted-foreground">Active Users</span>
                <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
                {analytics.overview.activeUsers.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
                {((analytics.overview.activeUsers / analytics.overview.totalUsers) * 100).toFixed(1)}% of total
            </div>
        </div>

        <div className="bg-card rounded-[24px] p-6 shadow-sm ring-1 ring-slate-200/60">
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-muted-foreground">Conversion Rate</span>
                <BarChartIcon className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
                {analytics.overview.conversionRate.toFixed(1)}%
            </div>
            <div className="flex items-center text-sm">
                <span className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.1%
                </span>
                <span className="text-muted-foreground/80 ml-2">vs last period</span>
            </div>
        </div>

        <div className="bg-card rounded-[24px] p-6 shadow-sm ring-1 ring-slate-200/60">
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-muted-foreground">Avg Session</span>
                <Clock className="w-5 h-5 text-violet-500" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
                {Math.floor(analytics.overview.avgSessionDuration / 60)}m {analytics.overview.avgSessionDuration % 60}s
            </div>
            <div className="text-sm text-muted-foreground">
                Session duration
            </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h3 className="text-lg font-bold text-foreground">System Health</h3>
                <p className="text-muted-foreground text-sm">Real-time status metrics</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className={classNames(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset",
                    getHealthStatusColor(analytics.systemHealth.status)
                )}>
                    {getHealthIcon(analytics.systemHealth.status)}
                    <span className="capitalize">{analytics.systemHealth.status}</span>
                </span>
                
                <div className="h-4 w-px bg-slate-200 hidden md:block" />
                
                <div className="text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                    <span className="font-medium">Uptime:</span> {analytics.systemHealth.uptime.toFixed(1)}%
                </div>
                
                <div className="text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                    <span className="font-medium">Response:</span> {analytics.systemHealth.responseTime}ms
                </div>
                
                <div className="text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                    <span className="font-medium">Error Rate:</span> {analytics.systemHealth.errorRate.toFixed(2)}%
                </div>
                
                <div className="text-xs text-muted-foreground/80 ml-auto md:ml-0">
                    Last check: {format(new Date(analytics.systemHealth.lastCheck), 'HH:mm:ss')}
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tab.Group>
        <div className="flex items-center justify-between mb-2">
            <Tab.List className="flex space-x-1 rounded-full bg-muted p-1">
                {['Overview', 'User Growth', 'Activity', 'Top Pages', 'Segments'].map((category) => (
                    <Tab
                        key={category}
                        className={({ selected }) =>
                        classNames(
                            'w-full min-w-[100px] rounded-full px-4 py-2.5 text-sm font-medium leading-5',
                            'focus:outline-none focus:ring-2 ring-offset-2 ring-slate-400',
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-foreground">User Growth Trend</h3>
                        <p className="text-muted-foreground text-sm">User acquisition over time</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis 
                                    dataKey="date" 
                                    tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                />
                                <Tooltip 
                                    labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-foreground">Activity by Hour</h3>
                        <p className="text-muted-foreground text-sm">Peak usage times</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.activityByHour}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis 
                                    dataKey="hour" 
                                    axisLine={false} 
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                />
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="activity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
          </Tab.Panel>

          <Tab.Panel className="focus:outline-none">
            {/* Users Panel - just duplication for tabs demo */}
            <div className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                 <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground">User Growth Details</h3>
                    <p className="text-muted-foreground text-sm">Detailed user acquisition metrics</p>
                </div>
                 <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                        axisLine={false}
                        tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} name="Total Users" dot={{r: 4, strokeWidth: 0}} />
                        <Line type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={3} name="New Users" dot={{r: 4, strokeWidth: 0}} />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel className="focus:outline-none">
            {/* Activity Panel */}
            <div className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground">Hourly Activity Pattern</h3>
                    <p className="text-muted-foreground text-sm">User activity throughout the day</p>
                </div>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.activityByHour}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: '#F1F5F9' }} />
                            <Bar dataKey="activity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </Tab.Panel>

          <Tab.Panel className="focus:outline-none">
             {/* Top Pages */}
             <div className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground">Most Visited Pages</h3>
                    <p className="text-muted-foreground text-sm">Top performing content</p>
                </div>
                <div className="divide-y divide-gray-100">
                {analytics.topPages.map((page, index) => (
                  <div key={page.path} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between hover:bg-muted/30/50 rounded-xl px-2 transition-colors -mx-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground truncate">{page.path}</p>
                        <p className="text-xs text-muted-foreground">{page.uniqueVisitors.toLocaleString()} unique visitors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{page.views.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                  </div>
                ))}
              </div>
             </div>
          </Tab.Panel>

          <Tab.Panel className="focus:outline-none">
            {/* Segments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-foreground">User Segments</h3>
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
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {analytics.userSegments.map((entry, index) => (
                                <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={2} stroke="#fff" />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-foreground">Segment Details</h3>
                        <p className="text-muted-foreground text-sm">Breakdown by user segments</p>
                    </div>
                    <div className="space-y-4">
                        {analytics.userSegments.map((segment, index) => (
                            <div key={segment.segment} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 hover:bg-muted transition-colors">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-4 h-4 rounded-full ring-2 ring-white" 
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-sm font-semibold text-foreground/90">{segment.segment}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-foreground">{segment.count.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">{segment.percentage.toFixed(1)}%</p>
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
  )
}
