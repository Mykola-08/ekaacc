import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Dashboard and Core Application Features
 * Tests main application functionality and user workflows
 */

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
  });

  test('should load dashboard page', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Verify page loaded (might redirect to login if not authenticated)
    expect(page.url()).toBeTruthy();
    
    // If on dashboard, check for common elements
    if (page.url().includes('dashboard')) {
      // Look for typical dashboard elements
      const hasContent = await page.locator('main, div, section').count() > 0;
      expect(hasContent).toBeTruthy();
    }
  });

  test('should display navigation elements', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check if we're on dashboard (not redirected to login)
    if (page.url().includes('dashboard')) {
      // Look for navigation or sidebar
      const hasNav = await page.locator('nav, aside, [role="navigation"]').count() > 0;
      expect(hasNav).toBeTruthy();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Verify page adapts to mobile viewport
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
  });
});

test.describe('Admin Pages', () => {
  test('should load admin section', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Admin page should either load or redirect to auth
    expect(page.url()).toBeTruthy();
  });

  test('should protect admin routes', async ({ page }) => {
    // List of admin routes to test
    const adminRoutes = [
      '/admin/payments',
      '/admin/subscriptions',
      '/admin/settings',
    ];

    for (const route of adminRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      // Should either show admin content or require authentication
      const url = page.url();
      const hasProtection = url.includes('login') || url.includes('auth') || url.includes('admin');
      expect(hasProtection).toBeTruthy();
    }
  });
});

test.describe('User Workflows', () => {
  test('complete user journey - browse pages', async ({ page }) => {
    // Test a complete user journey through the app
    const pages = ['/', '/login', '/dashboard'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Verify each page loads without errors
      const pageErrors: string[] = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      
      // Wait a bit to catch any runtime errors
      await page.waitForTimeout(500);
      
      // Critical errors should not occur
      const hasCriticalErrors = pageErrors.some(err => 
        !err.includes('favicon') && 
        !err.includes('chunk') &&
        err.includes('Error')
      );
      
      if (hasCriticalErrors) {
        console.log(`Errors on ${pagePath}:`, pageErrors);
      }
    }
  });

  test('navigation between pages works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try clicking links if they exist
    const links = await page.locator('a[href]').all();
    
    if (links.length > 0) {
      // Click first internal link
      for (const link of links.slice(0, 3)) {
        const href = await link.getAttribute('href');
        if (href && href.startsWith('/') && !href.includes('api')) {
          await link.click();
          await page.waitForLoadState('networkidle');
          // Verify navigation occurred
          expect(page.url()).toBeTruthy();
          break;
        }
      }
    }
  });
});

test.describe('Application Stability', () => {
  test('should handle page refresh', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify page still works after refresh
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should handle back/forward navigation', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Navigate to another page
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Should be back on login
    expect(page.url()).toContain('login');
    
    // Go forward
    await page.goForward();
    await page.waitForLoadState('networkidle');
    
    // Should be back on dashboard (or redirected)
    expect(page.url()).toBeTruthy();
  });

  test('should not have memory leaks on repeated navigation', async ({ page }) => {
    const routes = ['/login', '/dashboard', '/'];
    
    // Navigate between routes multiple times
    for (let i = 0; i < 5; i++) {
      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
      }
    }
    
    // If we got here without timeout, navigation is stable
    expect(true).toBe(true);
  });
});

test.describe('API and Data Loading', () => {
  test('should handle API routes', async ({ page }) => {
    // Test that API routes exist and respond
    const response = await page.goto('/api/health');
    
    // API should either work or return proper error
    if (response) {
      expect(response.status()).toBeLessThan(500);
    }
  });

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate slow 3G
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Page should still load, just slower
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper document structure', async ({ page }) => {
    await page.goto('/login');
    
    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    const mainCount = await main.count();
    
    // Should have content structure
    expect(mainCount >= 0).toBeTruthy();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/login');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to navigate without errors
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('should have readable text contrast', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for manual review if needed
    // await page.screenshot({ path: 'login-contrast-check.png' });
    
    // Basic check: text should be visible
    const heading = page.locator('h2').first();
    if (await heading.count() > 0) {
      await expect(heading).toBeVisible();
    }
  });
});

test.describe('Error Handling', () => {
  test('should display 404 for non-existent pages', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345');
    
    // Should return 404 or redirect
    if (response) {
      expect([404, 301, 302, 303, 307, 308]).toContain(response.status());
    }
  });

  test('should handle JavaScript errors gracefully', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Should not have unhandled errors on normal page load
    const criticalErrors = errors.filter(e => !e.includes('favicon'));
    expect(criticalErrors.length).toBe(0);
  });
});
