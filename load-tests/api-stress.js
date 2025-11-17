import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

/**
 * K6 Load Test - API Stress Test
 * Focuses on testing API endpoints under high load
 * 
 * Run with: k6 run load-tests/api-stress.js
 */

// Custom metrics
const errorRate = new Rate('errors');
const apiResponseTime = new Trend('api_response_time');

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '3m', target: 100 },  // Increase to 100 users
    { duration: '2m', target: 200 },  // Spike to 200 users
    { duration: '2m', target: 200 },  // Maintain spike
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<5000'], // 99% of requests under 5s
    http_req_failed: ['rate<0.05'],    // Less than 5% errors
    errors: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:9002';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Test various API endpoints
  const endpoints = [
    '/api/health',
    '/api/auth/session',
  ];

  endpoints.forEach((endpoint) => {
    const response = http.get(`${BASE_URL}${endpoint}`, params);
    
    apiResponseTime.add(response.timings.duration);
    
    const success = check(response, {
      'status is not 500': (r) => r.status !== 500,
      'response time OK': (r) => r.timings.duration < 5000,
    });
    
    errorRate.add(!success);
  });

  sleep(Math.random() * 3); // Random sleep between 0-3s
}

export function handleSummary(data) {
  console.log('Generating summary...');
  
  const summary = {
    'total_requests': data.metrics.http_reqs.values.count,
    'failed_requests': data.metrics.http_req_failed.values.rate,
    'avg_response_time': data.metrics.http_req_duration.values.avg,
    'p95_response_time': data.metrics.http_req_duration.values['p(95)'],
    'p99_response_time': data.metrics.http_req_duration.values['p(99)'],
  };

  return {
    'load-tests/results/api-stress-summary.json': JSON.stringify(summary, null, 2),
    'stdout': JSON.stringify(summary, null, 2),
  };
}
