'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Shield, 
  Eye, 
  Moon, 
  Sun, 
  Monitor,
  Volume2,
  Save
} from 'lucide-react';
import { AnimatedCard } from '@/components/eka/animated-card';
import { useTheme } from 'next-themes';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/lib/types';

export default function SettingsPage() {
  const { appUser: currentUser, refreshAppUser, loading: authLoading } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const { toast } = useToast();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [hasChanges, setHasChanges] = useState(false);

  // Local state for settings
  const [settings, setSettings] = useState(currentUser?.settings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setSettings(currentUser.settings || {});
      setIsLoading(false);
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [currentUser, authLoading]);


  const handleSettingChange = (category: keyof User['settings'], key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        // @ts-ignore
        ...prev?.[category],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!currentUser || !dataService) {
      toast({ title: "Could not save settings. User not found.", variant: 'destructive' });
      return;
    }

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
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please log in</CardTitle>
            <CardDescription>You need to be logged in to access settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Notifications Section */}
      <AnimatedCard>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive notifications from EKA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-gray-500" />
              <div>
                <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                <p className="text-sm text-gray-500">For session reminders, reports, and important updates.</p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={settings?.notifications?.email ?? true}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-500" />
              <div>
                <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                <p className="text-sm text-gray-500">Real-time alerts on your mobile or desktop device.</p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={settings?.notifications?.push ?? true}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'push', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-6 w-6 text-gray-500" />
              <div>
                <Label htmlFor="sms-notifications" className="font-medium">SMS Notifications</Label>
                <p className="text-sm text-gray-500">For urgent alerts and password resets.</p>
              </div>
            </div>
            <Switch
              id="sms-notifications"
              checked={settings?.notifications?.sms ?? false}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'sms', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 dark:bg-gray-900/30">
            <div className="flex items-center space-x-4">
              <Calendar className="h-6 w-6 text-gray-500" />
              <div>
                <Label htmlFor="marketing-emails" className="font-medium">Promotions & Community News</Label>
                <p className="text-sm text-gray-500">Receive occasional news, offers, and community updates.</p>
              </div>
            </div>
            <Switch
              id="marketing-emails"
              checked={settings?.notifications?.marketing ?? false}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'marketing', checked)}
            />
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Privacy Section */}
      <AnimatedCard>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>Control how your information is used and seen by others.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center space-x-4">
              <Eye className="h-6 w-6 text-gray-500" />
              <div>
                <Label htmlFor="profile-visibility" className="font-medium">Public Profile Visibility</Label>
                <p className="text-sm text-gray-500">Allow others in the community to see your profile.</p>
              </div>
            </div>
            <Switch
              id="profile-visibility"
              checked={settings?.privacy?.profileVisibility ?? true}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'profileVisibility', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center space-x-4">
              <Shield className="h-6 w-6 text-gray-500" />
              <div>
                <Label htmlFor="data-sharing" className="font-medium">Anonymized Data Sharing</Label>
                <p className="text-sm text-gray-500">Help improve EKA by sharing anonymized data for research.</p>
              </div>
            </div>
            <Switch
              id="data-sharing"
              checked={settings?.privacy?.dataSharing ?? false}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'dataSharing', checked)}
            />
          </div>
        </CardContent>
      </AnimatedCard>

      {/* App Preferences Section */}
      <AnimatedCard>
        <CardHeader>
          <CardTitle>Appearance & Preferences</CardTitle>
          <CardDescription>Customize your experience within the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center space-x-4">
              <Moon className="h-6 w-6 text-gray-500" />
              <div>
                <Label className="font-medium">Theme</Label>
                <p className="text-sm text-gray-500">Choose between light, dark, or system default.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border p-1">
              <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('light')}><Sun className="h-4 w-4" /></Button>
              <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('dark')}><Moon className="h-4 w-4" /></Button>
              <Button variant={theme === 'system' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('system')}><Monitor className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center space-x-4">
              <Volume2 className="h-6 w-6 text-gray-500" />
              <div>
                <Label htmlFor="sound-effects" className="font-medium">Sound Effects</Label>
                <p className="text-sm text-gray-500">Enable or disable interface sounds.</p>
              </div>
            </div>
            <Switch
              id="sound-effects"
              checked={settings?.appPreferences?.soundEffects ?? true}
              onCheckedChange={(checked) => handleSettingChange('appPreferences', 'soundEffects', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center space-x-4">
              <Save className="h-6 w-6 text-gray-500" />
              <div>
                <Label htmlFor="auto-save" className="font-medium">Auto-Save Forms</Label>
                <p className="text-sm text-gray-500">Automatically save your progress on forms like the journal.</p>
              </div>
            </div>
            <Switch
              id="auto-save"
              checked={settings?.appPreferences?.autoSave ?? true}
              onCheckedChange={(checked) => handleSettingChange('appPreferences', 'autoSave', checked)}
            />
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  );
}
