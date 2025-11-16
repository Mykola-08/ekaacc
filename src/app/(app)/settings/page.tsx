'use client';

import { Button, Card, CardContent, CardHeader, Skeleton, Label, Input, Switch } from '@/components/keep';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, Mail, MessageSquare, Calendar, Save, Shield, Palette, User, Smartphone, Globe, Lock, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSelector } from '@/components/eka/settings/theme-selector';
import { NotificationSwitch } from '@/components/eka/settings/notification-switch';
import type { User } from '@/lib/types';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent mb-2">
                Settings
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Customize your experience and manage your account preferences
              </p>
            </div>
            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button 
                    onClick={handleSave} 
                    disabled={isLoading}
                    className="premium-button-primary group"
                  >
                    <Save className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Settings */}
          <motion.div variants={itemVariants}>
            <Card className="premium-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Profile Information</h2>
                    <p className="text-sm text-slate-600">Manage your personal information and account details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Full Name</Label>
                    <Input 
                      value={currentUser?.fullName || ''} 
                      disabled 
                      className="premium-input bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Email Address</Label>
                    <Input 
                      value={currentUser?.email || ''} 
                      disabled 
                      className="premium-input bg-slate-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance Settings */}
          <motion.div variants={itemVariants}>
            <Card className="premium-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Palette className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Appearance</h2>
                    <p className="text-sm text-slate-600">Customize the look and feel of your application</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ThemeSelector />
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications Settings */}
          <motion.div variants={itemVariants}>
            <Card className="premium-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
                    <p className="text-sm text-slate-600">Choose how you want to be notified about important events</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-900">Email Notifications</h3>
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
                  
                  <div className="border-t border-slate-200 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-slate-900">Push Notifications</h3>
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div variants={itemVariants}>
            <Card className="premium-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Security</h2>
                    <p className="text-sm text-slate-600">Manage your account security and privacy settings</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-600" />
                        Password
                      </h4>
                      <p className="text-sm text-slate-600">
                        For security, password changes are handled via email reset
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="premium-button-outline"
                      onClick={() => setShowPasswordReset(true)}
                    >
                      Reset Password
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl border border-slate-200">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-slate-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      disabled
                      className="premium-button-outline-disabled"
                    >
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Password Reset Modal */}
        <AnimatePresence>
          {showPasswordReset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowPasswordReset(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Password Reset</h3>
                  <p className="text-slate-600 mb-6">
                    A password reset link will be sent to your email address.
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 premium-button-outline"
                      onClick={() => setShowPasswordReset(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 premium-button-primary"
                      onClick={() => {
                        // Handle password reset logic here
                        toast({
                          title: "Password Reset Sent",
                          description: "Check your email for the reset link.",
                        });
                        setShowPasswordReset(false);
                      }}
                    >
                      Send Reset Link
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
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
