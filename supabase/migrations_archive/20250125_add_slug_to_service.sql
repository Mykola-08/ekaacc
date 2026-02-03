-- Add slug to service table
ALTER TABLE service ADD COLUMN IF NOT EXISTS slug text UNIQUE;
CREATE INDEX IF NOT EXISTS idx_service_slug ON service(slug);

-- Update existing services with slugs based on name
UPDATE service SET slug = 'nutrition' WHERE name ILIKE '%Nutrició%';
UPDATE service SET slug = 'massage' WHERE name ILIKE '%Massage%' OR name ILIKE '%Massatge%';
UPDATE service SET slug = 'kinesiology' WHERE name ILIKE '%Kinesiolog%';
UPDATE service SET slug = 'agenyz' WHERE name ILIKE '%Agenyz%';
-- Fallback for others (slugify name)
UPDATE service SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;
