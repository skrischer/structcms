import { test, expect } from '@playwright/test';
import { resetAndSeed } from './helpers';

test.describe('Page List', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await resetAndSeed();
  });

  test('should display all seeded pages', async ({ page }) => {
    await page.goto('/admin/pages');

    const table = page.locator('[data-testid="page-table"]');
    await expect(table).toBeVisible({ timeout: 10000 });

    // Scope to first column (title) to avoid matching slug cells
    await expect(table.locator('td:first-child', { hasText: 'Home' }).first()).toBeVisible();
    await expect(table.locator('td:first-child', { hasText: 'About Us' }).first()).toBeVisible();
    await expect(table.locator('td:first-child', { hasText: 'Blog' }).first()).toBeVisible();
  });

  test('should filter pages by search', async ({ page }) => {
    await page.goto('/admin/pages');

    const table = page.locator('[data-testid="page-table"]');
    await expect(table).toBeVisible({ timeout: 10000 });

    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('Home');

    await expect(table.locator('td:first-child', { hasText: 'Home' }).first()).toBeVisible();
    await expect(table.locator('td:first-child', { hasText: 'Blog' })).not.toBeVisible();
  });

  test('should navigate to edit page on row click', async ({ page }) => {
    await page.goto('/admin/pages');

    const table = page.locator('[data-testid="page-table"]');
    await expect(table).toBeVisible({ timeout: 10000 });

    // Click the row containing "Home"
    await table.locator('tr', { hasText: 'Home' }).first().click();

    await page.waitForURL(/\/admin\/pages\//);
    await expect(page).toHaveURL(/\/admin\/pages\//);
  });
});
