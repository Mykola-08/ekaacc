'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, User, Bell, Lock, Target, CreditCard, ChevronRight, LogOut } from 'lucide-react';
import { IdentityVerificationForm } from '@/components/identity/IdentityVerificationForm';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
        <div className="container max-w-4xl py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your account preferences</p>
                </div>
                <Button variant="ghost" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="identity">Identity</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                {/* PROFILE TAB */}
                <TabsContent value="profile" className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" /> Personal Information
                        </h2>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex flex-col items-center gap-2">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={profile?.avatar_url} />
                                    <AvatarFallback>{profile?.full_name?.substring(0, 2) || 'ME'}</AvatarFallback>
                                </Avatar>
                                <Button variant="outline" size="sm">Change Photo</Button>
                            </div>
                            <div className="flex-1 space-y-4 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input defaultValue={profile?.full_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input defaultValue={profile?.email} disabled className="bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input defaultValue={profile?.phone || ''} placeholder="+1 234 567 890" />
                                    </div>
                                </div>
                                <Button className="mt-4">Save Changes</Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5" /> Preferences
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Public Profile (Social Features)</Label>
                                <Switch checked={true} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Share Goals Progress</Label>
                                <Switch checked={false} />
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* IDENTITY TAB */}
                <TabsContent value="identity" className="space-y-6">
                    <IdentityVerificationForm currentStatus={identityStatus} />
                </TabsContent>

                {/* SECURITY TAB */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5" /> Password & Authentication
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 border rounded-lg">
                                <div>
                                    <div className="font-medium">Password</div>
                                    <div className="text-sm text-muted-foreground">Last changed 30 days ago</div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => toast.info('Password reset email sent!')}>Change</Button>
                            </div>
                            <div className="flex justify-between items-center p-3 border rounded-lg opacity-50">
                                <div>
                                    <div className="font-medium">Two-Factor Authentication</div>
                                    <div className="text-sm text-muted-foreground">Coming soon</div>
                                </div>
                                <Switch disabled />
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* NOTIFICATIONS TAB */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5" /> Notification Preferences
                        </h2>
                        <div className="space-y-4">
                            {Object.keys(notifications).map(key => (
                                <div key={key} className="flex items-center justify-between py-2">
                                    <div className="capitalize">{key} Updates</div>
                                    <Switch
                                        checked={notifications[key as keyof typeof notifications]}
                                        onCheckedChange={(c) => setNotifications({ ...notifications, [key]: c })}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
