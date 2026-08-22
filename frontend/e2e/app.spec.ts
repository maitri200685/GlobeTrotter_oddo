import { test, expect } from '@playwright/test';

test.describe('GlobeTrotter E2E', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/');
    
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/GlobeTrotter/);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Check if there is a link/button to Sign In
    const signInButton = page.locator('text=Sign In');
    if (await signInButton.count() > 0) {
      await signInButton.click();
      await expect(page.url()).toContain('/auth');
    }
  });
});
