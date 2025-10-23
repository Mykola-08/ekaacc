'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useData } from '@/context/unified-data-context';
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

export default function SettingsPage() {
  const { currentUser, updateUser } = useData();
  const { toast } = useToast();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [hasChanges, setHasChanges] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  // App preferences
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactView, setCompactView] = useState(false);

  const handleSave = () => {
    // Save all settings
    updateUser({
      settings: {
        notifications: {
          email: emailNotifications,
          push: pushNotifications,
          sms: smsNotifications,
          marketing: marketingEmails,
        },
        privacy: {
          profileVisibility,
          activityStatus,
          dataSharing,
        },
        preferences: {
          soundEffects,
          autoSave,
          compactView,
        },
      },
    });

    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
    setHasChanges(false);
  };

  const markChanged = () => setHasChanges(true);

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
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your notifications and preferences</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/account')}>
          View Profile
        </Button>
      </div>

      {/* Appearance */}
      <AnimatedCard delay={100} asChild>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              Appearance
            </CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="flex flex-col gap-1">
                <span className="font-medium">Theme</span>
                <span className="text-sm text-muted-foreground">Choose your preferred color scheme</span>
              </Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('system')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-view" className="flex flex-col gap-1">
                <span className="font-medium">Compact View</span>
                <span className="text-sm text-muted-foreground">Use a denser layout</span>
              </Label>
              <Switch
                id="compact-view"
                checked={compactView}
                onCheckedChange={(checked) => {
                  setCompactView(checked);
                  markChanged();
                }}
              />
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Notifications */}
      <AnimatedCard delay={200} asChild>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">Email Notifications</span>
                </div>
                <span className="text-sm text-muted-foreground">Receive updates via email</span>
              </Label>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={(checked) => {
                  setEmailNotifications(checked);
                  markChanged();
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">Push Notifications</span>
                </div>
                <span className="text-sm text-muted-foreground">Get instant updates</span>
              </Label>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={(checked) => {
                  setPushNotifications(checked);
                  markChanged();
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications" className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">SMS Notifications</span>
                </div>
                <span className="text-sm text-muted-foreground">Receive text messages</span>
              </Label>
              <Switch
                id="sms-notifications"
                checked={smsNotifications}
                onCheckedChange={(checked) => {
                  setSmsNotifications(checked);
                  markChanged();
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing-emails" className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">Marketing Emails</span>
                </div>
                <span className="text-sm text-muted-foreground">Receive promotional content</span>
              </Label>
              <Switch
                id="marketing-emails"
                checked={marketingEmails}
                onCheckedChange={(checked) => {
                  setMarketingEmails(checked);
                  markChanged();
                }}
              />
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Privacy & Security */}
      <AnimatedCard delay={300} asChild>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Control your privacy and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-visibility" className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">Profile Visibility</span>
                </div>
                <span className="text-sm text-muted-foreground">Make your profile visible to others</span>
              </Label>
              <Switch
                id="profile-visibility"
                checked={profileVisibility}
                onCheckedChange={(checked) => {
                  setProfileVisibility(checked);
                  markChanged();
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="activity-status" className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">Activity Status</span>
                </div>
                <span className="text-sm text-muted-foreground">Show when you're online</span>
              </Label>
              <Switch
                id="activity-status"
                checked={activityStatus}
                onCheckedChange={(checked) => {
                  setActivityStatus(checked);
                  markChanged();
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="data-sharing" className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Data Sharing</span>
                </div>
                <span className="text-sm text-muted-foreground">Share anonymized data for research</span>
              </Label>
              <Switch
                id="data-sharing"
                checked={dataSharing}
                onCheckedChange={(checked) => {
                  setDataSharing(checked);
                  markChanged();
                }}
              />
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* App Preferences */}
      <AnimatedCard delay={400} asChild>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              App Preferences
            </CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects" className="flex flex-col gap-1">
                <span className="font-medium">Sound Effects</span>
                <span className="text-sm text-muted-foreground">Play sounds for actions</span>
              </Label>
              <Switch
                id="sound-effects"
                checked={soundEffects}
                onCheckedChange={(checked) => {
                  setSoundEffects(checked);
                  markChanged();
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save" className="flex flex-col gap-2">
                <span className="font-medium">Auto-Save</span>
                <span className="text-sm text-muted-foreground">Automatically save your work</span>
              </Label>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={(checked) => {
                  setAutoSave(checked);
                  markChanged();
                }}
              />
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Save Button */}
      {hasChanges && (
        <div className="sticky bottom-4 flex justify-end">
          <Button onClick={handleSave} size="lg" className="shadow-lg">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
