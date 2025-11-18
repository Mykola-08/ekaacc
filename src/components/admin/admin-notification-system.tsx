'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Send,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  RefreshCw,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'

interface AdminNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  recipients: 'all' | 'admins' | 'users' | 'specific'
  recipientIds: string[]
  isActive: boolean
  createdAt: string
  createdBy: string
  expiresAt?: string
  priority: 'low' | 'medium' | 'high'
}

interface NotificationTemplate {
  id: string
  name: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'medium' | 'high'
}

export function AdminNotificationSystem() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [editingNotification, setEditingNotification] = useState<AdminNotification | null>(null)
  const [sending, setSending] = useState(false)

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    recipients: 'all' as const,
    recipientIds: [] as string[],
    priority: 'medium' as const,
    expiresAt: ''
  })

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    title: '',
    message: '',
    type: 'info' as const,
    priority: 'medium' as const
  })

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications')
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      setNotifications(data.notifications)
      setTemplates(data.templates)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleCreateNotification = async () => {
    try {
      setSending(true)
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotification)
      })
      
      if (!response.ok) throw new Error('Failed to create notification')
      
      setShowCreateModal(false)
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        recipients: 'all',
        recipientIds: [],
        priority: 'medium',
        expiresAt: ''
      })
      fetchNotifications()
    } catch (error) {
      console.error('Error creating notification:', error)
    } finally {
      setSending(false)
    }
  }

  const handleCreateTemplate = async () => {
    try {
      setSending(true)
      const response = await fetch('/api/admin/notifications/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate)
      })
      
      if (!response.ok) throw new Error('Failed to create template')
      
      setShowTemplateModal(false)
      setNewTemplate({
        name: '',
        title: '',
        message: '',
        type: 'info',
        priority: 'medium'
      })
      fetchNotifications()
    } catch (error) {
      console.error('Error creating template:', error)
    } finally {
      setSending(false)
    }
  }

  const handleToggleNotification = async (notificationId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })
      
      if (!response.ok) throw new Error('Failed to update notification')
      
      fetchNotifications()
    } catch (error) {
      console.error('Error updating notification:', error)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return
    
    try {
      const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete notification')
      
      fetchNotifications()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleSendTestNotification = async (notificationId: string) => {
    try {
      setSending(true)
      const response = await fetch(`/api/admin/notifications/${notificationId}/test`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to send test notification')
      
      alert('Test notification sent successfully!')
    } catch (error) {
      console.error('Error sending test notification:', error)
    } finally {
      setSending(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Bell className="h-4 w-4 text-blue-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'success': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || notification.type === typeFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && notification.isActive) ||
                         (statusFilter === 'inactive' && !notification.isActive)
    return matchesSearch && matchesType && matchesStatus
  })

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
          <h2 className="text-2xl font-bold text-gray-900">Notification System</h2>
          <p className="text-gray-600">Manage system notifications and alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchNotifications}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Notification
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowTemplateModal(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find notifications quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="success">Success</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(notification.type)}
                  <div>
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                    <CardDescription>{notification.message}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(notification.type)}>
                    {notification.type}
                  </Badge>
                  <Badge className={getPriorityColor(notification.priority)}>
                    {notification.priority}
                  </Badge>
                  <Switch
                    checked={notification.isActive}
                    onCheckedChange={(checked) => handleToggleNotification(notification.id, checked)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Recipients:</span>
                  <Badge variant="outline">{notification.recipients}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span>{format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')} by {notification.createdBy}</span>
                </div>
                {notification.expiresAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Expires:</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(notification.expiresAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendTestNotification(notification.id)}
                    disabled={sending}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingNotification(notification)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Notification</CardTitle>
              <CardDescription>Send a notification to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  placeholder="Notification title"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  placeholder="Notification message"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="success">Success</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification({ ...newNotification, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="recipients">Recipients</Label>
                <select
                  id="recipients"
                  value={newNotification.recipients}
                  onChange={(e) => setNewNotification({ ...newNotification, recipients: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Users</option>
                  <option value="admins">Admins Only</option>
                  <option value="users">Regular Users</option>
                  <option value="specific">Specific Users</option>
                </select>
              </div>
              <div>
                <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={newNotification.expiresAt}
                  onChange={(e) => setNewNotification({ ...newNotification, expiresAt: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateNotification}
                  disabled={sending || !newNotification.title || !newNotification.message}
                  className="flex-1"
                >
                  {sending ? 'Creating...' : 'Create Notification'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}