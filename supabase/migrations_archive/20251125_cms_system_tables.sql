-- CMS Tables Migration
-- This migration creates the necessary tables for the CMS system

-- CMS Pages table
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title TEXT,
  meta_description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CMS Posts table
CREATE TABLE IF NOT EXISTS cms_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  author_id UUID REFERENCES users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CMS Media table
CREATE TABLE IF NOT EXISTS cms_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table (if not exists)
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT,
  duration_minutes INTEGER DEFAULT 60,
  price_eur DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  benefits TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  square_service_id TEXT,
  stripe_product_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- System configurations table
CREATE TABLE IF NOT EXISTS system_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_encrypted BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status_created ON cms_pages(status, created_at);
CREATE INDEX IF NOT EXISTS idx_cms_posts_slug ON cms_posts(slug);
CREATE INDEX IF NOT EXISTS idx_cms_posts_status ON cms_posts(status);
CREATE INDEX IF NOT EXISTS idx_cms_posts_category ON cms_posts(category);
CREATE INDEX IF NOT EXISTS idx_cms_posts_status_created ON cms_posts(status, created_at);
CREATE INDEX IF NOT EXISTS idx_cms_posts_category_status ON cms_posts(category, status);
CREATE INDEX IF NOT EXISTS idx_cms_media_mime_type ON cms_media(mime_type);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_category_active ON services(category, is_active);
CREATE INDEX IF NOT EXISTS idx_system_configurations_key ON system_configurations(key);
CREATE INDEX IF NOT EXISTS idx_system_configurations_category ON system_configurations(category);

-- Enable Row Level Security
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_configurations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for CMS Pages
CREATE POLICY "Allow read access to published pages" ON cms_pages
  FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to manage pages" ON cms_pages
  FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for CMS Posts
CREATE POLICY "Allow read access to published posts" ON cms_posts
  FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to manage posts" ON cms_posts
  FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for CMS Media
CREATE POLICY "Allow read access to media" ON cms_media
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage media" ON cms_media
  FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for Services
CREATE POLICY "Allow read access to active services" ON services
  FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to manage services" ON services
  FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for System Configurations (restricted to authenticated users for read, admin for write)
CREATE POLICY "Allow authenticated users to read configurations" ON system_configurations
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Note: Full management access requires application-level admin role verification
-- The API layer validates admin role before allowing write operations
CREATE POLICY "Allow authenticated users to manage configurations" ON system_configurations
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Insert default system configurations
INSERT INTO system_configurations (key, value, description, category) VALUES
  ('app.name', 'EKA Account', 'Application name', 'general'),
  ('app.description', 'Therapy and wellness management platform', 'Application description', 'general'),
  ('app.timezone', 'Europe/Amsterdam', 'Default timezone', 'general'),
  ('app.currency', 'EUR', 'Default currency', 'general'),
  ('email.from_name', 'EKA Account', 'Default email sender name', 'email'),
  ('email.from_email', 'noreply@ekaacc.com', 'Default email sender address', 'email'),
  ('booking.min_advance_hours', '24', 'Minimum hours in advance for bookings', 'booking'),
  ('booking.max_advance_days', '30', 'Maximum days in advance for bookings', 'booking'),
  ('booking.cancellation_hours', '24', 'Hours before which cancellation is allowed', 'booking')
ON CONFLICT (key) DO NOTHING;
