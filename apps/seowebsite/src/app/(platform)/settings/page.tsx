'use client';

import { Button } from '@/components/platform/ui/button';
import { PageContainer } from '@/components/platform/eka/page-container';
import { PageHeader } from '@/components/platform/eka/page-header';
import { Card, CardContent, CardHeader } from '@/components/platform/ui/card';
import { Skeleton } from '@/components/platform/ui/skeleton';
import { Label } from '@/components/platform/ui/label';
import { Input } from '@/components/platform/ui/input';
import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/platform/ui/dialog';
import { useAuth } from '@/lib/platform/supabase-auth';
import { useAppStore } from '@/store/platform/app-store';
import { useToast } from '@/hooks/platform/use-toast';
import { 
  Bell, Mail, MessageSquare, Calendar, Save, Shield, User as UserIcon, Smartphone, Lock, RefreshCw
} from 'lucide-react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { ThemeSelector } from '@/components/platform/eka/settings/theme-selector';
import { NotificationSwitch } from '@/components/platform/eka/settings/notification-switch';
import { SettingsHeader } from '@/components/platform/eka/settings/settings-header';
import { SettingsShell } from '@/components/platform/eka/settings/settings-shell';
import { SettingsCard } from '@/components/platform/eka/settings/settings-card';
import type { User } from '@/lib/platform/types';

type UserSettings = NonNullable<User['settings']>;
type SettingsCategory = keyof UserSettings;

export default function SettingsPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const { toast } = useToast();

  const [settings, setSettings] = useState<UserSettings>(currentUser?.settings || {});
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/square/sync', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Sync Completed",
          description: `Imported: ${result.imported}, Updated: ${result.updated}`,
        });
      } else {
        throw new Error(result.error || 'Sync failed');
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setSettings(currentUser.settings || {});
      setIsLoading(false);
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [currentUser, authLoading]);

  const handleSettingChange = (category: SettingsCategory, key: string, value: boolean) => {
    setSettings((prev: UserSettings) => {
      const newSettings = {
        ...prev,
        [category]: {
          ...prev?.[category as keyof UserSettings],
          [key]: value,
        },
      } as UserSettings;
      
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
    { id: 'email-news', label: 'Newsletter and Updates', category: 'notifications', subcategory: 'email', key: 'marketing', icon: <Mail className="h-5 w-5 text-blue-600" /> },
    { id: 'email-reminders', label: 'Appointment Reminders', category: 'notifications', subcategory: 'email', key: 'email', icon: <Calendar className="h-5 w-5 text-green-600" /> },
    { id: 'push-messages', label: 'New Chat Messages', category: 'notifications', subcategory: 'push', key: 'push', icon: <MessageSquare className="h-5 w-5 text-purple-600" /> },
    { id: 'push-sms', label: 'SMS Notifications', category: 'notifications', subcategory: 'push', key: 'sms', icon: <Bell className="h-5 w-5 text-orange-600" /> },
  ] as const, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  if (isLoading || authLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <PageContainer>
      <PageHeader
        icon={UserIcon}
        title="Settings"
        description="Customize your experience and manage your preferences"
        actions={
          hasChanges && (
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          )
        }
      />

        <SettingsShell className="mt-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
              <SettingsCard title="Profile" description="Basic account information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm">Full Name</Label>
                    <Input value={currentUser?.fullName || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Email Address</Label>
                    <Input value={currentUser?.email || ''} disabled />
                  </div>
                </div>
              </SettingsCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <SettingsCard title="Appearance" description="Choose your theme">
                <ThemeSelector />
              </SettingsCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <SettingsCard title="Notifications" description="Email and push preferences">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4" />
                      <h3 className="text-sm font-medium">Email</h3>
                    </div>
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

                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Smartphone className="w-4 h-4" />
                      <h3 className="text-sm font-medium">Push</h3>
                    </div>
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
            </motion.div>

            <motion.div variants={itemVariants}>
              <SettingsCard title="Security" description="Account protection">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-muted hover:border-border transition-all duration-300">
                    <div className="space-y-1">
                      <h4 className="font-medium flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </h4>
                      <p className="text-sm text-muted-foreground">Reset your password via email</p>
                    </div>
                    <Button variant="outline" onClick={() => setShowPasswordReset(true)}>
                      Reset Password
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-muted hover:border-border transition-all duration-300">
                    <div className="space-y-1">
                      <h4 className="font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </SettingsCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <SettingsCard title="Integrations" description="Manage external services">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <h4 className="font-medium flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Square & Stripe Sync
                    </h4>
                    <p className="text-sm text-muted-foreground">Trigger a sync of services and appointments</p>
                  </div>
                  <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
                    {isSyncing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      'Sync Now'
                    )}
                  </Button>
                </div>
              </SettingsCard>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {hasChanges && (
              <motion.div
                className="sticky bottom-4 flex justify-end"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Button onClick={handleSave} disabled={isLoading} data-testid="save-settings">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </SettingsShell>

        {/* Password Reset Dialog (shadcn) */}
        <Dialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Password Reset</DialogTitle>
              <DialogDescription>
                A password reset link will be sent to your email address.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline"
                onClick={() => setShowPasswordReset(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: 'Password Reset Sent',
                    description: 'Check your email for the reset link.',
                  });
                  setShowPasswordReset(false);
                }}
              >
                Send Reset Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </PageContainer>
  );
}

function SettingsSkeleton() {
  return (
    <div className="settings-skeleton-page">
      <div className="settings-skeleton-container">
        <div className="settings-skeleton-section">
          <div className="settings-skeleton-flex-between">
            <div className="settings-skeleton-space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="settings-skeleton-card">
          <div className="settings-skeleton-card-header">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="settings-skeleton-card-content">
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        
        <div className="settings-skeleton-card">
          <div className="settings-skeleton-card-header">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="settings-skeleton-card-content settings-skeleton-space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
