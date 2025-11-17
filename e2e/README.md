# E2E Tests

End-to-end tests using Playwright to verify user workflows and UI functionality.

## Test Files

- `auth.spec.ts` - Authentication flows (login, validation, accessibility)
- `app-flows.spec.ts` - Core application features (dashboard, navigation, admin)

## Running Tests

```bash
# Run all E2E tests (auto-starts dev server)
npm run test:e2e

# Run in UI mode for debugging
npm run test:e2e:ui

# Run with debugger
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/auth.spec.ts

# Run specific test by name
npx playwright test -g "should display login page"

# Run against production
PLAYWRIGHT_BASE_URL=https://your-app.vercel.app npm run test:e2e
```

## Test Coverage

### Authentication Tests (`auth.spec.ts`)
- ✓ Login page displays correctly
- ✓ Form validation for empty fields
- ✓ Invalid credentials handling
- ✓ Password visibility toggle
- ✓ Accessible form elements
- ✓ Authenticated user redirects
- ✓ Responsive design (mobile, tablet, desktop)
- ✓ Page load performance
- ✓ Console error checking

### Application Flow Tests (`app-flows.spec.ts`)
- ✓ Dashboard page loads
- ✓ Navigation elements display
- ✓ Admin route protection
- ✓ Complete user journeys
- ✓ Page navigation
- ✓ Page refresh handling
- ✓ Back/forward navigation
- ✓ API endpoint responses
- ✓ Network condition handling
- ✓ Accessibility (keyboard navigation, document structure)
- ✓ Error handling (404s, JS errors)

## Configuration

Tests are configured in `playwright.config.ts`:
- Default URL: `http://localhost:9002`
- Browser: Chromium (Firefox & WebKit can be enabled)
- Screenshots: On failure
- Traces: On first retry
- Parallel execution: Yes (sequential on CI)

## Debugging

```bash
# Run with debug mode
npm run test:e2e:debug

# View test report
npx playwright show-report

# Record new tests
npx playwright codegen http://localhost:9002
```

## Writing Tests

Example test structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page');
  });

  test('should do something', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await page.click('button');
    await expect(page).toHaveURL(/expected-url/);
  });
});
```

## Best Practices

1. Use semantic selectors (text, role, label)
2. Wait for elements explicitly
3. Use `page.waitForLoadState()` when needed
4. Group related tests in `describe` blocks
5. Use `beforeEach` for common setup
6. Add meaningful test descriptions
7. Test both happy and error paths

## CI/CD Integration

Example GitHub Actions:

```yaml
- name: Install Playwright
  run: npx playwright install --with-deps
  
- name: Run E2E tests
  run: npm run test:e2e
  
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Troubleshooting

**Tests timing out:**
- Increase timeout in playwright.config.ts
- Check if dev server is starting correctly
- Verify port 9002 is available

**Elements not found:**
- Check selectors in test files
- Use Playwright Inspector: `npm run test:e2e:debug`
- Verify page is fully loaded

**Flaky tests:**
- Use proper wait strategies
- Avoid hardcoded timeouts
- Check for race conditions

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
