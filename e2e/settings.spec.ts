import { test, expect } from '@playwright/test';

test.describe('Settings', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });

  test('should update user profile', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await page.getByLabel('Name').fill('Test User Updated');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();
  });
});
