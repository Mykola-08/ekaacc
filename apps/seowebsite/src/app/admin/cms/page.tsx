import { createClient } from '@/lib/supabase/server';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@ekaacc/shared-ui';
import Link from 'next/link';

export default async function CMSListPage() {
 const supabase = await createClient();
 const { data: pages, error } = await supabase.from('cms_pages').select('*').order('slug');

 if (error) {
  return <div className="p-8 text-red-500">Error loading pages: {error.message}</div>;
 }

 return (
  <div className="container mx-auto py-10 px-4">
   <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">CMS Pages</h1>
    <Link href="/admin/cms/new">
     <Button>Create Page</Button>
    </Link>
   </div>

   <div className="grid gap-4">
    {pages?.map((page) => (
     <Card key={page.id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
       <CardTitle className="text-xl font-medium">/{page.slug}</CardTitle>
       <Link href={`/admin/cms/${page.id}`}>
        <Button variant="outline" size="sm">Edit</Button>
       </Link>
      </CardHeader>
      <CardContent>
       <p className="text-sm text-gray-500">Last updated: {new Date(page.updated_at).toLocaleDateString()}</p>
      </CardContent>
     </Card>
    ))}
    {pages?.length === 0 && <p>No pages found.</p>}
   </div>
  </div>
 );
}
