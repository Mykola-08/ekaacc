'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserIcon,
  Notification02Icon,
  LockIcon,
  Tick02Icon,
  Logout02Icon,
  Camera01Icon,
} from '@hugeicons/core-free-icons';
import { IdentityVerificationForm } from '@/components/identity/IdentityVerificationForm';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DashboardHeader } from '../dashboard/layout/DashboardHeader';
import { motion } from 'motion/react';

export function SettingsPage({
  profile,
  identityStatus,
}: {
  profile: any;
  identityStatus: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reminders: true,
    marketing: false,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
      <div className="animate-in fade-in slide-in-from-bottom-2 mx-auto max-w-5xl space-y-8 px-4 py-8 pb-20 duration-700 md:px-8">
        <DashboardHeader
          title="Settings"
          subtitle="Manage your profile, security, and preferences."
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive bg-destructive/5 hover:bg-destructive/10 group h-11 rounded-full px-5 font-bold"
            onClick={handleSignOut}
          >
            <HugeiconsIcon
              icon={Logout02Icon}
              size={18}
              strokeWidth={2.5}
              className="mr-2 transition-transform group-hover:-translate-x-1"
            />
            Sign Out
          </Button>
        </DashboardHeader>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="bg-secondary inline-flex h-auto w-auto rounded-full p-1.5">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full px-6 py-2.5 font-bold transition-all data-[state=active]:shadow-md"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="identity"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full px-6 py-2.5 font-bold transition-all data-[state=active]:shadow-md"
            >
              Identity
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full px-6 py-2.5 font-bold transition-all data-[state=active]:shadow-md"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full px-6 py-2.5 font-bold transition-all data-[state=active]:shadow-md"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <div className="grid gap-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border-border/50 rounded-[20px] border p-10 shadow-sm"
              >
                <h2 className="text-foreground mb-10 flex items-center gap-4 text-2xl font-bold">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-[20px]">
                    <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={2.5} />
                  </div>
                  Personal Information
                </h2>
                <div className="flex flex-col items-start gap-12 md:flex-row">
                  <div className="flex flex-col items-center gap-6">
                    <div className="group relative cursor-pointer">
                      <Avatar className="border-secondary h-40 w-40 overflow-hidden rounded-[20px] border-4 shadow-xl">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="bg-secondary text-foreground rounded-[20px] text-3xl font-black">
                          {profile?.full_name?.substring(0, 2) || 'ME'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <HugeiconsIcon icon={Camera01Icon} size={32} className="text-white" />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-muted hover:bg-secondary h-10 rounded-full px-6 font-bold"
                    >
                      Change Photo
                    </Button>
                  </div>
                  <div className="w-full flex-1 space-y-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label className="text-muted-foreground ml-1 font-bold">Full Name</Label>
                        <Input
                          defaultValue={profile?.full_name}
                          className="bg-secondary h-14 rounded-[20px] border-none px-6 text-lg font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-muted-foreground ml-1 font-bold">Email</Label>
                        <Input
                          defaultValue={profile?.email}
                          disabled
                          className="bg-secondary/50 text-muted-foreground h-14 rounded-[20px] border-none px-6 text-lg font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-muted-foreground ml-1 font-bold">Phone</Label>
                        <Input
                          defaultValue={profile?.phone || ''}
                          placeholder="+1 234 567 890"
                          className="bg-secondary h-14 rounded-[20px] border-none px-6 text-lg font-medium"
                        />
                      </div>
                    </div>
                    <div className="pt-4 text-right">
                      <Button className="bg-primary h-14 rounded-[20px] px-10 font-bold text-white shadow-xl transition-transform hover:scale-105">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border-border/50 rounded-[20px] border p-10 shadow-sm"
              >
                <h2 className="text-foreground mb-10 flex items-center gap-4 text-2xl font-bold">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-[20px]">
                    <HugeiconsIcon icon={Tick02Icon} size={24} strokeWidth={2.5} />
                  </div>
                  Preferences
                </h2>
                <div className="space-y-6">
                  <div className="bg-secondary flex items-center justify-between rounded-[20px] p-6">
                    <Label className="text-foreground text-lg font-bold">
                      Public Profile (Social Features)
                    </Label>
                    <Switch checked={true} />
                  </div>
                  <div className="bg-secondary flex items-center justify-between rounded-[20px] p-6">
                    <Label className="text-foreground text-lg font-bold">
                      Share Goals Progress
                    </Label>
                    <Switch checked={false} />
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* IDENTITY TAB */}
          <TabsContent value="identity">
            <IdentityVerificationForm currentStatus={identityStatus} />
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border-border/50 rounded-[20px] border p-10 shadow-sm"
            >
              <h2 className="text-foreground mb-10 flex items-center gap-4 text-2xl font-bold">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-[20px]">
                  <HugeiconsIcon icon={LockIcon} size={24} strokeWidth={2.5} />
                </div>
                Password & Authentication
              </h2>
              <div className="space-y-6">
                <div className="bg-secondary flex items-center justify-between rounded-[20px] p-6">
                  <div>
                    <div className="text-foreground text-lg font-bold">Password</div>
                    <div className="text-muted-foreground mt-1 text-sm font-medium">
                      Last changed 30 days ago
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Password reset email sent!')}
                    className="border-muted h-10 rounded-full px-6 font-bold"
                  >
                    Change
                  </Button>
                </div>
                <div className="bg-secondary flex items-center justify-between rounded-[20px] p-6 opacity-60">
                  <div>
                    <div className="text-foreground text-lg font-bold">
                      Two-Factor Authentication
                    </div>
                    <div className="text-muted-foreground mt-1 text-sm font-medium">
                      Coming soon
                    </div>
                  </div>
                  <Switch disabled />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border-border/50 rounded-[20px] border p-10 shadow-sm"
            >
              <h2 className="text-foreground mb-10 flex items-center gap-4 text-2xl font-bold">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-[20px]">
                  <HugeiconsIcon icon={Notification02Icon} size={24} strokeWidth={2.5} />
                </div>
                Notification Preferences
              </h2>
              <div className="space-y-6">
                {Object.keys(notifications).map((key) => (
                  <div
                    key={key}
                    className="bg-secondary flex items-center justify-between rounded-[20px] p-6"
                  >
                    <div className="text-foreground text-lg font-bold capitalize">
                      {key} Updates
                    </div>
                    <Switch
                      checked={notifications[key as keyof typeof notifications]}
                      onCheckedChange={(c) => setNotifications({ ...notifications, [key]: c })}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
  );
}
