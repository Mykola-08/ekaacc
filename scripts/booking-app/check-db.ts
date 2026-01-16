import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rbnfyxhewsivofvwdpuk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmZ5eGhld3Npdm9mdndkcHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTYzNDQsImV4cCI6MjA3ODYzMjM0NH0.beEFcpqzV7obLX0McrR-lK7V37RE0RbRTpVEKcub_Ko';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing credentials');
  process.exit(1);
}

console.log('Using URL:', supabaseUrl);
console.log('Using Key (first 10 chars):', supabaseKey.substring(0, 10));

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking services table...');
  const { data, error } = await supabase.from('service').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Data:', data);
  }
}

check();
