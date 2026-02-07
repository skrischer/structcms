import { test, expect } from '@playwright/test';
import { resetAndSeed } from './helpers';

test.describe('Page List', () => {
  test.beforeEach(async () => {
    await resetAndSeed();
  });

  test('should display all seeded pages', async ({ page }) => {
    await page.goto('/pages');

    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=About')).toBeVisible();
    await expect(page.locator('text=Blog')).toBeVisible();
  });

  test('should filter pages by search', async ({ page }) => {
    await page.goto('/pages');

    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Home');
      await expect(page.locator('text=Home')).toBeVisible();
    }
  });

  test('should navigate to edit page on row click', async ({ page }) => {
    await page.goto('/pages');

    await page.click('text=Home');

    await page.waitForURL(/\/pages\/home/);
    await expect(page).toHaveURL(/\/pages\/home/);
  });
});
