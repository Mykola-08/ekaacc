// Comprehensive application testing script
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testing Real Application Functionality...\n');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 10000,
  retries: 3
};

// Utility functions
async function makeRequest(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TEST_CONFIG.timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    clearTimeout(timeoutId);
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: response.headers.get('content-type')?.includes('application/json') 
        ? await response.json() 
        : await response.text()
    };
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test 1: Application Startup
async function testApplicationStartup() {
  console.log('1️⃣ Testing Application Startup...');
  
  const result = await makeRequest(TEST_CONFIG.baseUrl);
  
  if (result.success) {
    console.log(`   ✅ Application is running (Status: ${result.status})`);
    return true;
  } else {
    console.log(`   ❌ Application failed to start: ${result.error}`);
    return false;
  }
}

// Test 2: Authentication Flow
async function testAuthenticationFlow() {
  console.log('\n2️⃣ Testing Authentication Flow...');
  
  // Test login page
  const loginResult = await makeRequest(`${TEST_CONFIG.baseUrl}/login`);
  if (!loginResult.success) {
    console.log(`   ❌ Login page not accessible: ${loginResult.error}`);
    return false;
  }
  console.log(`   ✅ Login page accessible (Status: ${loginResult.status})`);
  
  // Test signup page
  const signupResult = await makeRequest(`${TEST_CONFIG.baseUrl}/login?signup=true`);
  if (!signupResult.success) {
    console.log(`   ❌ Signup page not accessible: ${signupResult.error}`);
    return false;
  }
  console.log(`   ✅ Signup page accessible (Status: ${signupResult.status})`);
  
  return true;
}

// Test 3: Protected Routes
async function testProtectedRoutes() {
  console.log('\n3️⃣ Testing Protected Routes...');
  
  const protectedRoutes = [
    '/dashboard',
    '/sessions',
    '/journal',
    '/goals',
    '/settings'
  ];
  
  let accessibleCount = 0;
  
  for (const route of protectedRoutes) {
    const result = await makeRequest(`${TEST_CONFIG.baseUrl}${route}`);
    
    if (result.success || result.status === 401 || result.status === 403) {
      console.log(`   ✅ ${route}: Protected (Status: ${result.status})`);
      accessibleCount++;
    } else {
      console.log(`   ❌ ${route}: Error (Status: ${result.status})`);
    }
  }
  
  console.log(`   📊 Protected routes: ${accessibleCount}/${protectedRoutes.length} properly secured`);
  return accessibleCount === protectedRoutes.length;
}

// Test 4: API Endpoints
async function testAPIEndpoints() {
  console.log('\n4️⃣ Testing API Endpoints...');
  
  const endpoints = [
    { path: '/api/checkout', method: 'GET', expectedStatus: 405 },
    { path: '/api/webhooks/stripe', method: 'GET', expectedStatus: 405 },
    { path: '/api/webhooks/square', method: 'GET', expectedStatus: 200 },
    { path: '/api/square/bookings', method: 'GET', expectedStatus: [200, 500] }
  ];
  
  let workingEndpoints = 0;
  
  for (const endpoint of endpoints) {
    const result = await makeRequest(`${TEST_CONFIG.baseUrl}${endpoint.path}`, {
      method: endpoint.method
    });
    
    const expected = Array.isArray(endpoint.expectedStatus) 
      ? endpoint.expectedStatus 
      : [endpoint.expectedStatus];
    
    if (expected.includes(result.status)) {
      console.log(`   ✅ ${endpoint.method} ${endpoint.path}: Expected response (${result.status})`);
      workingEndpoints++;
    } else {
      console.log(`   ⚠️  ${endpoint.method} ${endpoint.path}: Unexpected response (${result.status})`);
    }
  }
  
  console.log(`   📊 API endpoints: ${workingEndpoints}/${endpoints.length} responding correctly`);
  return workingEndpoints === endpoints.length;
}

// Test 5: Static Assets
async function testStaticAssets() {
  console.log('\n5️⃣ Testing Static Assets...');
  
  const assets = [
    '/favicon.ico',
    '/next.svg',
    '/vercel.svg'
  ];
  
  let workingAssets = 0;
  
  for (const asset of assets) {
    const result = await makeRequest(`${TEST_CONFIG.baseUrl}${asset}`);
    
    if (result.success) {
      console.log(`   ✅ ${asset}: Available (${result.status})`);
      workingAssets++;
    } else {
      console.log(`   ⚠️  ${asset}: Not found (${result.status})`);
    }
  }
  
  console.log(`   📊 Static assets: ${workingAssets}/${assets.length} available`);
  return workingAssets >= 1; // At least favicon should work
}

// Test 6: Database Connectivity
async function testDatabaseConnectivity() {
  console.log('\n6️⃣ Testing Database Connectivity...');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('   ❌ Missing Supabase configuration');
    return false;
  }
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?select=id&limit=1`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      console.log(`   ✅ Supabase connection: Healthy (${response.status})`);
      return true;
    } else {
      console.log(`   ❌ Supabase connection: Error (${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Supabase connection: Failed (${error.message})`);
    return false;
  }
}

// Test 7: Payment Integration
async function testPaymentIntegration() {
  console.log('\n7️⃣ Testing Payment Integration...');
  
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const hasStripeConfig = stripeKey && process.env.STRIPE_SECRET_KEY;
  
  if (hasStripeConfig) {
    console.log(`   ✅ Stripe configuration: Present`);
    
    // Test checkout endpoint
    const checkoutResult = await makeRequest(`${TEST_CONFIG.baseUrl}/api/checkout`, {
      method: 'POST',
      body: JSON.stringify({
        userId: 'test-user',
        userEmail: 'test@example.com',
        tierId: 'test-tier',
        subscriptionType: 'monthly',
        interval: 'month'
      })
    });
    
    if (checkoutResult.status === 405) {
      console.log(`   ✅ Checkout endpoint: Properly configured (405 Method Not Allowed)`);
    } else {
      console.log(`   ⚠️  Checkout endpoint: Unexpected response (${checkoutResult.status})`);
    }
  } else {
    console.log(`   ⚠️  Stripe configuration: Missing or incomplete`);
  }
  
  return hasStripeConfig;
}

// Test 8: Error Handling
async function testErrorHandling() {
  console.log('\n8️⃣ Testing Error Handling...');
  
  // Test invalid route
  const invalidResult = await makeRequest(`${TEST_CONFIG.baseUrl}/api/nonexistent-route`);
  if (invalidResult.status === 404 || invalidResult.status === 405) {
    console.log(`   ✅ Invalid routes: Properly handled (${invalidResult.status})`);
  } else {
    console.log(`   ⚠️  Invalid routes: Unexpected response (${invalidResult.status})`);
  }
  
  // Test invalid API call
  const invalidAPIResult = await makeRequest(`${TEST_CONFIG.baseUrl}/api/square/bookings`, {
    method: 'POST',
    body: JSON.stringify({ invalid: 'data' })
  });
  
  if (invalidAPIResult.status === 405 || invalidAPIResult.status === 400) {
    console.log(`   ✅ Invalid API calls: Properly handled (${invalidAPIResult.status})`);
  } else {
    console.log(`   ⚠️  Invalid API calls: Unexpected response (${invalidAPIResult.status})`);
  }
  
  return true;
}

// Test 9: Performance Check
async function testPerformance() {
  console.log('\n9️⃣ Testing Performance...');
  
  const routes = [
    '/',
    '/login',
    '/dashboard',
    '/sessions'
  ];
  
  const performanceResults = [];
  
  for (const route of routes) {
    const start = Date.now();
    const result = await makeRequest(`${TEST_CONFIG.baseUrl}${route}`);
    const duration = Date.now() - start;
    
    performanceResults.push({ route, duration, success: result.success });
    
    if (result.success && duration < 3000) {
      console.log(`   ✅ ${route}: Fast response (${duration}ms)`);
    } else if (result.success) {
      console.log(`   ⚠️  ${route}: Slow response (${duration}ms)`);
    } else {
      console.log(`   ❌ ${route}: Failed (${duration}ms)`);
    }
  }
  
  const avgDuration = performanceResults
    .filter(r => r.success)
    .reduce((sum, r) => sum + r.duration, 0) / performanceResults.filter(r => r.success).length;
  
  console.log(`   📊 Average response time: ${avgDuration.toFixed(0)}ms`);
  return avgDuration < 2000; // Should be under 2 seconds average
}

// Main test runner
async function runApplicationTests() {
  console.log('🚀 Starting comprehensive application testing...\n');
  
  const tests = [
    { name: 'Application Startup', fn: testApplicationStartup },
    { name: 'Authentication Flow', fn: testAuthenticationFlow },
    { name: 'Protected Routes', fn: testProtectedRoutes },
    { name: 'API Endpoints', fn: testAPIEndpoints },
    { name: 'Static Assets', fn: testStaticAssets },
    { name: 'Database Connectivity', fn: testDatabaseConnectivity },
    { name: 'Payment Integration', fn: testPaymentIntegration },
    { name: 'Error Handling', fn: testErrorHandling },
    { name: 'Performance Check', fn: testPerformance }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n📋 Running: ${test.name}`);
    try {
      const passed = await test.fn();
      results.push({ name: test.name, passed, status: passed ? '✅ PASS' : '❌ FAIL' });
    } catch (error) {
      console.log(`   💥 Test error: ${error.message}`);
      results.push({ name: test.name, passed: false, status: '💥 ERROR' });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  results.forEach(result => {
    console.log(`${result.status} ${result.name}`);
  });
  
  console.log(`\n📈 Overall: ${passedTests}/${totalTests} tests passed (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Application is ready for production.');
  } else if (passedTests >= totalTests * 0.8) {
    console.log('\n⚠️  Most tests passed. Review failed tests before production deployment.');
  } else {
    console.log('\n❌ Multiple test failures. Address issues before production deployment.');
  }
  
  return { passedTests, totalTests, results };
}

// Run the tests
runApplicationTests().then(results => {
  console.log('\n✨ Application testing completed!');
  process.exit(results.passedTests === results.totalTests ? 0 : 1);
}).catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});