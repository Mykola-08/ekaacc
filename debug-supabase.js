// Debug Supabase connection
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Debugging Supabase Connection...\n');

async function debugSupabaseConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('1️⃣ Environment Variables:');
  console.log(`   URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Key: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('   ❌ Cannot test - missing credentials');
    return;
  }
  
  console.log('\n2️⃣ Testing direct API connection...');
  
  try {
    // Test 1: Basic connectivity
    const healthResponse = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
    console.log(`   Health check: ${healthResponse.status} ${healthResponse.statusText}`);
    
    // Test 2: Try to query users table
    console.log('\n3️⃣ Testing users table query...');
    const usersResponse = await fetch(`${supabaseUrl}/rest/v1/users?select=id&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    console.log(`   Users query: ${usersResponse.status} ${usersResponse.statusText}`);
    
    if (usersResponse.status === 404) {
      console.log('   ⚠️  Users table not found - may need to create it');
    } else if (usersResponse.status === 403) {
      console.log('   ⚠️  Permission denied - check RLS policies');
    } else if (usersResponse.ok) {
      const data = await usersResponse.json();
      console.log(`   ✅ Users table accessible (${data.length} rows)`);
    }
    
    // Test 3: Try subscription tiers
    console.log('\n4️⃣ Testing subscription_tiers table...');
    const tiersResponse = await fetch(`${supabaseUrl}/rest/v1/subscription_tiers?select=id&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    console.log(`   Tiers query: ${tiersResponse.status} ${tiersResponse.statusText}`);
    
    if (tiersResponse.status === 404) {
      console.log('   ⚠️  Subscription tiers table not found');
    } else if (tiersResponse.ok) {
      const data = await tiersResponse.json();
      console.log(`   ✅ Subscription tiers accessible (${data.length} rows)`);
    }
    
    // Test 4: Check project info
    console.log('\n5️⃣ Testing project info...');
    const projectResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey
      }
    });
    
    if (projectResponse.ok) {
      const info = await projectResponse.json();
      console.log(`   ✅ Project info accessible`);
    }
    
  } catch (error) {
    console.log(`   ❌ Connection error: ${error.message}`);
  }
}

// Test with our actual Supabase client
console.log('\n6️⃣ Testing Supabase client...');
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('   ❌ Missing Supabase configuration');
    return;
  }
  
  const client = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test auth
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError) {
      console.log(`   Auth error: ${authError.message}`);
    } else {
      console.log(`   ✅ Auth service: ${user ? 'User authenticated' : 'No user'}`);
    }
    
    // Test database
    const { data, error } = await client.from('users').select('id').limit(1);
    if (error) {
      console.log(`   Database error: ${error.message}`);
    } else {
      console.log(`   ✅ Database: ${data ? `${data.length} rows` : 'No data'}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Client error: ${error.message}`);
  }
}

async function runDebug() {
  await debugSupabaseConnection();
  await testSupabaseClient();
  
  console.log('\n🔍 Debug Summary:');
  console.log('- Check if tables exist in Supabase dashboard');
  console.log('- Verify RLS (Row Level Security) policies');
  console.log('- Ensure proper permissions for anon/authenticated roles');
  console.log('- Check network connectivity to Supabase');
}

runDebug().catch(console.error);