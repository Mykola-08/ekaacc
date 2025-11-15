import { test, expect } from '@playwright/test';

test.describe('Onboarding', () => {
  test('should complete the full onboarding flow', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByRole('button', { name: 'Deep Personalization' }).click();

    // Welcome Step
    await page.getByRole('button', { name: 'Let\'s Begin' }).click();

    // Focus Areas Step
    await page.getByRole('button', { name: 'Reduce Stress' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Reason Step
    await page.getByLabel('Mental Wellness').click();
    await page.getByLabel('First time exploring therapy').click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Wellness Check Step
    await page.getByRole('button', { name: 'Continue' }).click();

    // Schedule Step
    await page.getByLabel('Afternoon').click();
    await page.getByLabel('Weekly').click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Communication Step
    await page.getByLabel('Warm & Supportive').click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Final Step
    await page.getByRole('button', { name: 'Complete & Get Started' }).click();

    await expect(page).toHaveURL('/home');
  });
});
