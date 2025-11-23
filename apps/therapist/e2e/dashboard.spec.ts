import { test, expect } from '@playwright/test';

test.describe('Therapist Portal', () => {
  test('should redirect to login or show portal', async ({ page }) => {
    await page.goto('/');
    // It should either be the portal or redirect to login
    const url = page.url();
    if (url.includes('login')) {
      await expect(page.locator('h1, h2')).toContainText(/Sign In|Login/i);
    } else {
      await expect(page).toHaveTitle(/Therapist|Portal/i);
    }
  });
});
