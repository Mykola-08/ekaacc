'use client';

import { Button } from '@/components/platform/ui/button';
import { PageContainer } from '@/components/platform/eka/page-container';
import { PageHeader } from '@/components/platform/eka/page-header';
import { Skeleton } from '@/components/ui';
import { Label } from '@/components/platform/ui/label';
import { Input } from '@/components/platform/ui/input';
import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/platform/ui/dialog';
import { useAppStore } from '@/store/platform/app-store';
import { useToast } from '@/hooks/platform/ui/use-toast';
import {
  Bell,
  Mail,
  MessageSquare,
  Calendar,
  Save,
  Shield,
  User as UserIcon,
  Smartphone,
  Lock,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { ThemeSelector } from '@/components/platform/eka/settings/theme-selector';
import { NotificationSwitch } from '@/components/platform/eka/settings/notification-switch';
import { SettingsShell } from '@/components/platform/eka/settings/settings-shell';
import { SettingsCard } from '@/components/platform/eka/settings/settings-card';
import type { User } from '@/lib/platform/types/types';

type UserSettings = NonNullable<User['settings']>;
type SettingsCategory = keyof UserSettings;

interface SettingsContentProps {
  currentUser: User;
}

export function SettingsContent({ currentUser }: SettingsContentProps) {
  const dataService = useAppStore((state) => state.dataService);
  const { toast } = useToast();

  const [settings, setSettings] = useState<UserSettings>(currentUser?.settings || {});
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/square/sync', { method: 'POST' });
      const result = (await response.json()) as {
        success: boolean;
        imported?: number;
        updated?: number;
        error?: string;
      };
      if (result.success) {
        toast({
          title: 'Sync Completed',
          description: `Imported: ${result.imported}, Updated: ${result.updated}`,
        });
      } else {
        throw new Error(result.error || 'Sync failed');
      }
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

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
      toast({ title: 'Could not save settings. Service not ready.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await dataService.updateUser(currentUser.id, { settings });

      toast({
        title: 'Settings Saved',
        description: 'Your preferences have been updated successfully.',
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings', error);
      toast({
        title: 'Unable to save settings',
        description: 'Please try again or check your connection.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const notificationSettings = useMemo(
    () =>
      [
        {
          id: 'email-news',
          label: 'Newsletter and Updates',
          category: 'notifications',
          subcategory: 'email',
          key: 'marketing',
          icon: <Mail className="h-5 w-5 text-blue-600" />,
        },
        {
          id: 'email-reminders',
          label: 'Appointment Reminders',
          category: 'notifications',
          subcategory: 'email',
          key: 'email',
          icon: <Calendar className="h-5 w-5 text-green-600" />,
        },
        {
          id: 'push-messages',
          label: 'New Chat Messages',
          category: 'notifications',
          subcategory: 'push',
          key: 'push',
          icon: <MessageSquare className="h-5 w-5 text-purple-600" />,
        },
        {
          id: 'push-sms',
          label: 'SMS Notifications',
          category: 'notifications',
          subcategory: 'push',
          key: 'sms',
          icon: <Bell className="h-5 w-5 text-orange-600" />,
        },
      ] as const,
    []
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

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
              className="gap-2 transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          )
        }
      />

      <SettingsShell className="mt-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <SettingsCard title="Profile" description="Basic account information">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm">Full Name</Label>
                  <Input
                    value={currentUser?.name || currentUser?.displayName || ''}
                    disabled
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Email Address</Label>
                  <Input value={currentUser?.email || ''} disabled className="bg-muted/50" />
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
                  <div className="mb-1 flex items-center gap-2">
                    <Mail className="text-primary h-4 w-4" />
                    <h3 className="text-sm font-medium">Email</h3>
                  </div>
                  {notificationSettings
                    .filter((s) => s.subcategory === 'email')
                    .map((setting) => (
                      <NotificationSwitch
                        key={setting.id}
                        id={setting.id}
                        label={setting.label}
                        icon={setting.icon}
                        checked={
                          settings?.notifications?.[setting.key as 'email' | 'marketing'] ?? false
                        }
                        onCheckedChange={(value) =>
                          handleSettingChange('notifications', setting.key, value)
                        }
                      />
                    ))}
                </div>

                <div className="pt-2">
                  <div className="mb-1 flex items-center gap-2">
                    <Smartphone className="text-primary h-4 w-4" />
                    <h3 className="text-sm font-medium">Push</h3>
                  </div>
                  {notificationSettings
                    .filter((s) => s.subcategory === 'push')
                    .map((setting) => (
                      <NotificationSwitch
                        key={setting.id}
                        id={setting.id}
                        label={setting.label}
                        icon={setting.icon}
                        checked={settings?.notifications?.[setting.key as 'push' | 'sms'] ?? false}
                        onCheckedChange={(value) =>
                          handleSettingChange('notifications', setting.key, value)
                        }
                      />
                    ))}
                </div>
              </div>
            </SettingsCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SettingsCard title="Security" description="Account protection">
              <div className="space-y-4">
                <div className="border-muted hover:border-border hover:bg-card/50 flex items-center justify-between rounded-lg border p-4 transition-all duration-200">
                  <div className="space-y-1">
                    <h4 className="flex items-center gap-2 font-medium">
                      <Lock className="h-4 w-4 text-amber-500" />
                      Password
                    </h4>
                    <p className="text-muted-foreground text-sm">Reset your password via email</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowPasswordReset(true)}>
                    Reset Password
                  </Button>
                </div>
                <div className="border-muted hover:border-border hover:bg-card/50 flex items-center justify-between rounded-lg border p-4 opacity-60 transition-all duration-200">
                  <div className="space-y-1">
                    <h4 className="flex items-center gap-2 font-medium">
                      <Shield className="h-4 w-4 text-green-500" />
                      Two-Factor Authentication
                    </h4>
                    <p className="text-muted-foreground text-sm">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </SettingsCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SettingsCard title="Integrations" description="Manage external services">
              <div className="border-muted hover:border-border hover:bg-card/50 flex items-center justify-between rounded-lg border p-4 transition-all duration-200">
                <div className="space-y-1">
                  <h4 className="flex items-center gap-2 font-medium">
                    <RefreshCw
                      className={
                        isSyncing ? 'h-4 w-4 animate-spin text-blue-500' : 'h-4 w-4 text-blue-500'
                      }
                    />
                    Square & Stripe Sync
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Trigger a sync of services and appointments
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleSync} disabled={isSyncing}>
                  {isSyncing ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
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
              className="fixed right-8 bottom-8 z-50 shadow-lg"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Button
                onClick={handleSave}
                disabled={isLoading}
                size="lg"
                className="rounded-full shadow-xl"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
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
          <div className="flex items-center justify-center py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowPasswordReset(false)}>
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
