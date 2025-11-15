import { test, expect } from '@playwright/test';

test.describe('Goals', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });

  test('should create and delete a goal', async ({ page }) => {
    await page.goto('/goals');
    await expect(page.getByRole('heading', { name: 'My Goals' })).toBeVisible();

    // Create a new goal
    await page.getByRole('button', { name: 'New Goal' }).click();
    await page.getByLabel('Description').fill('Test Goal');
    await page.getByLabel('Target Date').fill('2025-12-31');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Test Goal')).toBeVisible();

    // Delete the goal
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Test Goal')).not.toBeVisible();
  });
});
