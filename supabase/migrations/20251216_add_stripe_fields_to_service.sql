-- Add Stripe fields and updated_at to service table
ALTER TABLE service 
ADD COLUMN IF NOT EXISTS stripe_product_id text,
ADD COLUMN IF NOT EXISTS stripe_price_id text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz default now();

-- Add index for lookups
CREATE INDEX IF NOT EXISTS service_stripe_product_id_idx ON service(stripe_product_id);
