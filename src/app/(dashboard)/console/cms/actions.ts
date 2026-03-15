'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getCmsPages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('cms_pages')
    .select('*, cms_page_translations(*)')
    .order('updated_at', { ascending: false });
  return data || [];
}

export async function createCmsPage(formData: FormData) {
  const supabase = await createClient();
  const slug = (formData.get('slug') as string)?.trim();
  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string) || '';
  const language = (formData.get('language') as string) || 'en';

  if (!slug || !title) return { error: 'Slug and title are required' };

  const { data: page, error: pageError } = await supabase
    .from('cms_pages')
    .insert({ slug })
    .select()
    .single();

  if (pageError) return { error: pageError.message };

  await supabase.from('cms_page_translations').insert({
    page_id: page.id,
    language_code: language,
    title,
    content,
  });

  revalidatePath('/console/cms');
  return { success: true };
}

export async function updateCmsPage(formData: FormData) {
  const supabase = await createClient();
  const pageId = formData.get('pageId') as string;
  const translationId = formData.get('translationId') as string;
  const slug = (formData.get('slug') as string)?.trim();
  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string) || '';

  if (!pageId || !slug || !title) return { error: 'Missing required fields' };

  await supabase.from('cms_pages').update({ slug }).eq('id', pageId);

  if (translationId) {
    await supabase
      .from('cms_page_translations')
      .update({ title, content })
      .eq('id', translationId);
  }

  revalidatePath('/console/cms');
  return { success: true };
}

export async function deleteCmsPage(pageId: string) {
  const supabase = await createClient();
  await supabase.from('cms_pages').delete().eq('id', pageId);
  revalidatePath('/console/cms');
  return { success: true };
}
