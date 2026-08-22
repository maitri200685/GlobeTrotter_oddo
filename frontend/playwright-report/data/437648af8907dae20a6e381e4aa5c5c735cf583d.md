# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> GlobeTrotter E2E >> should navigate to login page
- Location: e2e\app.spec.ts:11:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('GlobeTrotter E2E', () => {
  4  |   test('should load the landing page', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     
  7  |     // Expect a title "to contain" a substring.
  8  |     await expect(page).toHaveTitle(/GlobeTrotter/);
  9  |   });
  10 | 
  11 |   test('should navigate to login page', async ({ page }) => {
> 12 |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
  13 |     
  14 |     // Check if there is a link/button to Sign In
  15 |     const signInButton = page.locator('text=Sign In');
  16 |     if (await signInButton.count() > 0) {
  17 |       await signInButton.click();
  18 |       await expect(page.url()).toContain('/auth');
  19 |     }
  20 |   });
  21 | });
  22 | 
```