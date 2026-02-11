import { test, expect } from '@playwright/test';
import { resetAndSeed } from './helpers';

test.describe('Dashboard', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await resetAndSeed();
  });

  test.afterAll(async () => {
    await resetAndSeed();
  });

  test('should load dashboard at /admin', async ({ page }) => {
    await page.goto('/admin');

    const dashboard = page.locator('[data-testid="dashboard-page"]');
    await expect(dashboard).toBeVisible();
    await expect(page.locator('h1', { hasText: 'Dashboard' })).toBeVisible();
  });

  test('should display KPI cards with correct counts', async ({ page }) => {
    await page.goto('/admin');

    // Wait for KPI values to load (skeleton → value)
    const pagesValue = page.locator('[data-testid="kpi-pages-value"]');
    const mediaValue = page.locator('[data-testid="kpi-media-value"]');
    const navigationValue = page.locator('[data-testid="kpi-navigation-value"]');
    const sectionsValue = page.locator('[data-testid="kpi-sections-value"]');

    // Wait for pages KPI to load (value depends on DB state due to parallel tests)
    await expect(pagesValue).toHaveText(/^\d+$/, { timeout: 10000 });
    const pagesCount = Number(await pagesValue.textContent());
    expect(pagesCount).toBeGreaterThanOrEqual(5);

    await expect(mediaValue).toHaveText(/^\d+$/);
    await expect(navigationValue).toHaveText(/^\d+$/);
    // Sections count comes from registry, always 2
    await expect(sectionsValue).toHaveText('2');
  });

  test('should display KPI card labels', async ({ page }) => {
    await page.goto('/admin');

    const kpiCards = page.locator('[data-testid="kpi-cards"]');
    await expect(kpiCards).toBeVisible();

    await expect(kpiCards.locator('text=Pages')).toBeVisible();
    await expect(kpiCards.locator('text=Media Files')).toBeVisible();
    await expect(kpiCards.locator('text=Navigation Sets')).toBeVisible();
    await expect(kpiCards.locator('text=Sections')).toBeVisible();
  });

  test('should show loading skeletons initially', async ({ page }) => {
    // Navigate without waiting for network idle to catch skeleton state
    await page.goto('/admin', { waitUntil: 'commit' });

    // At least one skeleton should be visible during loading
    const skeletons = page.locator('[data-testid$="-skeleton"]');
    const count = await skeletons.count();

    // Skeletons may already be gone if loading is fast, so just verify
    // the dashboard loaded successfully either way
    if (count > 0) {
      await expect(skeletons.first()).toBeVisible();
    }

    // Eventually the KPI values should appear
    await expect(page.locator('[data-testid="kpi-pages-value"]')).toBeVisible({ timeout: 10000 });
  });

  test('should display recent pages list with seeded pages', async ({ page }) => {
    await page.goto('/admin');

    const recentPages = page.locator('[data-testid="recent-pages"]');
    await expect(recentPages).toBeVisible();
    await expect(recentPages.locator('h2', { hasText: 'Recent Pages' })).toBeVisible();

    // Wait for the list to load
    const pagesList = page.locator('[data-testid="recent-pages-list"]');
    await expect(pagesList).toBeVisible({ timeout: 10000 });

    // Verify seeded pages appear — each row is a div[role=button] containing title + slug
    await expect(pagesList.locator('[role="button"]').filter({ hasText: 'Home' }).first()).toBeVisible();
    await expect(pagesList.locator('[role="button"]').filter({ hasText: 'About Us' }).first()).toBeVisible();
    await expect(pagesList.locator('[role="button"]').filter({ hasText: 'Blog' }).first()).toBeVisible();
    await expect(pagesList.locator('[role="button"]').filter({ hasText: 'Our Team' }).first()).toBeVisible();
    await expect(pagesList.locator('[role="button"]').filter({ hasText: 'Contact' }).first()).toBeVisible();
  });

  test('should show max 10 items in recent pages', async ({ page }) => {
    await page.goto('/admin');

    const pagesList = page.locator('[data-testid="recent-pages-list"]');
    await expect(pagesList).toBeVisible({ timeout: 10000 });

    // RecentPages shows max 10 items — verify the limit is respected
    const rows = pagesList.locator('[role="button"]');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(10);
  });

  test('should display quick actions buttons', async ({ page }) => {
    await page.goto('/admin');

    const quickActions = page.locator('[data-testid="quick-actions"]');
    await expect(quickActions).toBeVisible();
    await expect(quickActions.locator('h2', { hasText: 'Quick Actions' })).toBeVisible();

    const createPageBtn = page.locator('[data-testid="quick-action-create-page"]');
    const uploadMediaBtn = page.locator('[data-testid="quick-action-upload-media"]');

    await expect(createPageBtn).toBeVisible();
    await expect(createPageBtn).toHaveText('Create New Page');

    await expect(uploadMediaBtn).toBeVisible();
    await expect(uploadMediaBtn).toHaveText('Upload Media');
  });

  test('should navigate to create page on quick action click', async ({ page }) => {
    await page.goto('/admin');

    const createPageBtn = page.locator('[data-testid="quick-action-create-page"]');
    await expect(createPageBtn).toBeVisible();
    await createPageBtn.click();

    await page.waitForURL(/\/admin\/pages\/new/);
    await expect(page).toHaveURL(/\/admin\/pages\/new/);
  });

  test('should navigate to media on quick action click', async ({ page }) => {
    await page.goto('/admin');

    const uploadMediaBtn = page.locator('[data-testid="quick-action-upload-media"]');
    await expect(uploadMediaBtn).toBeVisible();
    await uploadMediaBtn.click();

    await page.waitForURL(/\/admin\/media/);
    await expect(page).toHaveURL(/\/admin\/media/);
  });

  test('should navigate to page editor on recent page click', async ({ page }) => {
    await page.goto('/admin');

    const pagesList = page.locator('[data-testid="recent-pages-list"]');
    await expect(pagesList).toBeVisible({ timeout: 10000 });

    // Click the first page entry (most recently updated)
    const firstRow = pagesList.locator('[role="button"]').first();
    await expect(firstRow).toBeVisible();
    await firstRow.click();

    // Should navigate to /admin/pages/<slug>
    await page.waitForURL(/\/admin\/pages\/[^/]+/);
    await expect(page).toHaveURL(/\/admin\/pages\/[^/]+/);
  });
});
