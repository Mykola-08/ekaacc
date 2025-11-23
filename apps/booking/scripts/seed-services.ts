import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY; // Use service role key for seeding

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding services...');
  
  const services = [
    {
      name: 'Standard Haircut',
      description: 'A classic haircut with scissors and clippers.',
      price: 30,
      duration: 30
    },
    {
      name: 'Premium Haircut & Beard',
      description: 'Full service haircut including beard trim and hot towel.',
      price: 55,
      duration: 60
    },
    {
      name: 'Express Cut',
      description: 'Quick dry cut for those in a hurry.',
      price: 25,
      duration: 20
    }
  ];

  const { data, error } = await supabase.from('services').insert(services).select();

  if (error) {
    console.error('Error seeding services:', error);
  } else {
    console.log('Successfully seeded services:', data);
  }
}

seed();
