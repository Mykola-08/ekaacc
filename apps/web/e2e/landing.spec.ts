import { test, expect } from '@playwright/test';

test.describe('Web Landing Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/EKA Balance|Home/i);
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /login|sign in/i })).toBeVisible();
  });
});
