import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import WorkspaceSettingsForm from './WorkspaceSettingsForm';

export default async function WorkspaceSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: userData } = await supabase
    .from('users')
    .select('role, tenant_id')
    .eq('id', user.id)
    .single();

  if (!userData || userData.role !== 'therapist') {
    redirect('/dashboard');
  }

  // Get current features
  const tenantId = userData.tenant_id || 'default';
  const { data: tenantFeatures } = await supabase
    .from('tenant_features')
    .select('features')
    .eq('tenant_id', tenantId)
    .maybeSingle();

  const currentFeatures = tenantFeatures?.features || {
    enable_kinesiology_module: false,
    enable_community: false,
    enable_supplements: false,
    enable_custom_anamnesis: false,
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Workspace Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage integrations and modules enabled for your clinic.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <WorkspaceSettingsForm initialFeatures={currentFeatures} />
      </div>
    </div>
  );
}
