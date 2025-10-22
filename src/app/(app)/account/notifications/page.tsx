'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  UserNotificationSettings, 
  defaultNotificationSettings,
  NotificationCategory,
  NotificationPriority 
} from '@/lib/notification-types';
import { Bell, Mail, MessageSquare, Smartphone, Monitor, Moon, Volume2 } from 'lucide-react';
import { useData } from '@/context/unified-data-context';

export default function NotificationSettingsPage() {
  const { currentUser } = useData();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserNotificationSettings>(defaultNotificationSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load user settings from localStorage or API
    if (currentUser) {
      const savedSettings = localStorage.getItem(`notification_settings_${currentUser.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        setSettings({ ...defaultNotificationSettings, userId: currentUser.id });
      }
    }
  }, [currentUser]);

  const handleSave = () => {
    if (currentUser) {
      localStorage.setItem(`notification_settings_${currentUser.id}`, JSON.stringify(settings));
      toast({
        title: 'Settings Saved',
        description: 'Your notification preferences have been updated successfully.',
      });
      setHasChanges(false);
    }
  };

  const updateChannelSetting = (channel: keyof UserNotificationSettings['enabledChannels'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      enabledChannels: {
        ...prev.enabledChannels,
        [channel]: value,
      },
    }));
    setHasChanges(true);
  };

  const updateCategorySetting = (
    category: NotificationCategory,
    key: 'enabled' | 'sound' | 'priority',
    value: boolean | NotificationPriority
  ) => {
    setSettings(prev => ({
      ...prev,
      categorySettings: {
        ...prev.categorySettings,
        [category]: {
          ...prev.categorySettings[category],
          [key]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const updateQuietHours = (key: keyof UserNotificationSettings['quietHours'], value: any) => {
    setSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const updatePreference = (key: keyof UserNotificationSettings['preferences'], value: any) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const categories: { key: NotificationCategory; label: string; description: string }[] = [
    { key: 'sessions', label: 'Sessions & Appointments', description: 'Notifications about your therapy sessions' },
    { key: 'reports', label: 'Reports & Documents', description: 'Updates on reports and assessments' },
    { key: 'messages', label: 'Messages', description: 'New messages and communications' },
    { key: 'payments', label: 'Payments & Billing', description: 'Payment confirmations and billing updates' },
    { key: 'donations', label: 'Donations', description: 'Donation activities and confirmations' },
    { key: 'system', label: 'System Updates', description: 'Platform updates and maintenance' },
  ];

  if (currentUser?.role === 'Admin') {
    categories.push({ key: 'admin', label: 'Admin Alerts', description: 'Critical admin notifications and alerts' });
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage how and when you receive notifications
        </p>
      </div>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="in-app">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
              </div>
            </div>
            <Switch
              id="in-app"
              checked={settings.enabledChannels.inApp}
              onCheckedChange={(checked) => updateChannelSetting('inApp', checked)}
            />
          </div>

          {/* Hidden until external services are configured */}
          {/* <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="email">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              id="email"
              checked={settings.enabledChannels.email}
              onCheckedChange={(checked) => updateChannelSetting('email', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="sms">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
              </div>
            </div>
            <Switch
              id="sms"
              checked={settings.enabledChannels.sms}
              onCheckedChange={(checked) => updateChannelSetting('sms', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="push">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications on mobile</p>
              </div>
            </div>
            <Switch
              id="push"
              checked={settings.enabledChannels.push}
              onCheckedChange={(checked) => updateChannelSetting('push', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="desktop">Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive desktop browser notifications</p>
              </div>
            </div>
            <Switch
              id="desktop"
              checked={settings.enabledChannels.desktop}
              onCheckedChange={(checked) => updateChannelSetting('desktop', checked)}
            />
          </div> */}
        </CardContent>
      </Card>

      {/* Category Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Categories</CardTitle>
          <CardDescription>Customize notifications for each category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((category) => (
            <div key={category.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">{category.label}</Label>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <Switch
                  checked={settings.categorySettings[category.key].enabled}
                  onCheckedChange={(checked) => updateCategorySetting(category.key, 'enabled', checked)}
                />
              </div>
              
              {settings.categorySettings[category.key].enabled && (
                <div className="ml-4 pl-4 border-l space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <Label>Sound</Label>
                    </div>
                    <Switch
                      checked={settings.categorySettings[category.key].sound}
                      onCheckedChange={(checked) => updateCategorySetting(category.key, 'sound', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Priority</Label>
                    <Select
                      value={settings.categorySettings[category.key].priority}
                      onValueChange={(value) => updateCategorySetting(category.key, 'priority', value as NotificationPriority)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {category.key !== categories[categories.length - 1].key && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Quiet Hours</CardTitle>
          <CardDescription>Set times when you don't want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
            </div>
            <Switch
              id="quiet-hours"
              checked={settings.quietHours.enabled}
              onCheckedChange={(checked) => updateQuietHours('enabled', checked)}
            />
          </div>

          {settings.quietHours.enabled && (
            <div className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => updateQuietHours('start', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => updateQuietHours('end', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Additional notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Group Similar Notifications</Label>
              <p className="text-sm text-muted-foreground">Combine similar notifications into one</p>
            </div>
            <Switch
              checked={settings.preferences.groupSimilar}
              onCheckedChange={(checked) => updatePreference('groupSimilar', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Previews</Label>
              <p className="text-sm text-muted-foreground">Display notification content in previews</p>
            </div>
            <Switch
              checked={settings.preferences.showPreviews}
              onCheckedChange={(checked) => updatePreference('showPreviews', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Mark as Read on Click</Label>
              <p className="text-sm text-muted-foreground">Automatically mark notifications as read when clicked</p>
            </div>
            <Switch
              checked={settings.preferences.markReadOnClick}
              onCheckedChange={(checked) => updatePreference('markReadOnClick', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-delete">Auto-Delete After (days)</Label>
              <p className="text-sm text-muted-foreground">Automatically delete old notifications</p>
            </div>
            <Input
              id="auto-delete"
              type="number"
              min="1"
              max="365"
              value={settings.preferences.autoDeleteAfterDays}
              onChange={(e) => updatePreference('autoDeleteAfterDays', parseInt(e.target.value))}
              className="w-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!hasChanges}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
