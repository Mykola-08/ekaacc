import { test, expect } from '@playwright/test';

// E2E tests for Settings page using e2e bypass
// Access via `?e2e=1` to skip auth redirect for UI-only checks

test.describe('Settings (minimalist)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings?e2e=1');
    await page.waitForLoadState('networkidle');
  });

  test('renders settings header and sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
    await expect(page.getByText(/Customize your experience/i)).toBeVisible();
    await expect(page.getByText(/Profile/i)).toBeVisible();
    await expect(page.getByText(/Appearance/i)).toBeVisible();
    await expect(page.getByText(/Notifications/i)).toBeVisible();
    await expect(page.getByText(/Security/i)).toBeVisible();
  });

  test('theme selector toggles dark mode', async ({ page }) => {
    // Click Dark theme option
    const darkBtn = page.getByRole('button', { name: /dark/i });
    await darkBtn.click();

    // Expect html to have dark class
    const hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(hasDark).toBeTruthy();
  });

  test('toggle a notification switch triggers Save CTA', async ({ page }) => {
    // Toggle one known switch (Newsletter and Updates)
    const switchLocator = page.getByTestId('email-news');
    if (await switchLocator.count()) {
      await switchLocator.click();
    } else {
      // Fallback: click container to toggle
      await page.getByTestId('switch-email-news').click();
    }

    // Save button should appear
    const saveBtn = page.getByTestId('save-settings');
    await expect(saveBtn).toBeVisible();
  });

  test('save without user shows error toast (unauth)', async ({ page }) => {
    // Toggle to enable save
    const switchLocator = page.getByTestId('email-news');
    if (await switchLocator.count()) {
      await switchLocator.click();
    } else {
      await page.getByTestId('switch-email-news').click();
    }

    const saveBtn = page.getByTestId('save-settings');
    await saveBtn.click();

    // Expect an error toast due to no authenticated user
    const possibleErrors = [/Could not save settings/i, /Unable to save settings/i];
    const toastText = await page.locator('body').innerText();
    expect(possibleErrors.some((re) => re.test(toastText))).toBeTruthy();
  });
});
