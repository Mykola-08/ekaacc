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

### Quick Setup Validation

Run the validation script to check your setup:

```bash
./validate-test-setup.sh
```

This will verify all required dependencies and provide helpful feedback if anything is missing.

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
## Overview
This repository contains a comprehensive test suite built with Jest and TypeScript, providing extensive coverage for services, components, and hooks.

## Test Statistics
- **Total Tests**: 241
- **Passing Tests**: 190
- **Test Suites**: 18 (15 passing, 3 with known issues)
- **New Tests Added**: 80 tests across 9 new test files

## Test Structure

### Unit Tests
Located in `src/__tests__/`, testing individual functions and services:

#### Service Tests
- **utils.test.ts** (6 tests) - Utility functions including class name merging
- **wallet-service.test.ts** (15 tests) - Wallet operations and balance management
- **payment-service.test.ts** (8 tests) - Payment request handling
- **subscription-service.test.ts** (11 tests) - Subscription tier management
- **theme-service.test.ts** (5 tests) - Theme preferences and availability
- **referral-service.test.ts** (14 tests) - Referral code generation and validation

#### Existing Service Tests
- **tier-validation-service.test.ts** (25 tests) - VIP/Loyalty tier validation
- **tier-api.test.ts** (15 tests) - Tier assignment API endpoints
- **enhanced-data-service.test.ts** (6 tests) - Enhanced data operations

### Component Tests
Testing UI components with user interactions:

- **badge.test.tsx** (8 tests) - Badge component variants and styling
- **input.test.tsx** (9 tests) - Input component functionality and validation
- **tier-badge.test.tsx** (7 tests) - Tier-specific badge rendering
- **new-ui-components.test.tsx** (36 tests) - Various UI components

### Hook Tests
Testing custom React hooks:

- **use-mobile.test.tsx** (4 tests) - Responsive breakpoint detection

### Integration Tests
- **tier-integration.test.tsx** (9 tests) - Tier system integration
- **navigation-rbac.test.ts** (6 tests) - Role-based access control for navigation

### Authentication Tests
- **auth.test.tsx** (2 tests) - Authentication utilities

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- wallet-service.test.ts
```

### Run Tests Matching Pattern
```bash
npm test -- --testPathPattern="service"
```

## Test Configuration

### Jest Configuration
Located in `jest.config.js`:
- Test environment: `jest-environment-jsdom`
- Setup file: `jest.setup.js`
- Path aliases: `@/*` → `src/*`
- Test file patterns: `**/__tests__/**/*.test.{ts,tsx}`, `**/*.{spec,test}.{ts,tsx}`
- Coverage collection from: `src/**/*.{ts,tsx}` (excluding test files)

### Dependencies
- **jest**: Test framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM
- **@testing-library/user-event**: User interaction simulation
- **babel-jest**: Babel integration for Jest

## Writing Tests

### Service Test Example
```typescript
import { getWalletService } from '../services/wallet-service';

describe('WalletService', () => {
  let walletService: any;

  beforeEach(async () => {
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';
    walletService = await getWalletService();
  });

  it('should retrieve wallet for a user', async () => {
    const wallet = await walletService.getWallet('user-123');
    expect(wallet).toBeDefined();
    expect(wallet).toHaveProperty('balance');
  });
});
```

### Component Test Example
```typescript
import { render, screen } from '@testing-library/react';
import { Badge } from '../components/ui/badge';

describe('Badge Component', () => {
  it('should render badge with text', () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Hook Test Example
```typescript
import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../hooks/use-mobile';

describe('useIsMobile Hook', () => {
  it('should return false for desktop width', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
```

## Best Practices

1. **Isolation**: Use mock data mode for service tests to avoid external dependencies
2. **Naming**: Use descriptive test names that explain what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
4. **Cleanup**: Use `beforeEach` and `afterEach` for test setup and cleanup
5. **Coverage**: Aim for high coverage but focus on meaningful tests

## Known Issues

### Navigation Tests
- **navigation.test.tsx** has 51 failing tests due to AuthProvider context issues
- These are pre-existing issues and not related to the new test suite
- Fix required: Properly mock or provide AuthProvider context

## Coverage Highlights

Based on the latest coverage report:
- **lib/utils.ts**: 100% coverage ✅
- **services/tier-validation-service.ts**: 85.38% coverage ✅
- **services/wallet-service.ts**: 31.64% coverage
- **services/payment-service.ts**: 17.69% coverage
- **services/theme-service.ts**: 27.48% coverage

## Future Improvements

1. **API Route Testing**: Add tests for Next.js API routes (requires fetch polyfill)
2. **Integration Tests**: Add more end-to-end integration tests
3. **Coverage Thresholds**: Configure minimum coverage requirements
4. **CI/CD Integration**: Set up automated test runs on pull requests
5. **Performance Testing**: Add performance benchmarks for critical paths
6. **Visual Regression**: Add screenshot-based visual regression testing
7. **Fix Navigation Tests**: Resolve AuthProvider context issues

## Contributing

When adding new features:
1. Write tests before or alongside implementation
2. Ensure all tests pass before submitting PR
3. Aim for at least 70% code coverage for new code
4. Update this documentation if adding new test categories

## Support

For questions or issues with tests:
1. Check Jest documentation: https://jestjs.io/
2. Check Testing Library docs: https://testing-library.com/
3. Review existing test examples in this repository
