# Testing Strategy

This project uses a combination of **Jest** for unit/integration testing and **Playwright** for End-to-End (E2E) testing.

## Unit & Integration Tests (Jest)

Each application (`apps/web`, `apps/admin`, `apps/therapist`, `apps/api`) has its own Jest configuration.

### Running Tests
To run unit tests for a specific app:

```bash
# For API
cd apps/api
npm test

# For Admin
cd apps/admin
npm test
```

### Key Test Files
- `apps/api/src/__tests__/integrations.test.ts`: Verifies that the `IntegrationManager` correctly initializes all external services (Auth0, Stripe, Supabase, etc.) using environment variables.

## End-to-End Tests (Playwright)

Playwright is used for E2E testing to ensure the applications work correctly in a browser environment.

### Setup
1. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

2. Ensure the applications are running:
   - Admin: http://localhost:9003
   - Therapist: http://localhost:9004

### Running E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run UI mode
npx playwright test --ui
```

### Configuration
- `apps/admin/playwright.config.ts`: Configured for port 9003.
- `apps/therapist/playwright.config.ts`: Configured for port 9004.
- `apps/web/playwright.config.ts`: Configured for port 9002.

### Test Suites
- **Admin**:
  - `e2e/dashboard.spec.ts`: Basic dashboard access.
  - `e2e/users.spec.ts`: User management flow (table visibility, invite button).
- **Therapist**:
  - `e2e/dashboard.spec.ts`: Portal access.
  - `e2e/patients.spec.ts`: Patient list and search functionality.
- **Web**:
  - `e2e/landing.spec.ts`: Home page load and navigation links.
  - `e2e/auth.spec.ts`: Login flow validation.

## CI/CD Integration
Tests are designed to run in CI environments. Ensure `CI=true` is set to enable specific CI behaviors (like headless mode).
