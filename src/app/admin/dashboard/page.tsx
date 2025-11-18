'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Activity, 
  Settings, 
  Shield,
  BarChart3,
  FileText,
  Bell,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  CheckCircle
} from 'lucide-react'
import { EnhancedUserManagement } from '@/components/admin/enhanced-user-management'
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard'
import { AuditLogViewer } from '@/components/admin/audit-log-viewer'
import { SystemConfiguration } from '@/components/admin/system-configuration'
import { UserImpersonationDialog } from '@/components/admin/user-impersonation'
import { AdminNotificationSystem } from '@/components/admin/admin-notification-system'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const { user, isImpersonating, startImpersonation, endImpersonation } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [showImpersonationDialog, setShowImpersonationDialog] = useState(false)

  // Check if user has admin access
  if (!user || user.role.name !== 'admin') {
    router.push('/login')
    return null
  }

  const handleImpersonate = async (targetUserId: string, reason: string) => {
    try {
      await startImpersonation(targetUserId, reason)
      setShowImpersonationDialog(false)
      // Redirect to home page to see the interface as the impersonated user
      router.push('/')
    } catch (error) {
      console.error('Failed to start impersonation:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/10 to-blue-50/10">
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-b border-yellow-200 px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-700" />
              <span className="text-yellow-700 font-medium">
                You are currently impersonating a user. Some features may be limited.
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => endImpersonation()}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-200"
            >
              End Impersonation
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage users, monitor system performance, and configure settings</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowImpersonationDialog(true)}
                className="flex items-center gap-2 border-purple-200 hover:bg-purple-50"
              >
                <UserCheck className="h-4 w-4" />
                Impersonate User
              </Button>
              <Badge variant="outline" className="text-sm bg-purple-100 text-purple-700 border-purple-200">
                Admin Access
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-white/50 backdrop-blur-sm border-purple-100">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
            <MessageSquare className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">89</div>
                  <p className="text-xs text-muted-foreground">Currently online</p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-sm border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Healthy</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('users')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('security')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    View Security Logs
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('analytics')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">User login successful</p>
                          <p className="text-xs text-gray-500">john@example.com - 2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">New user registered</p>
                          <p className="text-xs text-gray-500">jane@example.com - 5 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Configuration updated</p>
                          <p className="text-xs text-gray-500">System settings - 10 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <EnhancedUserManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <AuditLogViewer />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SystemConfiguration />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <AdminNotificationSystem />
          </TabsContent>
        </Tabs>
      </div>

      {/* Impersonation Dialog */}
      <UserImpersonationDialog
        open={showImpersonationDialog}
        onOpenChange={setShowImpersonationDialog}
        onImpersonate={handleImpersonate}
      />
    </div>
  )
}