'use client';

import React, { useState } from 'react';
import { DynamicSidebar } from '@/components/navigation/dynamic-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  Users, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { getSecurityMetrics, getSecurityAlerts } from '@/lib/security-monitoring';
import { invalidateUserPermissionCache } from '@/lib/permission-service';
import { useAuth } from '@/context/auth-context';

export default function NavigationSystemDemo() {
  const { user } = useAuth();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMetrics, setShowMetrics] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshPermissions = async () => {
    if (!user?.id) return;
    
    setIsRefreshing(true);
    try {
      invalidateUserPermissionCache(user.id);
      // Force re-render by toggling sidebar
      setShowSidebar(false);
      setTimeout(() => setShowSidebar(true), 100);
    } catch (error) {
      console.error('Failed to refresh permissions:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const metrics = user ? getSecurityMetrics() : null;
  const alerts = user ? getSecurityAlerts({ acknowledged: false, limit: 5 }) : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Dynamic Sidebar */}
        <DynamicSidebar
          isCollapsed={!showSidebar}
          onCollapseChange={setShowSidebar}
          showRoleIndicator={true}
          showSecurityAlerts={true}
          enableRealTimeUpdates={true}
          className="border-r"
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Dynamic Navigation System</h1>
                <p className="text-muted-foreground">
                  Role-based access control with real-time permission updates
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshPermissions}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                  Refresh Permissions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMetrics(!showMetrics)}
                >
                  {showMetrics ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showMetrics ? 'Hide' : 'Show'} Metrics
                </Button>
              </div>
            </div>
          </header>

          {/* Demo Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* User Info Card */}
              {user && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Current User Information</span>
                    </CardTitle>
                    <CardDescription>
                      Your current role and permission status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">User ID</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {user.id}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Role</p>
                        <Badge variant="secondary" className="text-sm">
                          {user.role}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Status</p>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Active</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Security Metrics */}
              {showMetrics && metrics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Security Metrics</span>
                    </CardTitle>
                    <CardDescription>
                      Real-time security monitoring data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetricCard
                        title="Total Events"
                        value={metrics.totalEvents}
                        icon={Activity}
                        color="text-blue-600"
                      />
                      <MetricCard
                        title="Active Alerts"
                        value={metrics.activeAlerts}
                        icon={AlertTriangle}
                        color="text-red-600"
                      />
                      <MetricCard
                        title="Acknowledged"
                        value={metrics.acknowledgedAlerts}
                        icon={CheckCircle}
                        color="text-green-600"
                      />
                      <MetricCard
                        title="Auto-Resolved"
                        value={metrics.autoResolvedAlerts}
                        icon={RefreshCw}
                        color="text-purple-600"
                      />
                    </div>

                    {/* Event Breakdown */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Events by Type</h4>
                      <div className="space-y-2">
                        {Object.entries(metrics.eventsByType).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground capitalize">
                              {type.replace(/_/g, ' ')}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Alerts */}
              {alerts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Recent Security Alerts</span>
                    </CardTitle>
                    <CardDescription>
                      Unacknowledged security alerts requiring attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {alerts.map(alert => (
                        <AlertCard key={alert.id} alert={alert} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Feature Showcase */}
              <Tabs defaultValue="features" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="space-y-4">
                  <FeatureShowcase />
                </TabsContent>
                
                <TabsContent value="permissions" className="space-y-4">
                  <PermissionMatrix />
                </TabsContent>
                
                <TabsContent value="security" className="space-y-4">
                  <SecurityFeatures />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className={cn("h-8 w-8", color)} />
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: any }) {
  const severityColors = {
    low: 'border-blue-200 bg-blue-50',
    medium: 'border-yellow-200 bg-yellow-50',
    high: 'border-orange-200 bg-orange-50',
    critical: 'border-red-200 bg-red-50'
  };

  return (
    <div className={cn("p-3 rounded-lg border", severityColors[alert.severity as keyof typeof severityColors])}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">{alert.title}</p>
          <p className="text-xs text-muted-foreground">{alert.description}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(alert.timestamp).toLocaleString()}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {alert.severity}
        </Badge>
      </div>
    </div>
  );
}

function FeatureShowcase() {
  const features = [
    {
      title: "Real-time Permission Updates",
      description: "Navigation automatically updates when user roles or permissions change",
      icon: RefreshCw,
      status: "Active"
    },
    {
      title: "Role-Based Filtering",
      description: "Dynamic sidebar shows only accessible pages based on user role",
      icon: Users,
      status: "Active"
    },
    {
      title: "Security Monitoring",
      description: "Real-time monitoring of unauthorized access attempts and security events",
      icon: Shield,
      status: "Active"
    },
    {
      title: "Performance Optimization",
      description: "Client-side caching for fast navigation updates",
      icon: Activity,
      status: "Active"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((feature, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <feature.icon className="h-5 w-5" />
              <span>{feature.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {feature.description}
            </p>
            <Badge variant="outline" className="text-xs">
              {feature.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PermissionMatrix() {
  const roles = ['Admin', 'Therapist', 'Patient', 'VIP Patient', 'Reception', 'Content Manager', 'Marketing', 'Accountant'];
  const sampleRoutes = ['/home', '/dashboard', '/admin', '/journal', '/appointments', '/therapist/dashboard', '/reports'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Matrix</CardTitle>
        <CardDescription>
          Sample of route access permissions by role
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Route</th>
                {roles.map(role => (
                  <th key={role} className="text-center p-2 text-xs">
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleRoutes.map(route => (
                <tr key={route} className="border-b">
                  <td className="p-2 font-mono text-xs">{route}</td>
                  {roles.map(role => (
                    <td key={`${route}-${role}`} className="text-center p-2">
                      <PermissionIndicator route={route} role={role} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function PermissionIndicator({ route, role }: { route: string; role: string }) {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      // Simulate permission check
      setTimeout(() => {
        setHasAccess(Math.random() > 0.5);
      }, 100);
    }
  }, [user, route, role]);

  if (hasAccess === null) {
    return <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />;
  }

  return hasAccess ? (
    <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
  ) : (
    <XCircle className="h-4 w-4 text-red-500 mx-auto" />
  );
}

function SecurityFeatures() {
  const features = [
    {
      title: "Unauthorized Access Detection",
      description: "Automatically detects and logs unauthorized access attempts",
      status: "Active",
      severity: "high"
    },
    {
      title: "Permission Audit Trail",
      description: "Comprehensive logging of all permission checks and access attempts",
      status: "Active",
      severity: "medium"
    },
    {
      title: "Real-time Security Alerts",
      description: "Immediate notifications for suspicious activities and security events",
      status: "Active",
      severity: "high"
    },
    {
      title: "Rate Limiting Protection",
      description: "Prevents abuse through rate limiting on permission checks",
      status: "Active",
      severity: "medium"
    }
  ];

  return (
    <div className="space-y-4">
      {features.map((feature, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{feature.title}</span>
              <Badge 
                variant={feature.severity === 'high' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {feature.severity}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {feature.description}
            </p>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">{feature.status}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}