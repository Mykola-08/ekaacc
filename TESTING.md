# Test Suite Documentation

This document describes the comprehensive test suite for the application, including E2E tests, load tests, and Vercel integration tests.

## Overview

The test suite is organized into four main categories:

1. **Unit/Integration Tests** (existing Jest tests)
2. **E2E (End-to-End) Tests** (Playwright)
3. **Load Tests** (k6)
4. **Vercel Integration Tests** (Bash scripts)

## Prerequisites

Before running tests, ensure you have:

- Node.js 18+ installed
- Dependencies installed: `npm install`
- For load tests: k6 installed (see [k6.io](https://k6.io/docs/getting-started/installation/))
- For E2E tests: Playwright browsers installed: `npx playwright install`

## Running Tests

### Unit/Integration Tests

```bash
# Run all Jest tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

E2E tests use Playwright to simulate real user interactions.

```bash
# Run all E2E tests (starts dev server automatically)
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui

# Run E2E tests against a specific URL
PLAYWRIGHT_BASE_URL=https://your-app.vercel.app npm run test:e2e

# Run specific E2E test file
npx playwright test e2e/auth.spec.ts

# Debug E2E tests
npx playwright test --debug
```

**E2E Test Files:**
- `e2e/auth.spec.ts` - Authentication flows (login, validation, password toggle)
- `e2e/app-flows.spec.ts` - Core application workflows (dashboard, navigation, admin pages)

### Load Tests

Load tests use k6 to measure application performance under various traffic patterns.

```bash
# Run basic load test (10-100 concurrent users)
npm run test:load

# Run API stress test (50-200 concurrent users)
npm run test:load:api

# Run spike test (sudden traffic spike to 500 users)
npm run test:load:spike

# Run load test against a specific URL
BASE_URL=https://your-app.vercel.app npm run test:load
```

**Load Test Files:**
- `load-tests/basic-load.js` - Basic load test with gradual ramp-up
- `load-tests/api-stress.js` - API endpoint stress testing
- `load-tests/spike-test.js` - Sudden traffic spike simulation

**Load Test Results:**
Results are saved to `load-tests/results/` as JSON files.

### Vercel Integration Tests

These tests verify deployment and configuration on Vercel.

```bash
# Run deployment verification
npm run test:vercel <DEPLOYMENT_URL>

# Example
npm run test:vercel https://your-app.vercel.app

# Check environment variables configuration
npm run test:vercel:env https://your-app.vercel.app
```

**Vercel Test Scripts:**
- `vercel-tests/deployment-test.sh` - Verifies deployment is accessible and functional
- `vercel-tests/env-check.sh` - Validates environment variable configuration

## Test Configuration

### Playwright Configuration

Located in `playwright.config.ts`:
- Default base URL: `http://localhost:9002`
- Browser: Chromium (can enable Firefox, WebKit)
- Automatic dev server startup
- Screenshots on failure
- Traces on retry

### k6 Load Test Thresholds

**Basic Load Test:**
- 95% of requests < 2s response time
- Error rate < 10%

**API Stress Test:**
- 99% of requests < 5s response time
- Error rate < 5%

**Spike Test:**
- 95% of requests < 10s during spike
- Error rate < 20% during spike

## Continuous Integration

### GitHub Actions (Recommended)

```yaml
# .github/workflows/tests.yml
name: Tests
on: [push, pull_request]
jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Vercel Deploy Hooks

Run integration tests after Vercel deployment:

```bash
# In your CI/CD pipeline after deployment
DEPLOYMENT_URL=$(vercel --prod --yes) 
./vercel-tests/deployment-test.sh $DEPLOYMENT_URL
./vercel-tests/env-check.sh $DEPLOYMENT_URL
```

## Writing New Tests

### E2E Test Example

```typescript
// e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/my-page');
    await expect(page.locator('h1')).toContainText('Expected Text');
  });
});
```

### Load Test Example

```javascript
// load-tests/my-load-test.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
  ],
};

export default function () {
  const res = http.get('http://localhost:9002/api/my-endpoint');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
```

## Troubleshooting

### E2E Tests Failing

1. **Dev server not starting**: Check port 9002 is available
2. **Browser timeout**: Increase timeout in playwright.config.ts
3. **Element not found**: Check selectors in test files

### Load Tests Failing

1. **Connection refused**: Ensure application is running
2. **High error rate**: Check application logs, database connections
3. **Timeout errors**: Increase thresholds or reduce concurrent users

### Vercel Tests Failing

1. **Deployment not accessible**: Verify URL is correct
2. **Environment variables missing**: Configure in Vercel dashboard
3. **HTTPS redirect issues**: Check Vercel SSL configuration

## Performance Benchmarks

Expected baseline performance (subject to infrastructure):

- **Homepage load time**: < 1s
- **Login page load time**: < 1s
- **API response time**: < 500ms (p95)
- **Concurrent users supported**: 100+ with < 10% error rate

## Best Practices

1. **Run tests locally** before pushing to CI/CD
2. **Keep E2E tests focused** on critical user journeys
3. **Use appropriate wait strategies** in E2E tests (avoid hardcoded sleeps)
4. **Monitor load test results** over time to detect performance regression
5. **Update tests** when features change
6. **Test in production-like environments** when possible

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [k6 Documentation](https://k6.io/docs/)
- [Vercel Deployment](https://vercel.com/docs)
- [Jest Documentation](https://jestjs.io/)

## Support

For issues with tests:
1. Check this documentation
2. Review test output and logs
3. Check application logs
4. Verify environment configuration
