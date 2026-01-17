
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Edit, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_id', user.id)
        .single();

    if (!profile) {
        redirect("/onboarding");
    }

    return (
        <DashboardLayout profile={profile}>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <DashboardHeader
                    title="My Profile"
                    subtitle="Manage your personal information and preferences."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Identity Card */}
                    <DashboardCard className="md:col-span-1">
                        <div className="flex flex-col items-center text-center space-y-4 py-4">
                            <div className="relative">
                                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                                    <AvatarImage src={profile.avatar_url} />
                                    <AvatarFallback className="text-3xl bg-secondary text-foreground">
                                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <Badge className="absolute bottom-0 right-0 rounded-full px-3 py-1 text-sm bg-primary text-primary-foreground border-2 border-background">
                                    Client
                                </Badge>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-foreground">{profile.first_name} {profile.last_name}</h2>
                                <p className="text-muted-foreground font-medium">@{profile.username || 'username'}</p>
                            </div>
                            <Button asChild variant="outline" className="rounded-full w-full border-border hover:bg-secondary">
                                <Link href="/settings">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Link>
                            </Button>
                        </div>
                    </DashboardCard>

                    {/* Details Card */}
                    <DashboardCard className="md:col-span-2" title="Personal Details" icon={User}>
                        <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                                    <div className="flex items-center gap-3 text-foreground font-medium p-3 bg-secondary/50 rounded-xl">
                                        <Mail className="w-5 h-5 text-primary opacity-60" />
                                        {profile.email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                                    <div className="flex items-center gap-3 text-foreground font-medium p-3 bg-secondary/50 rounded-xl">
                                        <Phone className="w-5 h-5 text-primary opacity-60" />
                                        {profile.phone || 'Not provided'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Member Since</label>
                                    <div className="flex items-center gap-3 text-foreground font-medium p-3 bg-secondary/50 rounded-xl">
                                        <Calendar className="w-5 h-5 text-primary opacity-60" />
                                        {new Date(profile.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account ID</label>
                                    <div className="flex items-center gap-3 text-foreground font-medium p-3 bg-secondary/50 rounded-xl font-mono text-sm">
                                        <Shield className="w-5 h-5 text-primary opacity-60" />
                                        {profile.id.substring(0, 8)}...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </DashboardLayout>
    );
}
