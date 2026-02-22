import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FeatureOverrideList } from '@/components/admin/FeatureOverrideList';
import { PurchaseLog } from '@/components/admin/PurchaseLog';

export default async function UserDeepControlPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Parallel Fetching
  const [profileRes, purchasesRes, enrollmentsRes, auditRes, featuresRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    supabase.from('external_purchases').select('*').eq('user_id', id).order('purchase_date', { ascending: false }),
    supabase.from('feature_enrollments').select('*').eq('user_id', id),
    supabase.from('audit_events').select('*').or(`actor_id.eq.${id},resource_id.eq.${id}`).order('created_at', { ascending: false }).limit(20),
    supabase.from('features').select('*').order('key')
  ]);

  const profile = profileRes.data;
  if (!profile) {
    return notFound();
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
            {profile.full_name?.[0] || '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{profile.full_name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground mt-1">
              <span>{profile.email}</span>
              <span className="hidden sm:inline">•</span>
              <Badge variant="secondary" className="capitalize w-fit">{profile.role}</Badge>
              <span className="hidden sm:inline">•</span>
              <span className="font-mono text-xs">{id}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Reset Password</Button>
          <Button variant="destructive">Impersonate</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Feature Flags</TabsTrigger>
          <TabsTrigger value="purchases">Purchases & Agency</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={profile.full_name} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={profile.email || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue={profile.phone || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input defaultValue={profile.city || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Trust Score</Label>
                <Input defaultValue={profile.trust_score} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Verification Level</Label>
                <Input defaultValue={profile.verification_level} readOnly />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FEATURES TAB */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureOverrideList
                userId={id}
                enrollments={enrollmentsRes.data || []}
                allFeatures={featuresRes.data || []}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* PURCHASES TAB */}
        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>External Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <PurchaseLog userId={id} purchases={purchasesRes.data || []} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* AUDIT TAB */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-0 border rounded-md divide-y">
                 {auditRes.data?.map((log: any) => (
                   <div key={log.id} className="p-3 hover:bg-muted/50 transition-colors">
                     <div className="flex justify-between items-start mb-1">
                       <span className="font-semibold text-sm">{log.event_type}</span>
                       <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</span>
                     </div>
                     <div className="text-xs text-muted-foreground break-all font-mono bg-muted/30 p-1.5 rounded">
                       {JSON.stringify(log.metadata)}
                     </div>
                   </div>
                 ))}
                 {(!auditRes.data || auditRes.data.length === 0) && (
                    <div className="p-8 text-center text-muted-foreground">No audit logs found.</div>
                 )}
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
