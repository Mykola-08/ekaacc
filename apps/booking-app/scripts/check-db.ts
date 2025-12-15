import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rbnfyxhewsivofvwdpuk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmZ5eGhld3Npdm9mdndkcHVrIiwicm9zZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA1NjM0NCwiZXhwIjoyMDc4NjMyMzQ0fQ.5gzhfCb4GwDII-H6SFjhGegKa-Pk_aDxrOQkVVaGuMA';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking service table...');
  const { data, error } = await supabase.from('service').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Data:', data);
  }
}

check();
