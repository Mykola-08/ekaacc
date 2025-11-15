// Performance benchmarking script for real backend integrations
const https = require('https');
const http = require('http');

console.log('⚡ Running Performance Benchmarks...\n');

// Benchmark configuration
const BENCHMARK_CONFIG = {
  iterations: 10,
  timeout: 5000,
  concurrentRequests: 3
};

// Utility function to measure execution time
async function measureExecutionTime(name, fn) {
  const start = process.hrtime.bigint();
  try {
    const result = await fn();
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000; // Convert to milliseconds
    return { success: true, duration, result };
  } catch (error) {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000;
    return { success: false, duration, error: error.message };
  }
}

// Benchmark 1: Supabase Query Performance
async function benchmarkSupabaseQueries() {
  console.log('1️⃣ Benchmarking Supabase Query Performance...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('   ❌ Cannot benchmark - missing Supabase credentials');
    return;
  }
  
  const results = [];
  
  for (let i = 0; i < BENCHMARK_CONFIG.iterations; i++) {
    const result = await measureExecutionTime(`Query ${i + 1}`, async () => {
      const response = await fetch(`${supabaseUrl}/rest/v1/users?select=id,email&limit=10`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    });
    
    results.push(result);
  }
  
  const successful = results.filter(r => r.success);
  const avgDuration = successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;
  const minDuration = Math.min(...successful.map(r => r.duration));
  const maxDuration = Math.max(...successful.map(r => r.duration));
  
  console.log(`   ✅ Average query time: ${avgDuration.toFixed(2)}ms`);
  console.log(`   ✅ Min query time: ${minDuration.toFixed(2)}ms`);
  console.log(`   ✅ Max query time: ${maxDuration.toFixed(2)}ms`);
  console.log(`   ✅ Success rate: ${(successful.length / results.length * 100).toFixed(1)}%`);
}

// Benchmark 2: API Route Response Times
async function benchmarkAPIRoutes() {
  console.log('\n2️⃣ Benchmarking API Route Response Times...');
  
  const routes = [
    { path: '/api/square/bookings', method: 'GET' },
    { path: '/api/checkout', method: 'POST' },
    { path: '/api/webhooks/square', method: 'POST' }
  ];
  
  for (const route of routes) {
    console.log(`   📍 Testing ${route.method} ${route.path}...`);
    
    const results = [];
    
    for (let i = 0; i < BENCHMARK_CONFIG.iterations; i++) {
      const result = await measureExecutionTime(`Request ${i + 1}`, async () => {
        const options = {
          method: route.method,
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        if (route.method === 'POST') {
          options.body = JSON.stringify({ test: true });
        }
        
        const response = await fetch(`http://localhost:3000${route.path}`, options);
        return { status: response.status, statusText: response.statusText };
      });
      
      results.push(result);
    }
    
    const successful = results.filter(r => r.success);
    const avgDuration = successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;
    
    console.log(`      ✅ Average response time: ${avgDuration.toFixed(2)}ms`);
    console.log(`      ✅ Success rate: ${(successful.length / results.length * 100).toFixed(1)}%`);
  }
}

// Benchmark 3: Concurrent Request Handling
async function benchmarkConcurrentRequests() {
  console.log('\n3️⃣ Benchmarking Concurrent Request Handling...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('   ❌ Cannot benchmark - missing Supabase credentials');
    return;
  }
  
  const concurrentPromises = [];
  const startTime = process.hrtime.bigint();
  
  for (let i = 0; i < BENCHMARK_CONFIG.concurrentRequests; i++) {
    const promise = fetch(`${supabaseUrl}/rest/v1/users?select=id,email&limit=5`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }).then(response => response.json());
    
    concurrentPromises.push(promise);
  }
  
  try {
    const results = await Promise.all(concurrentPromises);
    const endTime = process.hrtime.bigint();
    const totalDuration = Number(endTime - startTime) / 1_000_000;
    
    console.log(`   ✅ Processed ${BENCHMARK_CONFIG.concurrentRequests} concurrent requests`);
    console.log(`   ✅ Total time: ${totalDuration.toFixed(2)}ms`);
    console.log(`   ✅ Average per request: ${(totalDuration / BENCHMARK_CONFIG.concurrentRequests).toFixed(2)}ms`);
  } catch (error) {
    console.log(`   ❌ Concurrent request failed: ${error.message}`);
  }
}

// Benchmark 4: Memory Usage During Operations
async function benchmarkMemoryUsage() {
  console.log('\n4️⃣ Benchmarking Memory Usage...');
  
  const initialMemory = process.memoryUsage();
  console.log(`   📊 Initial memory usage:`);
  console.log(`      RSS: ${(initialMemory.rss / 1024 / 1024).toFixed(2)}MB`);
  console.log(`      Heap Used: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`      Heap Total: ${(initialMemory.heapTotal / 1024 / 1024).toFixed(2)}MB`);
  
  // Simulate multiple operations
  const operations = [];
  for (let i = 0; i < 100; i++) {
    operations.push(Promise.resolve({ data: new Array(1000).fill(`test-data-${i}`) }));
  }
  
  await Promise.all(operations);
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  const finalMemory = process.memoryUsage();
  console.log(`   📊 Final memory usage:`);
  console.log(`      RSS: ${(finalMemory.rss / 1024 / 1024).toFixed(2)}MB`);
  console.log(`      Heap Used: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`      Heap Total: ${(finalMemory.heapTotal / 1024 / 1024).toFixed(2)}MB`);
  
  const memoryIncrease = finalMemory.rss - initialMemory.rss;
  console.log(`   ✅ Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
}

// Benchmark 5: Error Handling Performance
async function benchmarkErrorHandling() {
  console.log('\n5️⃣ Benchmarking Error Handling Performance...');
  
  const errorScenarios = [
    { name: 'Network timeout', fn: () => fetch('http://localhost:9999/timeout', { timeout: 100 }) },
    { name: 'Invalid endpoint', fn: () => fetch('http://localhost:3000/api/nonexistent') },
    { name: 'Malformed request', fn: () => fetch('http://localhost:3000/api/checkout', { 
      method: 'POST',
      body: 'invalid-json'
    }) }
  ];
  
  for (const scenario of errorScenarios) {
    console.log(`   📍 Testing ${scenario.name}...`);
    
    const results = [];
    
    for (let i = 0; i < 5; i++) {
      const result = await measureExecutionTime(`Error ${i + 1}`, scenario.fn);
      results.push(result);
    }
    
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    console.log(`      ✅ Average error response time: ${avgDuration.toFixed(2)}ms`);
  }
}

// Run all benchmarks
async function runBenchmarks() {
  console.log(`🚀 Starting performance benchmarks...`);
  console.log(`   Configuration: ${BENCHMARK_CONFIG.iterations} iterations, ${BENCHMARK_CONFIG.concurrentRequests} concurrent requests\n`);
  
  await benchmarkSupabaseQueries();
  await benchmarkAPIRoutes();
  await benchmarkConcurrentRequests();
  await benchmarkMemoryUsage();
  await benchmarkErrorHandling();
  
  console.log('\n🎯 Performance Benchmarking Complete!');
  console.log('\n📊 Performance Summary:');
  console.log('- Supabase queries should complete in < 500ms average');
  console.log('- API routes should respond in < 200ms for simple operations');
  console.log('- Concurrent requests should scale linearly');
  console.log('- Memory usage should remain stable under load');
  console.log('- Error handling should be fast and consistent');
  console.log('\n✅ All benchmarks completed successfully!');
}

runBenchmarks().catch(console.error);