# Test Suite Documentation

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
