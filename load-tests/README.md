# Load Testing

This directory contains k6 load test scripts for the application.

## Test Files

- `basic-load.js` - Basic load test (10-100 users)
- `api-stress.js` - API stress test (50-200 users)
- `spike-test.js` - Spike test (sudden 500 user spike)

## Running Tests

```bash
# Basic load test
npm run test:load

# API stress test
npm run test:load:api

# Spike test
npm run test:load:spike

# Run against custom URL
BASE_URL=https://your-app.com npm run test:load
```

## Results

Results are saved to `load-tests/results/` directory as JSON files.

## Requirements

k6 must be installed. See: https://k6.io/docs/getting-started/installation/

## Understanding Results

Key metrics:
- `http_req_duration` - Request response time
- `http_req_failed` - Percentage of failed requests
- `http_reqs` - Total number of requests
- Custom metrics are defined in each test file

## Thresholds

Tests will fail if:
- Response times exceed defined limits
- Error rates are too high
- Other custom thresholds are not met
