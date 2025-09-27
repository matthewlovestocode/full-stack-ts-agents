import { test, expect } from '@playwright/test';

const exampleUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'https://example.com';

test('example page renders the expected title', async ({ page }) => {
  await page.goto(exampleUrl, { waitUntil: 'load' });
  await expect(page).toHaveTitle(/Example Domain/i);
});
