-- Create bucket for CMS images
INSERT INTO storage.buckets (id, name, public) VALUES ('cms_images', 'cms_images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read of CMS images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'cms_images' );

-- Policy to allow authenticated users (admins) to upload/update/delete
-- Assuming 'authenticated' role is sufficient for now, or restrict to specific permissions
CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'cms_images' );
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'cms_images' );
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'cms_images' );


-- CMS Pages Table
CREATE TABLE IF NOT EXISTS public.cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CMS Page Translations Table
CREATE TABLE IF NOT EXISTS public.cms_page_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.cms_pages(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL, -- e.g., 'en', 'es'
    title TEXT,
    content TEXT, -- Markdown or HTML or simple text
    hero_image_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(page_id, language_code)
);

-- Enable RLS
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_page_translations ENABLE ROW LEVEL SECURITY;

-- Policies for CMS Pages
CREATE POLICY "Public Read Pages" ON public.cms_pages FOR SELECT USING (true);
CREATE POLICY "Admin All Pages" ON public.cms_pages FOR ALL TO authenticated USING (true);

-- Policies for CMS Translations
CREATE POLICY "Public Read Translations" ON public.cms_page_translations FOR SELECT USING (true);
CREATE POLICY "Admin All Translations" ON public.cms_page_translations FOR ALL TO authenticated USING (true);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_cms_pages_modtime
    BEFORE UPDATE ON public.cms_pages
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_cms_page_translations_modtime
    BEFORE UPDATE ON public.cms_page_translations
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
