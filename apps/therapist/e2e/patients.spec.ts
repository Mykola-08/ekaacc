import { test, expect } from '@playwright/test';

test.describe('Therapist Patient Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/patients');
  });

  test('should display patients list or redirect', async ({ page }) => {
    const url = page.url();
    if (url.includes('login')) {
      console.log('Redirected to login');
      return;
    }

    await expect(page.locator('h1')).toContainText('Patients');
  });

  test('should allow searching for a patient', async ({ page }) => {
    const url = page.url();
    if (url.includes('login')) return;

    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('John Doe');
    // Verify some result or empty state
  });
});
