import { test, expect } from '@playwright/test';

test.describe('Sessions', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });

  test('should display past and upcoming sessions', async ({ page }) => {
    await page.goto('/sessions');
    await expect(page.getByRole('heading', { name: 'Sessions' })).toBeVisible();
    await expect(page.getByText('Upcoming Sessions')).toBeVisible();
    await expect(page.getByText('Past Sessions')).toBeVisible();
  });
});
