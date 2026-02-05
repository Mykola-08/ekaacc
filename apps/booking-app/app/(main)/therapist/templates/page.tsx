import { getTemplates } from '@/server/therapist/templates';
import { TemplateList } from '@/components/therapist/templates/TemplateList';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Suspense fallback={<div>Loading templates...</div>}>
        <TemplateList templates={templates} />
      </Suspense>
    </div>
  );
}
