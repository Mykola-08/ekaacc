'use client';

import { Button, Card, CardContent, CardHeader, Skeleton } from '@/components/keep';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, Mail, MessageSquare, Calendar, Save
} from 'lucide-react';
;
;
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import { SettingsCard } from '@/components/eka/settings/settings-card';
import { ThemeSelector } from '@/components/eka/settings/theme-selector';
import { NotificationSwitch } from '@/components/eka/settings/notification-switch';
;
import type { User } from '@/lib/types';

type UserSettings = NonNullable<User['settings']>;
type SettingsCategory = keyof UserSettings;

export default function SettingsPage() {
  const { appUser: currentUser, refreshAppUser, loading: authLoading } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const { toast } = useToast();

  const [settings, setSettings] = useState<UserSettings>(currentUser?.settings || {});
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setSettings(currentUser.settings || {});
      setIsLoading(false);
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [currentUser, authLoading]);

  const handleSettingChange = (category: SettingsCategory, key: string, value: boolean) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        [category]: {
          ...prev?.[category],
          [key]: value,
        },
      };
      
      // Deep compare to check for actual changes
      if (JSON.stringify(newSettings) !== JSON.stringify(currentUser?.settings || {})) {
        setHasChanges(true);
      } else {
        setHasChanges(false);
      }
      return newSettings;
    });
  };

  const handleSave = async () => {
    if (!currentUser || !dataService) {
      toast({ title: "Could not save settings. User not found.", variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await dataService.updateUser(currentUser.id, { settings });
      await refreshAppUser();

      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings', error);
      toast({
        title: "Unable to save settings",
        description: "Please try again or check your connection.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const notificationSettings = useMemo(() => [
    { id: 'email-news', label: 'Newsletter and Updates', category: 'notifications', subcategory: 'email', key: 'marketing', icon: <Mail className="h-5 w-5 text-muted-foreground" /> },
    { id: 'email-reminders', label: 'Appointment Reminders', category: 'notifications', subcategory: 'email', key: 'email', icon: <Calendar className="h-5 w-5 text-muted-foreground" /> },
    { id: 'push-messages', label: 'New Chat Messages', category: 'notifications', subcategory: 'push', key: 'push', icon: <MessageSquare className="h-5 w-5 text-muted-foreground" /> },
    { id: 'push-sms', label: 'SMS Notifications', category: 'notifications', subcategory: 'push', key: 'sms', icon: <Bell className="h-5 w-5 text-muted-foreground" /> },
  ] as const, []);

  if (isLoading || authLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <SettingsShell>
      <div className="flex items-center justify-between">
        <SettingsHeader
          title="Settings"
          description="Manage your account, notifications, and appearance preferences."
        />
        <Button onClick={handleSave} disabled={!hasChanges || isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <SettingsCard
        title="Appearance"
        description="Customize the look and feel of the application."
      >
        <ThemeSelector />
      </SettingsCard>

      <SettingsCard
        title="Notifications"
        description="Choose how you want to be notified about important events."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Email Notifications</h4>
            {notificationSettings.filter(s => s.subcategory === 'email').map(setting => (
              <NotificationSwitch
                key={setting.id}
                id={setting.id}
                label={setting.label}
                icon={setting.icon}
                checked={settings?.notifications?.[setting.key as 'email' | 'marketing'] ?? false}
                onCheckedChange={(value) => handleSettingChange('notifications', setting.key, value)}
              />
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Push Notifications</h4>
            {notificationSettings.filter(s => s.subcategory === 'push').map(setting => (
              <NotificationSwitch
                key={setting.id}
                id={setting.id}
                label={setting.label}
                icon={setting.icon}
                checked={settings?.notifications?.[setting.key as 'push' | 'sms'] ?? false}
                onCheckedChange={(value) => handleSettingChange('notifications', setting.key, value)}
              />
            ))}
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Account & Security"
        description="Manage your account information and security settings."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h4 className="font-medium">Password</h4>
              <p className="text-sm text-muted-foreground">
                For security, password changes are handled via email reset.
              </p>
            </div>
            <Button variant="outline">Reset Password</Button>
          </div>
           <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account.
              </p>
            </div>
            <Button variant="outline" disabled>Enable</Button>
          </div>
        </div>
      </SettingsCard>
    </SettingsShell>
  );
}

function SettingsSkeleton() {
  return (
    <SettingsShell>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </SettingsShell>
  );
}
