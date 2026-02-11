import { test, expect } from '@playwright/test';
import { resetAndSeed } from './helpers';

test.describe('Admin Sidebar Navigation', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await resetAndSeed();
  });

  test.afterAll(async () => {
    await resetAndSeed();
  });

  test('should display sidebar with all nav links', async ({ page }) => {
    await page.goto('/admin');

    const sidebar = page.locator('[data-testid="sidebar-nav"]');
    await expect(sidebar).toBeVisible();

    await expect(page.locator('[data-testid="nav-link-/admin"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-link-/admin/pages"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-link-/admin/navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-link-/admin/media"]')).toBeVisible();
  });

  test('should navigate to Pages on sidebar click', async ({ page }) => {
    await page.goto('/admin');

    await page.locator('[data-testid="nav-link-/admin/pages"]').click();

    await page.waitForURL('/admin/pages');
    await expect(page).toHaveURL('/admin/pages');
  });

  test('should navigate to Navigation on sidebar click', async ({ page }) => {
    await page.goto('/admin');

    await page.locator('[data-testid="nav-link-/admin/navigation"]').click();

    await page.waitForURL('/admin/navigation');
    await expect(page).toHaveURL('/admin/navigation');
  });

  test('should navigate to Media on sidebar click', async ({ page }) => {
    await page.goto('/admin');

    await page.locator('[data-testid="nav-link-/admin/media"]').click();

    await page.waitForURL('/admin/media');
    await expect(page).toHaveURL('/admin/media');
  });

  test('should navigate back to Dashboard on sidebar click', async ({ page }) => {
    await page.goto('/admin/pages');

    await page.locator('[data-testid="nav-link-/admin"]').click();

    await page.waitForURL(/\/admin$/);
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('should navigate through multiple admin pages in sequence', async ({ page }) => {
    await page.goto('/admin');

    // Dashboard → Pages
    await page.locator('[data-testid="nav-link-/admin/pages"]').click();
    await page.waitForURL('/admin/pages');

    // Pages → Navigation
    await page.locator('[data-testid="nav-link-/admin/navigation"]').click();
    await page.waitForURL('/admin/navigation');

    // Navigation → Media
    await page.locator('[data-testid="nav-link-/admin/media"]').click();
    await page.waitForURL('/admin/media');

    // Media → Dashboard
    await page.locator('[data-testid="nav-link-/admin"]').click();
    await page.waitForURL(/\/admin$/);

    // Verify Dashboard content loaded
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
  });
});
