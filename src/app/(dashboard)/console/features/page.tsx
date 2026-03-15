import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { FeatureTree } from './feature-tree';

export default async function ConsoleFeatureMatrixPage() {
  const supabase = await createClient();
  const { data: features } = await supabase.from('features').select('*').order('key');

  if (!features || features.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-semibold">No Features Defined</h2>
        <p className="text-muted-foreground mb-4">Get started by adding your first feature flag.</p>
        <Button>Initialize Defaults</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <FeatureTree features={features} />
    </div>
  );
}
