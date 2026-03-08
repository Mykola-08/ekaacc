import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for seeding

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
      name: 'Advanced Manual Therapy',
      description: 'Therapeutic approach to musculoskeletal dysfunction. Deep tissue mobilization and neuromuscular techniques to restore range of motion and eliminate chronic pain patterns.',
      base_price: 60,
      duration_minutes: 60,
      category: 'therapy',
      currency: 'EUR',
    },
    {
      name: 'Holistic Kinesiology',
      description: 'Precision diagnostic methodology using muscle response testing to identify physiological, structural, and emotional stressors affecting your systemic health.',
      base_price: 70,
      duration_minutes: 60,
      category: 'therapy',
      currency: 'EUR',
    },
    {
      name: 'Metabolic Optimization',
      description: 'Therapeutic nutritional strategies designed to reduce systemic inflammation, optimize metabolic function, and support neuro-endocrine regulation.',
      base_price: 60,
      duration_minutes: 60,
      category: 'nutrition',
      currency: 'EUR',
    },
    {
      name: '360° Comprehensive Assessment',
      description: 'An exhaustive evaluation of your biomechanics, posture, and metabolic status. Detailed wellness report and personalized therapeutic roadmap.',
      base_price: 280,
      duration_minutes: 90,
      category: 'review',
      currency: 'EUR',
    },
    {
      name: 'Corporate Wellness',
      description: 'Customized wellness programs for companies: from in-office massages to posture workshops.',
      base_price: 100,
      duration_minutes: 60,
      category: 'corporate',
      currency: 'EUR',
    },
  ];

  const { data, error } = await supabase.from('services').insert(services).select();

  if (error) {
    console.error('Error seeding services:', error);
  } else {
    console.log('Successfully seeded services:', data);
  }
}

seed();
