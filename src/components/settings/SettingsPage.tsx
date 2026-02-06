'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HugeiconsIcon } from "@hugeicons/react";
import { 
    UserIcon, 
    Notification02Icon, 
    LockIcon, 
    Tick02Icon, 
    Logout02Icon, 
    Camera01Icon
} from "@hugeicons/core-free-icons";
import { IdentityVerificationForm } from '@/components/identity/IdentityVerificationForm';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DashboardLayout } from '../dashboard/layout/DashboardLayout';
import { DashboardHeader } from '../dashboard/layout/DashboardHeader';
import { motion } from 'motion/react';

export function SettingsPage({ profile, identityStatus }: { profile: any, identityStatus: string }) {
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
        <DashboardLayout profile={profile}>
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
                <DashboardHeader 
                    title="Settings" 
                    subtitle="Manage your profile, security, and preferences."
                >
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive bg-destructive/5 hover:bg-destructive/10 rounded-full px-5 h-11 font-bold group" 
                        onClick={handleSignOut}
                    >
                        <HugeiconsIcon icon={Logout02Icon} size={18} strokeWidth={2.5} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </Button>
                </DashboardHeader>

                <Tabs defaultValue="profile" className="space-y-8">
                    <TabsList className="bg-secondary p-1.5 rounded-full inline-flex h-auto w-auto">
                        <TabsTrigger value="profile" className="rounded-full px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-md text-muted-foreground font-bold transition-all">Profile</TabsTrigger>
                        <TabsTrigger value="identity" className="rounded-full px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-md text-muted-foreground font-bold transition-all">Identity</TabsTrigger>
                        <TabsTrigger value="security" className="rounded-full px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-md text-muted-foreground font-bold transition-all">Security</TabsTrigger>
                        <TabsTrigger value="notifications" className="rounded-full px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-md text-muted-foreground font-bold transition-all">Notifications</TabsTrigger>
                    </TabsList>

                    {/* PROFILE TAB */}
                    <TabsContent value="profile">
                        <div className="grid gap-8">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-10 rounded-[36px] shadow-sm border border-border/50">
                                <h2 className="text-2xl font-bold mb-10 flex items-center gap-4 text-foreground">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={2.5} />
                                    </div>
                                    Personal Information
                                </h2>
                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative group cursor-pointer">
                                            <Avatar className="w-40 h-40 rounded-[32px] border-4 border-secondary shadow-xl overflow-hidden">
                                                <AvatarImage src={profile?.avatar_url} />
                                                <AvatarFallback className="bg-secondary text-foreground text-3xl font-black rounded-[32px]">{profile?.full_name?.substring(0, 2) || 'ME'}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 bg-black/40 rounded-[32px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <HugeiconsIcon icon={Camera01Icon} size={32} className="text-white" />
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-full border-muted font-bold hover:bg-secondary h-10 px-6">Change Photo</Button>
                                    </div>
                                    <div className="flex-1 space-y-8 w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-muted-foreground font-bold ml-1">Full Name</Label>
                                                <Input defaultValue={profile?.full_name} className="h-14 rounded-2xl bg-secondary border-none font-medium px-6 text-lg" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-muted-foreground font-bold ml-1">Email</Label>
                                                <Input defaultValue={profile?.email} disabled className="h-14 rounded-2xl bg-secondary/50 border-none font-medium px-6 text-lg text-muted-foreground" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-muted-foreground font-bold ml-1">Phone</Label>
                                                <Input defaultValue={profile?.phone || ''} placeholder="+1 234 567 890" className="h-14 rounded-2xl bg-secondary border-none font-medium px-6 text-lg" />
                                            </div>
                                        </div>
                                        <div className="pt-4 text-right">
                                            <Button className="h-14 px-10 rounded-2xl font-bold shadow-xl bg-primary text-white hover:scale-105 transition-transform">Save Changes</Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card p-10 rounded-[36px] shadow-sm border border-border/50">
                                <h2 className="text-2xl font-bold mb-10 flex items-center gap-4 text-foreground">
                                     <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <HugeiconsIcon icon={Tick02Icon} size={24} strokeWidth={2.5} />
                                    </div>
                                    Preferences
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-6 bg-secondary rounded-2xl">
                                        <Label className="font-bold text-lg text-foreground">Public Profile (Social Features)</Label>
                                        <Switch checked={true} />
                                    </div>
                                    <div className="flex items-center justify-between p-6 bg-secondary rounded-2xl">
                                        <Label className="font-bold text-lg text-foreground">Share Goals Progress</Label>
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
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-10 rounded-[36px] shadow-sm border border-border/50">
                            <h2 className="text-2xl font-bold mb-10 flex items-center gap-4 text-foreground">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <HugeiconsIcon icon={LockIcon} size={24} strokeWidth={2.5} />
                                </div>
                                Password & Authentication
                            </h2>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center p-6 bg-secondary rounded-2xl">
                                    <div>
                                        <div className="font-bold text-lg text-foreground">Password</div>
                                        <div className="text-sm text-muted-foreground font-medium mt-1">Last changed 30 days ago</div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => toast.info('Password reset email sent!')} className="rounded-full border-muted font-bold h-10 px-6">Change</Button>
                                </div>
                                <div className="flex justify-between items-center p-6 bg-secondary rounded-2xl opacity-60">
                                    <div>
                                        <div className="font-bold text-lg text-foreground">Two-Factor Authentication</div>
                                        <div className="text-sm text-muted-foreground font-medium mt-1">Coming soon</div>
                                    </div>
                                    <Switch disabled />
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* NOTIFICATIONS TAB */}
                    <TabsContent value="notifications">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-10 rounded-[36px] shadow-sm border border-border/50">
                            <h2 className="text-2xl font-bold mb-10 flex items-center gap-4 text-foreground">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <HugeiconsIcon icon={Notification02Icon} size={24} strokeWidth={2.5} />
                                </div>
                                Notification Preferences
                            </h2>
                            <div className="space-y-6">
                                {Object.keys(notifications).map(key => (
                                    <div key={key} className="flex items-center justify-between p-6 bg-secondary rounded-2xl">
                                        <div className="capitalize font-bold text-lg text-foreground">{key} Updates</div>
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
        </DashboardLayout>
    );
}
