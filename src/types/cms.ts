export interface CMSPage {
  id: string;
  slug: string;
  created_at: string;
  updated_at: string;
  translations?: CMSPageTranslation[];
}

export interface CMSPageTranslation {
  id: string;
  page_id: string;
  language_code: string;
  title: string;
  content: string;
  hero_image_url?: string;
  seo_title?: string;
  seo_description?: string;
}
