# Test Suite Quick Reference

> Quick commands and reference for running tests

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Validate setup
./validate-test-setup.sh
```

## Unit Tests (Jest)

```bash
npm test                  # Run all unit tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

## E2E Tests (Playwright)

```bash
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Interactive UI mode
npm run test:e2e:debug    # Debug mode
npx playwright test --headed  # With browser visible
```

### Run specific tests
```bash
npx playwright test e2e/auth.spec.ts
npx playwright test -g "login"
```

## Load Tests (k6)

> **Note:** Requires k6 installation. See `K6_SETUP.md`

```bash
npm run test:load         # Basic load (10-100 users)
npm run test:load:api     # API stress (50-200 users)
npm run test:load:spike   # Spike test (500 users)
```

### With custom URL
```bash
BASE_URL=https://your-app.com npm run test:load
```

## Vercel Tests

```bash
npm run test:vercel https://your-deployment.vercel.app
npm run test:vercel:env https://your-deployment.vercel.app
```

## All Tests

```bash
npm run test:all          # Unit + E2E tests
```

## Common Options

### Playwright
```bash
--headed                  # Show browser
--debug                   # Debug mode
--ui                      # Interactive UI
--project=chromium        # Specific browser
--grep "test name"        # Filter by name
--reporter=html           # HTML report
```

### Jest
```bash
--watch                   # Watch mode
--coverage                # Coverage report
--verbose                 # Detailed output
--updateSnapshot          # Update snapshots
```

### k6
```bash
--vus 100                 # Virtual users
--duration 30s            # Test duration
--out json=results.json   # Output format
```

## View Results

### E2E Results
```bash
npx playwright show-report
```

### Coverage Report
```bash
open coverage/lcov-report/index.html
```

### Load Test Results
```bash
cat load-tests/results/*.json
```

## Troubleshooting

### Playwright Issues
```bash
# Reinstall browsers
npx playwright install --force

# Clear cache
rm -rf playwright-report test-results

# Check config
npx playwright --version
```

### Port Already in Use
```bash
# Kill process on port 9002
lsof -ti:9002 | xargs kill -9
```

## Documentation

- `TESTING.md` - Complete testing guide
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `e2e/README.md` - E2E testing guide
- `load-tests/README.md` - Load testing guide
- `vercel-tests/README.md` - Vercel testing guide

## CI/CD

GitHub Actions workflow: `.github/workflows/test-suite.yml`

```bash
# Local CI simulation
npm run lint && npm test && npm run test:e2e
```

## Quick Tips

1. **Always validate setup first:** `./validate-test-setup.sh`
2. **Use watch mode during development:** `npm run test:watch`
3. **Debug E2E tests interactively:** `npm run test:e2e:ui`
4. **Run load tests on staging first**
5. **Check documentation for detailed guides**

## Support

For issues:
1. Check validation script output
2. Review relevant README file
3. Check `TESTING.md` troubleshooting section
4. Verify environment configuration
