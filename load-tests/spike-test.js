import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

/**
 * K6 Load Test - Spike Test
 * Tests how the application handles sudden traffic spikes
 * 
 * Run with: k6 run load-tests/spike-test.js
 */

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '10s', target: 10 },   // Below normal load
    { duration: '10s', target: 10 },   
    { duration: '10s', target: 500 },  // Sudden spike to 500 users
    { duration: '30s', target: 500 },  // Maintain spike
    { duration: '10s', target: 10 },   // Quick recovery
    { duration: '10s', target: 10 },   // Stabilize
    { duration: '10s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<10000'], // Allow higher latency during spike
    http_req_failed: ['rate<0.2'],      // Allow higher error rate during spike
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:9002';

export default function () {
  // Focus on homepage during spike
  const response = http.get(`${BASE_URL}/login`);
  
  const success = check(response, {
    'status is not 503': (r) => r.status !== 503, // Service available
    'status is not 500': (r) => r.status !== 500, // No server errors
  });
  
  errorRate.add(!success);
  
  sleep(1);
}

export function handleSummary(data) {
  const summary = {
    test_type: 'spike_test',
    max_users: 500,
    total_requests: data.metrics.http_reqs.values.count,
    failed_requests: data.metrics.http_req_failed.values.rate,
    avg_response_time: data.metrics.http_req_duration.values.avg,
    max_response_time: data.metrics.http_req_duration.values.max,
  };

  return {
    'load-tests/results/spike-test-summary.json': JSON.stringify(summary, null, 2),
    'stdout': `\n=== Spike Test Results ===\n${JSON.stringify(summary, null, 2)}\n`,
  };
}
