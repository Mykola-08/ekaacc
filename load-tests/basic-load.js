import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

/**
 * K6 Load Test - Basic Application Load
 * Tests the application's ability to handle concurrent users
 * 
 * Run with: k6 run load-tests/basic-load.js
 * 
 * Environment variables:
 * - BASE_URL: The base URL to test (default: http://localhost:9002)
 */

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '1m', target: 10 },   // Stay at 10 users
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '1m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 100 }, // Spike to 100 users
    { duration: '1m', target: 100 },  // Stay at 100 users
    { duration: '30s', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.1'],     // Error rate should be below 10%
    errors: ['rate<0.1'],               // Custom error rate below 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:9002';

export default function () {
  // Test 1: Homepage load
  const homeResponse = http.get(BASE_URL);
  const homeCheck = check(homeResponse, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads in <2s': (r) => r.timings.duration < 2000,
  });
  errorRate.add(!homeCheck);
  
  sleep(1);

  // Test 2: Login page load
  const loginResponse = http.get(`${BASE_URL}/login`);
  const loginCheck = check(loginResponse, {
    'login page status is 200': (r) => r.status === 200,
    'login page loads in <2s': (r) => r.timings.duration < 2000,
    'login page has email input': (r) => r.body.includes('email'),
  });
  errorRate.add(!loginCheck);
  
  sleep(1);

  // Test 3: Dashboard page (may redirect if not authenticated)
  const dashboardResponse = http.get(`${BASE_URL}/dashboard`);
  const dashboardCheck = check(dashboardResponse, {
    'dashboard responds': (r) => r.status < 500,
    'dashboard loads in <3s': (r) => r.timings.duration < 3000,
  });
  errorRate.add(!dashboardCheck);
  
  sleep(1);

  // Test 4: API health check (if exists)
  const apiResponse = http.get(`${BASE_URL}/api/health`);
  const apiCheck = check(apiResponse, {
    'api responds': (r) => r.status < 500,
  });
  errorRate.add(!apiCheck);

  sleep(2); // Think time between iterations
}

export function handleSummary(data) {
  return {
    'load-tests/results/basic-load-summary.json': JSON.stringify(data),
  };
}
