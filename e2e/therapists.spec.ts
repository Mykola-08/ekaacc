import { test, expect } from '@playwright/test';

test.describe('Therapists', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });

  test('should filter therapists by specialty', async ({ page }) => {
    await page.goto('/therapists');
    await expect(page.getByRole('heading', { name: 'Find Your Therapist' })).toBeVisible();

    // Filter by specialty
    await page.getByRole('combobox', { name: 'Filter by specialty' }).click();
    await page.getByRole('option', { name: 'Anxiety' }).click();
    await expect(page.getByText('Dr. John Doe')).toBeVisible();
    await expect(page.getByText('Dr. Jane Smith')).not.toBeVisible();
  });
});
