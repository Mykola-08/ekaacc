import { createClient } from '@/lib/supabase/server';
import { PageForm } from '@/components/cms/PageForm';

export default async function CMSEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === 'new') {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold">Create New Page</h1>
        <PageForm />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: page, error } = await supabase
    .from('cms_pages')
    .select('*, translations:cms_page_translations(*)')
    .eq('id', id)
    .single();

  if (error || !page) {
    return <div className="p-8">Page not found or error loading: {error?.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Edit Page: /{page.slug}</h1>
      <PageForm initialData={page} />
    </div>
  );
}
