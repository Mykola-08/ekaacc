import {
 Card,
 CardContent,
 CardDescription,
 CardHeader,
 CardTitle,
} from '@/components/ui/card';
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
 ArrowDownRight,
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
 <Card className="bg-card/60 group border-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-sm">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
 <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
 <div className="rounded-full bg-linear-to-br from-muted to-muted p-2 text-primary transition-all duration-300 group-hover:opacity-80">
 {icon}
 </div>
 </CardHeader>
 <CardContent>
 <div className="mb-2 text-3xl font-semibold">{value}</div>
 <div className="flex items-center gap-2 text-xs">
 {trend === 'up' ? (
 <ArrowUpRight className="h-3 w-3 text-success" />
 ) : (
 <ArrowDownRight className="h-3 w-3 text-destructive" />
 )}
 <span
 className={
 trend === 'up'
 ? 'text-success '
 : 'text-destructive '
 }
 >
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
 <div className="hover:bg-muted/40 flex items-center gap-4 rounded-lg p-3 transition-colors duration-200">
 <Avatar className="h-10 w-10">
 <AvatarImage src={avatar} />
 <AvatarFallback>{user.charAt(0).toUpperCase()}</AvatarFallback>
 </Avatar>
 <div className="flex-1 space-y-1">
 <p className="text-sm leading-none font-medium">{user}</p>
 <p className="text-muted-foreground text-sm">{action}</p>
 </div>
 <Badge variant="outline" className="text-xs">
 {time}
 </Badge>
 </div>
 );
}

export default function ShadcnBlocksLayout() {
 return (
 <div className="min-h-screen bg-linear-to-br from-background to-muted p-6">
 <div className="mx-auto max-w-7xl space-y-8">
 {/* Header Section */}
 <div className="flex items-center justify-between">
 <div className="space-y-2">
 <h1 className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-4xl font-semibold text-transparent">
 Dashboard Overview
 </h1>
 <p className="text-muted-foreground text-lg">
 Welcome back! Here's what's happening with your business today.
 </p>
 </div>
 <div className="flex items-center gap-3">
 <Button variant="outline" size="default">
 <Calendar className="mr-2 h-4 w-4" />
 Today
 </Button>
 <Button
 size="default"
 className="bg-linear-to-r from-primary to-primary/70 text-primary-foreground shadow-sm transition-all duration-300 hover:from-primary/90 hover:to-primary/60 hover:shadow-sm"
 >
 <Settings className="mr-2 h-4 w-4" />
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
 <div className="space-y-6 lg:col-span-2">
 {/* Recent Activity */}
 <Card className="bg-card/60 border-0 shadow-sm backdrop-blur-sm">
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
 <Card className="bg-card/60 border-0 shadow-sm backdrop-blur-sm">
 <CardHeader>
 <CardTitle className="text-xl font-semibold">Performance Overview</CardTitle>
 <CardDescription>Your business metrics over time</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="flex h-64 items-center justify-center rounded-lg bg-linear-to-br from-primary/5 to-muted">
 <div className="text-center">
 <Activity className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
 <p className="text-muted-foreground">Chart visualization would go here</p>
 <p className="text-muted-foreground/70 text-sm">
 Integration with recharts or similar library
 </p>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>

 {/* Right Column - Sidebar */}
 <div className="space-y-6">
 {/* Quick Actions */}
 <Card className="bg-card/60 border-0 shadow-sm backdrop-blur-sm">
 <CardHeader>
 <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
 <CardDescription>Common tasks and shortcuts</CardDescription>
 </CardHeader>
 <CardContent className="space-y-3">
 <Button variant="outline" className="w-full justify-start">
 <Mail className="mr-2 h-4 w-4" />
 Send Newsletter
 </Button>
 <Button variant="outline" className="w-full justify-start">
 <Users className="mr-2 h-4 w-4" />
 Manage Users
 </Button>
 <Button variant="outline" className="w-full justify-start">
 <DollarSign className="mr-2 h-4 w-4" />
 View Reports
 </Button>
 <Button variant="outline" className="w-full justify-start">
 <Settings className="mr-2 h-4 w-4" />
 System Settings
 </Button>
 </CardContent>
 </Card>

 {/* Contact Info */}
 <Card className="bg-card/60 border-0 shadow-sm backdrop-blur-sm">
 <CardHeader>
 <CardTitle className="text-xl font-semibold">Contact Information</CardTitle>
 <CardDescription>Get in touch with support</CardDescription>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="flex items-center gap-3">
 <Mail className="text-muted-foreground h-4 w-4" />
 <div>
 <p className="text-sm font-medium">Email</p>
 <p className="text-muted-foreground text-sm">support@example.com</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <Phone className="text-muted-foreground h-4 w-4" />
 <div>
 <p className="text-sm font-medium">Phone</p>
 <p className="text-muted-foreground text-sm">+1 (555) 123-4567</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <MapPin className="text-muted-foreground h-4 w-4" />
 <div>
 <p className="text-sm font-medium">Address</p>
 <p className="text-muted-foreground text-sm">
 123 Business St, City, State 12345
 </p>
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
