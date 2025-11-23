import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('should redirect to login or show dashboard', async ({ page }) => {
    await page.goto('/');
    // It should either be the dashboard or redirect to login
    const url = page.url();
    if (url.includes('login')) {
      await expect(page.locator('h1, h2')).toContainText(/Sign In|Login/i);
    } else {
      // If no auth, maybe it shows dashboard?
      await expect(page).toHaveTitle(/Admin|Dashboard/i);
    }
  });
});
