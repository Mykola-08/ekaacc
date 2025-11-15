// Integration test script to verify real backend connections
const https = require('https');
const http = require('http');

console.log('🧪 Testing Real Backend Integrations...\n');

// Test 1: Verify Supabase connection
async function testSupabaseConnection() {
  console.log('1️⃣ Testing Supabase Connection...');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/?apikey=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
    console.log(`   ✅ Supabase API reachable: ${response.status}`);
    return response.ok;
  } catch (error) {
    console.log(`   ❌ Supabase connection failed: ${error.message}`);
    return false;
  }
}

// Test 2: Verify local API routes
async function testLocalAPIRoutes() {
  console.log('\n2️⃣ Testing Local API Routes...');
  const routes = [
    '/api/checkout',
    '/api/webhooks/stripe',
    '/api/webhooks/square',
    '/api/square/bookings'
  ];
  
  for (const route of routes) {
    try {
      const response = await fetch(`http://localhost:3000${route}`);
      console.log(`   ✅ ${route}: ${response.status}`);
    } catch (error) {
      console.log(`   ❌ ${route}: ${error.message}`);
    }
  }
}

// Test 3: Check environment variables
function testEnvironmentVariables() {
  console.log('\n3️⃣ Testing Environment Variables...');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName}: Set`);
    } else {
      console.log(`   ❌ ${varName}: Missing`);
    }
  });
}

// Test 4: Verify no mock data references
async function checkForMockReferences() {
  console.log('\n4️⃣ Checking for Mock Data References...');
  const fs = require('fs');
  const path =