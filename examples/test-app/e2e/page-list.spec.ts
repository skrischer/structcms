import { test, expect } from '@playwright/test';
import { resetAndSeed, resetOnly } from './helpers';

test.describe('Page List', () => {
  test.describe('with seeded data', () => {
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

    test('should filter pages by type', async ({ page }) => {
      await page.goto('/admin/pages');

      const table = page.locator('[data-testid="page-table"]');
      await expect(table).toBeVisible({ timeout: 10000 });

      const typeFilter = page.locator('[data-testid="page-type-filter"]');
      await typeFilter.selectOption('landing');

      // Seed has 4 landing pages: Home, About Us, Our Team, Contact
      await expect(table.locator('td:first-child', { hasText: 'Home' }).first()).toBeVisible();
      await expect(table.locator('td:first-child', { hasText: 'About Us' }).first()).toBeVisible();
      await expect(table.locator('td:first-child', { hasText: 'Our Team' }).first()).toBeVisible();
      await expect(table.locator('td:first-child', { hasText: 'Contact' }).first()).toBeVisible();

      // Blog is type "blog", should not be visible
      await expect(table.locator('td:first-child', { hasText: 'Blog' })).not.toBeVisible();

      // Switch to "blog" filter
      await typeFilter.selectOption('blog');

      await expect(table.locator('td:first-child', { hasText: 'Blog' }).first()).toBeVisible();
      await expect(table.locator('td:first-child', { hasText: 'Home' })).not.toBeVisible();

      // Reset to "All Types"
      await typeFilter.selectOption('');

      // All pages visible again
      await expect(table.locator('td:first-child', { hasText: 'Home' }).first()).toBeVisible();
      await expect(table.locator('td:first-child', { hasText: 'Blog' }).first()).toBeVisible();
    });
  });

  test.describe('empty state', () => {
    test.beforeEach(async () => {
      await resetOnly();
    });

    test('should show empty state when no pages exist', async ({ page }) => {
      await page.goto('/admin/pages');

      const emptyState = page.locator('[data-testid="empty-state"]');
      await expect(emptyState).toBeVisible({ timeout: 10000 });
      await expect(emptyState).toContainText('No pages yet');
    });
  });

  test.describe('error state', () => {
    test('should show error message when API fails', async ({ page }) => {
      // Intercept the pages API call and return a 500 error
      await page.route('**/api/cms/pages', (route) => {
        void route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Internal Server Error' } }),
        });
      });

      await page.goto('/admin/pages');

      const errorState = page.locator('[data-testid="error"]');
      await expect(errorState).toBeVisible({ timeout: 10000 });
    });
  });
});
