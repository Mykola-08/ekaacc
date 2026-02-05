'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, User, Bell, Lock, Target, CreditCard, ChevronRight, LogOut, Camera } from 'lucide-react';
import { IdentityVerificationForm } from '@/components/identity/IdentityVerificationForm';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DashboardLayout } from '../dashboard/layout/DashboardLayout';
import { DashboardHeader } from '../dashboard/layout/DashboardHeader';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

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
                        className="text-destructive hover:text-destructive bg-destructive/5 hover:bg-destructive/10 rounded-full px-4 h-10 font-bold" 
                        onClick={handleSignOut}
                    >
                        <LogOut className="w-4 h-4 mr-2" strokeWidth={2.5} />
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
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-8 rounded-[32px] shadow-sm">
                                <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-foreground">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="w-5 h-5" strokeWidth={2.5} />
                                    </div>
                                    Personal Information
                                </h2>
                                <div className="flex flex-col md:flex-row gap-10 items-start">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative group cursor-pointer">
                                            <Avatar className="w-32 h-32 rounded-[28px] border-4 border-secondary shadow-xl">
                                                <AvatarImage src={profile?.avatar_url} />
                                                <AvatarFallback className="bg-secondary text-foreground text-2xl font-black rounded-[28px]">{profile?.full_name?.substring(0, 2) || 'ME'}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 bg-black/40 rounded-[28px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="text-white w-8 h-8" />
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-full border-muted font-bold hover:bg-secondary">Change Photo</Button>
                                    </div>
                                    <div className="flex-1 space-y-6 w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label className="text-muted-foreground font-bold ml-1">Full Name</Label>
                                                <Input defaultValue={profile?.full_name} className="h-12 rounded-[16px] bg-secondary border-none font-medium px-4" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-muted-foreground font-bold ml-1">Email</Label>
                                                <Input defaultValue={profile?.email} disabled className="h-12 rounded-[16px] bg-secondary/50 border-none font-medium px-4 text-muted-foreground" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-muted-foreground font-bold ml-1">Phone</Label>
                                                <Input defaultValue={profile?.phone || ''} placeholder="+1 234 567 890" className="h-12 rounded-[16px] bg-secondary border-none font-medium px-4" />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <Button className="h-12 px-8 rounded-[16px] font-bold shadow-lg">Save Changes</Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card p-8 rounded-[32px] shadow-sm">
                                <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-foreground">
                                     <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Target className="w-5 h-5" strokeWidth={2.5} />
                                    </div>
                                    Preferences
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-secondary rounded-[20px]">
                                        <Label className="font-bold text-foreground">Public Profile (Social Features)</Label>
                                        <Switch checked={true} />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-secondary rounded-[20px]">
                                        <Label className="font-bold text-foreground">Share Goals Progress</Label>
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
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-8 rounded-[32px] shadow-sm">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-foreground">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Lock className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                Password & Authentication
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-5 bg-secondary rounded-[24px]">
                                    <div>
                                        <div className="font-bold text-foreground">Password</div>
                                        <div className="text-sm text-muted-foreground font-medium mt-1">Last changed 30 days ago</div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => toast.info('Password reset email sent!')} className="rounded-full border-muted font-bold">Change</Button>
                                </div>
                                <div className="flex justify-between items-center p-5 bg-secondary rounded-[24px] opacity-60">
                                    <div>
                                        <div className="font-bold text-[#222222]">Two-Factor Authentication</div>
                                        <div className="text-sm text-[#999999] font-medium mt-1">Coming soon</div>
                                    </div>
                                    <Switch disabled />
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* NOTIFICATIONS TAB */}
                    <TabsContent value="notifications">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-8 rounded-[32px] shadow-sm">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-foreground">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Bell className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                Notification Preferences
                            </h2>
                            <div className="space-y-4">
                                {Object.keys(notifications).map(key => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-secondary rounded-[20px]">
                                        <div className="capitalize font-bold text-foreground">{key} Updates</div>
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
