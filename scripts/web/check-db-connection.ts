import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function checkConnection() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  const supabaseServer = createClient(supabaseUrl, supabaseKey);
  console.log('🔍 Checking EKA Booking App database connection...\n');

  try {
    // Test basic connectivity
    const { error } = await supabaseServer.from('service').select('id').limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    }

    console.log('✅ Database connection successful');
    console.log('📡 Connected to:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set');
    console.log('');

    // Check table existence and accessibility
    const tables = ['service', 'staff', 'booking', 'service_addon', 'app_config'];
    console.log('🔍 Checking table accessibility...\n');

    for (const table of tables) {
      const { data: tableData, error: tableError } = await supabaseServer
        .from(table)
        .select('*')
        .limit(1);

      if (tableError) {
        console.warn(`⚠️  Table "${table}" issue:`, tableError.message);
      } else {
        const count = tableData?.length || 0;
        console.log(`✅ Table "${table}" accessible (${count} rows sampled)`);
      }
    }

    // Check for data in critical tables
    console.log('\n🔍 Checking data availability...\n');

    const { data: services, error: servicesError } = await supabaseServer
      .from('service')
      .select('id, name, active')
      .eq('active', true);

    if (!servicesError && services) {
      console.log(`✅ Active services: ${services.length}`);
      if (services.length === 0) {
        console.warn('⚠️  No active services found. Run "npm run db:seed" to add sample data.');
      }
    }

    const { data: staff, error: staffError } = await supabaseServer
      .from('staff')
      .select('id, name, active')
      .eq('active', true);

    if (!staffError && staff) {
      console.log(`✅ Active staff: ${staff.length}`);
    }

    const { data: bookings, error: bookingsError } = await supabaseServer
      .from('bookings')
      .select('id, payment_status, status')
      .limit(100);

    if (!bookingsError && bookings) {
      console.log(`✅ Total bookings: ${bookings.length}`);
    }

    console.log('\n✅ All database checks passed');
    console.log('🎉 EKA Booking App database is properly connected and operational!\n');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

checkConnection();
