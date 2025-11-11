import { test, expect } from '@playwright/test';

test('login page', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveTitle(/EKA Account/);
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/home');
});
