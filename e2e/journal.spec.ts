import { test, expect } from '@playwright/test';

test.describe('Journal', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });

  test('should create, edit, filter, and delete a journal entry', async ({ page }) => {
    await page.goto('/journal');
    await expect(page.getByRole('heading', { name: 'My Wellness Journal' })).toBeVisible();

    // Create a new entry
    await page.getByRole('button', { name: 'New Entry' }).click();
    await page.getByLabel('Title').fill('Test Entry');
    await page.getByLabel('Content').fill('This is a test entry.');
    await page.getByLabel('Tags').fill('test-tag');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Test Entry')).toBeVisible();

    // Filter by tag
    await page.getByRole('combobox', { name: 'Filter by tag' }).click();
    await page.getByRole('option', { name: 'test-tag' }).click();
    await expect(page.getByText('Test Entry')).toBeVisible();

    // Clear filter
    await page.getByRole('combobox', { name: 'Filter by tag' }).click();
    await page.getByRole('option', { name: 'All Tags' }).click();

    // Edit the entry
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Title').fill('Test Entry Updated');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Test Entry Updated')).toBeVisible();

    // Delete the entry
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Test Entry Updated')).not.toBeVisible();
  });
});
