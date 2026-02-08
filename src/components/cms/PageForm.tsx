'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface CMSPageTranslation {
  language_code: string;
  title: string;
  content: string;
  hero_image_url: string;
  seo_title: string;
  seo_description: string;
}

interface CMSPage {
  id?: string;
  slug: string;
  translations: CMSPageTranslation[];
}

const LANGUAGES = ['en', 'de', 'es', 'fr', 'it'];

export function PageForm({ initialData }: { initialData?: CMSPage }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [activeLang, setActiveLang] = useState('en');

  // Initialize translations map
  const [translations, setTranslations] = useState<Record<string, CMSPageTranslation>>(() => {
    const map: Record<string, CMSPageTranslation> = {};
    LANGUAGES.forEach((lang) => {
      const existing = initialData?.translations?.find((t) => t.language_code === lang);
      map[lang] = existing || {
        language_code: lang,
        title: '',
        content: '',
        hero_image_url: '',
        seo_title: '',
        seo_description: '',
      };
    });
    return map;
  });

  const handleUpdateTranslation = (field: keyof CMSPageTranslation, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value,
      },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${slug || 'temp'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('cms_images').getPublicUrl(filePath);

      handleUpdateTranslation('hero_image_url', data.publicUrl);
    } catch (err: any) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // 1. Upsert Page
      let pageId = initialData?.id;

      if (!pageId) {
        // Create
        const { data, error } = await supabase.from('cms_pages').insert({ slug }).select().single();
        if (error) throw error;
        pageId = data.id;
      } else {
        // Update slug if changed
        const { error } = await supabase.from('cms_pages').update({ slug }).eq('id', pageId);
        if (error) throw error;
      }

      // 2. Upsert Translations
      // Prepare upsert data
      const upsertData = Object.values(translations)
        .filter((t) => t.title || t.content) // Only save if has content
        .map((t) => ({
          page_id: pageId,
          language_code: t.language_code,
          title: t.title,
          content: t.content,
          hero_image_url: t.hero_image_url,
          seo_title: t.seo_title,
          seo_description: t.seo_description,
        }));

      if (upsertData.length > 0) {
        const { error: transError } = await supabase
          .from('cms_page_translations')
          .upsert(upsertData, { onConflict: 'page_id,language_code' });

        if (transError) throw transError;
      }

      router.push('/admin/cms');
      router.refresh();
    } catch (err: any) {
      alert('Error saving: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card max-w-4xl space-y-6 rounded-lg p-6 shadow">
      {/* Global Settings */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Page Slug (URL Path)</label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. services/coaching"
        />
      </div>

      {/* Language Tabs */}
      <div className="flex space-x-2 border-b">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveLang(lang)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeLang === lang
                ? 'border-blue-500 text-blue-600'
                : 'text-muted-foreground hover:text-foreground/90 border-transparent'
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* active Translation Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold uppercase">{activeLang} Content</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Page Title</label>
          <Input
            value={translations[activeLang].title}
            onChange={(e) => handleUpdateTranslation('title', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">SEO Title</label>
          <Input
            value={translations[activeLang].seo_title}
            onChange={(e) => handleUpdateTranslation('seo_title', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hero Image</label>
          <div className="flex items-center gap-4">
            {translations[activeLang].hero_image_url && (
              <img
                src={translations[activeLang].hero_image_url}
                alt="Hero"
                className="h-20 w-20 rounded border object-cover"
              />
            )}
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Content (HTML/Markdown)</label>
          <textarea
            className="min-h-[300px] w-full rounded-md border p-2 font-mono text-sm"
            value={translations[activeLang].content}
            onChange={(e) => handleUpdateTranslation('content', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Page'}
        </Button>
      </div>
    </div>
  );
}
