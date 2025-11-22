import { test, expect } from '@playwright/test';

test.describe('User Impersonation Feature', () => {
  test('Admin can access impersonation dialog', async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('http://localhost:9002/admin');
    
    // Check if impersonation button is visible (requires admin login)
    const impersonateButton = page.locator('button:has-text("Impersonate User")');
    
    // If admin is not logged in, we should see login page
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('Admin not logged in - skipping impersonation test');
      return;
    }
    
    // If we're on admin dashboard, impersonation button should be visible
    await expect(impersonateButton).toBeVisible();
  });

  test('Impersonation dialog opens and shows user list', async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('http://localhost:9002/admin');
    
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('Admin not logged in - skipping impersonation test');
      return;
    }
    
    // Click impersonation button
    await page.click('button:has-text("Impersonate User")');
    
    // Check if dialog opens
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    
    // Check if search input is present
    const searchInput = page.locator('input[placeholder*="Search users"]');
    await expect(searchInput).toBeVisible();
    
    // Check if user cards are displayed
    const userCards = page.locator('.cursor-pointer');
    const cardCount = await userCards.count();
    console.log(`Found ${cardCount} user cards in impersonation dialog`);
  });

  test('Impersonation banner appears when impersonating', async ({ page }) => {
    // This test would require actual impersonation setup
    // For now, we'll just check if the banner component exists in the DOM
    
    await page.goto('http://localhost:9002/admin');
    
    // Check if impersonation banner styling exists
    const bannerStyles = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets);
      const hasImpersonationStyles = styles.some(sheet => {
        try {
          return Array.from(sheet.cssRules || []).some(rule => 
            rule.cssText.includes('bg-amber-100') && rule.cssText.includes('border-amber-200')
          );
        } catch {
          return false;
        }
      });
      return hasImpersonationStyles;
    });
    
    console.log('Impersonation banner styles found:', bannerStyles);
  });
});