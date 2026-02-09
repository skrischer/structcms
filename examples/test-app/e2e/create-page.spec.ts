import { test, expect } from '@playwright/test';
import { resetOnly, BASE_URL } from './helpers';

test.describe('Create Page', () => {
  test.beforeEach(async () => {
    await resetOnly();
  });

  test('should create a new landing page', async ({ page }) => {
    await page.goto('/admin/pages');

    // Click "Create New Page" button in the page list
    await page.locator('[data-testid="create-page"]').click();
    await page.waitForURL('/admin/pages/new');

    // Fill in page metadata
    await page.fill('#title', 'Test Landing Page');
    await page.fill('#slug', 'test-landing');
    await page.selectOption('#pageType', 'landing');

    // Wait for PageEditor to appear (renders after pageType is selected)
    await expect(page.locator('[data-testid="page-editor"]')).toBeVisible();

    // Click "Save Page" button inside the PageEditor
    await page.locator('[data-testid="save-page"]').click();

    // Should redirect back to page list
    await page.waitForURL('/admin/pages');

    const table = page.locator('[data-testid="page-table"]');
    await expect(table).toBeVisible({ timeout: 10000 });
    await expect(table.locator('text=Test Landing Page')).toBeVisible();

    // Verify via API
    const response = await fetch(`${BASE_URL}/api/cms/pages/test-landing`);
    expect(response.ok).toBe(true);
    const pageData = await response.json();
    expect(pageData.title).toBe('Test Landing Page');
    expect(pageData.pageType).toBe('landing');
  });
});
