-- Migration to ensure 'service' table exists and matches booking-app requirements
-- Created: 2025-12-17

-- Create 'service' table if it doesn't exist
CREATE TABLE IF NOT EXISTS service (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  price integer NOT NULL CHECK (price >= 0),
  duration integer NOT NULL CHECK (duration > 0),
  image_url text,
  location text,
  version text,
  active boolean DEFAULT true
);

-- Add Stripe fields if they don't exist (in case previous migration didn't run or table was just created)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service' AND column_name = 'stripe_product_id') THEN
        ALTER TABLE service ADD COLUMN stripe_product_id text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service' AND column_name = 'stripe_price_id') THEN
        ALTER TABLE service ADD COLUMN stripe_price_id text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service' AND column_name = 'updated_at') THEN
        ALTER TABLE service ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
END $$;

-- Create index for Stripe lookups if not exists
CREATE INDEX IF NOT EXISTS service_stripe_product_id_idx ON service(stripe_product_id);

-- Enable RLS
ALTER TABLE service ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service' AND policyname = 'Enable read access for all users') THEN
        CREATE POLICY "Enable read access for all users" ON service FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service' AND policyname = 'Enable insert for authenticated users only') THEN
        CREATE POLICY "Enable insert for authenticated users only" ON service FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service' AND policyname = 'Enable update for authenticated users only') THEN
        CREATE POLICY "Enable update for authenticated users only" ON service FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;
END $$;
