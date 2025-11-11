import { test, expect } from '@playwright/test';

test.describe('Messages', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });

  test('should send and receive messages', async ({ page }) => {
    await page.goto('/messages');
    await expect(page.getByRole('heading', { name: 'Messages' })).toBeVisible();

    // Send a message
    await page.getByPlaceholder('Type a message...').fill('Hello, therapist!');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByText('Hello, therapist!')).toBeVisible();

    // Check for a reply
    await expect(page.getByText('Hello! How can I help you today?')).toBeVisible();
  });
});
