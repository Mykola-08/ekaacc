import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });

  test('should display the redesigned dashboard', async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: /Hello/ })).toBeVisible();
    await expect(page.getByText('Wellness Score')).toBeVisible();
    await expect(page.getByText('Next Session')).toBeVisible();
    await expect(page.getByText('Goal Progress')).toBeVisible();
  });
});
