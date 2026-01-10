'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card'
import { Button } from '@/components/platform/ui/button'
import { Badge } from '@/components/platform/ui/badge'
import { Input } from '@/components/platform/ui/input'
import { 
  Search, 
  Filter, 
  Download,
  AlertTriangle,
  Shield,
  User,
  Calendar,
  Clock,
  Eye,
  XCircle,
  CheckCircle
} from 'lucide-react'
import { format } from 'date-fns'

interface AuditLog {
  id: string
  userId: string
  userEmail: string
  action: string
  resource: string
  details: any
  ipAddress: string
  userAgent: string
  status: 'success' | 'failed' | 'warning'
  createdAt: string
}

interface SecurityAnalysis {
  suspiciousActivities: Array<{
    type: string
    count: number
    severity: 'low' | 'medium' | 'high'
    details: string[]
  }>
  failedLogins: {
    total: number
    uniqueUsers: number
    topFailedUsers: Array<{ email: string; count: number }>
  }
  permissionChanges: number
  recentSuspiciousActivity: AuditLog[]
}

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [securityAnalysis, setSecurityAnalysis] = useState<SecurityAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState('7d')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(50)

  const fetchAuditLogs = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: searchTerm,
        status: statusFilter,
        action: actionFilter,
        timeframe: timeFilter
      })

      const response = await fetch(`/api/admin/audit-logs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch audit logs')
      const data = await response.json()
      
      setLogs(data.logs)
      setTotalPages(data.totalPages)
      setSecurityAnalysis(data.securityAnalysis)
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuditLogs()
  }, [currentPage, searchTerm, statusFilter, actionFilter, timeFilter])

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const params = new URLSearchParams({
        type: 'audit',
        format,
        timeframe: timeFilter,
        search: searchTerm,
        status: statusFilter,
        action: actionFilter
      })

      const response = await fetch(`/api/admin/reports?${params}`)
      if (!response.ok) throw new Error('Failed to export audit logs')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-logs-${new Date().toISOString()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting audit logs:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Success</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Warning</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Log Viewer</h2>
          <p className="text-gray-600">Security monitoring and activity tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
            >
              <Download className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>
      </div>

      {/* Security Analysis Summary */}
      {securityAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{securityAnalysis.failedLogins.total}</div>
              <div className="text-sm text-gray-600">
                {securityAnalysis.failedLogins.uniqueUsers} unique users
              </div>
              {securityAnalysis.failedLogins.topFailedUsers.slice(0, 3).map((user, index) => (
                <div key={user.email} className="text-xs text-gray-500 mt-1">
                  {index + 1}. {user.email} ({user.count} attempts)
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permission Changes</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{securityAnalysis.permissionChanges}</div>
              <div className="text-sm text-gray-600">
                Role/permission modifications
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspicious Activities</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{securityAnalysis.suspiciousActivities.length}</div>
              <div className="text-sm text-gray-600">
                Security alerts detected
              </div>
              {securityAnalysis.suspiciousActivities.slice(0, 2).map((activity, index) => (
                <div key={index} className="text-xs text-gray-500 mt-1">
                  <Badge className={getSeverityColor(activity.severity)}>
                    {activity.type} ({activity.count})
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter audit logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by user email, action, or resource..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
              </select>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Actions</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="impersonate">Impersonate</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>Recent system activities and security events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Resource</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">IP Address</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">
                        {format(new Date(log.createdAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(log.createdAt), 'HH:mm:ss')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{log.userEmail}</div>
                          <div className="text-xs text-gray-500">ID: {log.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{log.action}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">{log.resource}</div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">{log.ipAddress}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Show details modal or expand row
                          console.log('Show details:', log.details)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}