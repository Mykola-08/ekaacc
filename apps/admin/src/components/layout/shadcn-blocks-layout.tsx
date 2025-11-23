import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Settings,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:opacity-80">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className="flex items-center gap-2 text-xs">
          {trend === 'up' ? (
            <ArrowUpRight className="h-3 w-3 text-green-500" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500" />
          )}
          <span className={trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {change}
          </span>
          <span className="text-muted-foreground">from last month</span>
        </div>
        <Progress value={75} className="mt-3 h-2" />
      </CardContent>
    </Card>
  );
}

interface ActivityItemProps {
  user: string;
  action: string;
  time: string;
  avatar?: string;
}

function ActivityItem({ user, action, time, avatar }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} />
        <AvatarFallback>{user.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{user}</p>
        <p className="text-sm text-muted-foreground">{action}</p>
      </div>
      <Badge variant="outline" className="text-xs">{time}</Badge>
    </div>
  );
}

export default function ShadcnBlocksLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="default">
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </Button>
            <Button size="default" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value="$45,231"
            change="+20.1%"
            trend="up"
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatsCard
            title="Active Users"
            value="2,350"
            change="+15.3%"
            trend="up"
            icon={<Users className="h-5 w-5" />}
          />
          <StatsCard
            title="Conversion Rate"
            value="3.24%"
            change="-4.5%"
            trend="down"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatsCard
            title="Avg. Order Value"
            value="$89.50"
            change="+8.2%"
            trend="up"
            icon={<Activity className="h-5 w-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
                    <CardDescription>Your latest business activities</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <ActivityItem
                    user="Sarah Johnson"
                    action="Completed a purchase of $125.00"
                    time="2 min ago"
                  />
                  <Separator />
                  <ActivityItem
                    user="Mike Chen"
                    action="Updated profile information"
                    time="15 min ago"
                  />
                  <Separator />
                  <ActivityItem
                    user="Emma Wilson"
                    action="Subscribed to premium plan"
                    time="1 hour ago"
                  />
                  <Separator />
                  <ActivityItem
                    user="David Brown"
                    action="Left a 5-star review"
                    time="3 hours ago"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Performance Overview</CardTitle>
                <CardDescription>Your business metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Chart visualization would go here</p>
                    <p className="text-sm text-muted-foreground/70">Integration with recharts or similar library</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Newsletter
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Contact Information</CardTitle>
                <CardDescription>Get in touch with support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">support@example.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">123 Business St, City, State 12345</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}