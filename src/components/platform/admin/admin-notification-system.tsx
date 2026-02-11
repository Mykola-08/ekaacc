'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  recipients: 'all' | 'admins' | 'users' | 'specific';
  recipientIds: string[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  expiresAt?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high';
}

export function AdminNotificationSystem() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [sending, setSending] = useState(false);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    recipients: 'all' as const,
    recipientIds: [] as string[],
    priority: 'medium' as const,
    expiresAt: '',
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    title: '',
    message: '',
    type: 'info' as const,
    priority: 'medium' as const,
  });

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data.notifications);
      setTemplates(data.templates);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCreateNotification = async () => {
    try {
      setSending(true);
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotification),
      });

      if (!response.ok) throw new Error('Failed to create notification');

      setShowCreateModal(false);
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        recipients: 'all',
        recipientIds: [],
        priority: 'medium',
        expiresAt: '',
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
    } finally {
      setSending(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      setSending(true);
      const response = await fetch('/api/admin/notifications/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate),
      });

      if (!response.ok) throw new Error('Failed to create template');

      setShowTemplateModal(false);
      setNewTemplate({
        name: '',
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error creating template:', error);
    } finally {
      setSending(false);
    }
  };

  const handleToggleNotification = async (notificationId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update notification');

      fetchNotifications();
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete notification');

      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleSendTestNotification = async (notificationId: string) => {
    try {
      setSending(true);
      const response = await fetch(`/api/admin/notifications/${notificationId}/test`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to send test notification');

      alert('Test notification sent successfully!');
    } catch (error) {
      console.error('Error sending test notification:', error);
    } finally {
      setSending(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Bell className="h-4 w-4 text-primary" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Bell className="text-muted-foreground h-4 w-4" />;
    }
  };



  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && notification.isActive) ||
      (statusFilter === 'inactive' && !notification.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-semibold">Notification System</h2>
          <p className="text-muted-foreground">Manage system notifications and alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchNotifications}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Notification
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowTemplateModal(true)}>
            <FileText className="mr-2 h-4 w-4" />
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
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground/80 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
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
                className="rounded-md border border-border px-3 py-2 text-sm"
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
                className="rounded-md border border-border px-3 py-2 text-sm"
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
                  <StatusBadge status={notification.type} />
                  <Badge variant={getStatusVariant(notification.priority === 'high' ? 'critical' : notification.priority === 'medium' ? 'warning' : 'info')} className="capitalize">
                    {notification.priority}
                  </Badge>
                  <Switch
                    checked={notification.isActive}
                    onCheckedChange={(checked) =>
                      handleToggleNotification(notification.id, checked)
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Recipients:</span>
                  <Badge variant="outline">{notification.recipients}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>
                    {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')} by{' '}
                    {notification.createdBy}
                  </span>
                </div>
                {notification.expiresAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expires:</span>
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
                    <Send className="mr-1 h-3 w-3" />
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('Edit not implemented')}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
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
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-foreground">
          <Card className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto">
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
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, title: e.target.value })
                  }
                  placeholder="Notification title"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newNotification.message}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, message: e.target.value })
                  }
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
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, type: e.target.value as any })
                    }
                    className="w-full rounded-md border border-border px-3 py-2"
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
                    onChange={(e) =>
                      setNewNotification({ ...newNotification, priority: e.target.value as any })
                    }
                    className="w-full rounded-md border border-border px-3 py-2"
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
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, recipients: e.target.value as any })
                  }
                  className="w-full rounded-md border border-border px-3 py-2"
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
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, expiresAt: e.target.value })
                  }
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

      {/* Templates Modal */}
      {showTemplateModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-foreground">
          <Card className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <CardHeader>
              <CardTitle>Manage Templates</CardTitle>
              <CardDescription>Create and manage notification templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/40 space-y-4 rounded-lg p-4">
                <h4 className="font-medium">New Template</h4>
                <div>
                  <Label htmlFor="tpl-name">Template Name</Label>
                  <Input
                    id="tpl-name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="e.g. System Maintenance"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tpl-title">Title</Label>
                    <Input
                      id="tpl-title"
                      value={newTemplate.title}
                      onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                      placeholder="Default Title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tpl-type">Type</Label>
                    <select
                      id="tpl-type"
                      value={newTemplate.type}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, type: e.target.value as any })
                      }
                      className="w-full rounded-md border border-border px-3 py-2"
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                      <option value="success">Success</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tpl-message">Default Message</Label>
                  <Textarea
                    id="tpl-message"
                    value={newTemplate.message}
                    onChange={(e) => setNewTemplate({ ...newTemplate, message: e.target.value })}
                    placeholder="Default Message content..."
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleCreateTemplate}
                  disabled={sending || !newTemplate.name || !newTemplate.title}
                  className="w-full"
                >
                  Save Template
                </Button>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Existing Templates</h4>
                {templates.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No templates found.</p>
                ) : (
                  <div className="grid gap-2">
                    {templates.map((tpl) => (
                      <div
                        key={tpl.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <span className="font-medium">{tpl.name}</span>
                        <Badge variant="outline">{tpl.type}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
