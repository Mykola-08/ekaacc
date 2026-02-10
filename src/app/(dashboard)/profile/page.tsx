export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Calendar, Edit, Shield } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  if (!profile) {
    redirect('/onboarding');
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-10 px-4 py-8 pb-20 duration-700 md:px-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">My Profile</h2>
        <p className="text-sm font-medium text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Identity Card */}
        <Card className="rounded-2xl border-border bg-card shadow-sm md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-6 py-4 text-center">
              <div className="group relative">
                <Avatar className="h-40 w-40 rounded-2xl border-8 border-muted shadow-2xl">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="rounded-2xl bg-muted text-4xl font-black text-foreground">
                    {profile.first_name?.[0]}
                    {profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute right-4 -bottom-2 rounded-full border-4 border-card bg-primary px-4 py-1.5 text-xs font-bold tracking-wider text-primary-foreground uppercase shadow-lg">
                  Client
                </Badge>
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight text-foreground">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-lg font-medium text-muted-foreground">
                  @{profile.username || 'username'}
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-full font-bold"
              >
                <Link href="/settings">
                  <Edit className="mr-2 h-4 w-4" strokeWidth={2.5} />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="rounded-2xl border-border bg-card shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Email Address
                  </label>
                  <div className="flex items-center gap-4 rounded-xl bg-muted p-5 text-lg font-bold text-foreground">
                    <Mail className="h-5 w-5 text-primary" strokeWidth={2.5} />
                    {profile.email}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-4 rounded-xl bg-muted p-5 text-lg font-bold text-foreground">
                    <Phone className="h-5 w-5 text-primary" strokeWidth={2.5} />
                    {profile.phone || 'Not provided'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Member Since
                  </label>
                  <div className="flex items-center gap-4 rounded-xl bg-muted p-5 text-lg font-bold text-foreground">
                    <Calendar className="h-5 w-5 text-primary" strokeWidth={2.5} />
                    {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Account ID
                  </label>
                  <div className="flex items-center gap-4 rounded-xl bg-muted p-5 font-mono text-base text-lg font-bold text-foreground">
                    <Shield className="h-5 w-5 text-primary" strokeWidth={2.5} />
                    {profile.id.substring(0, 8)}...
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
