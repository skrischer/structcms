import { test, expect } from '@playwright/test';
import { resetOnly, BASE_URL } from './helpers';

test.describe('Create Page', () => {
  test.beforeEach(async () => {
    await resetOnly();
  });

  test('should create a new landing page', async ({ page }) => {
    await page.goto('/pages');

    await page.click('text=Create New Page');

    await page.waitForURL('/pages/new');

    await page.fill('input#title', 'Test Landing Page');
    await page.fill('input#slug', 'test-landing');
    await page.selectOption('select#pageType', 'landing');

    await page.click('text=Create Page');

    await page.waitForURL('/pages');

    await expect(page.locator('text=Test Landing Page')).toBeVisible();

    const response = await fetch(`${BASE_URL}/api/cms/pages/test-landing`);
    expect(response.ok).toBe(true);
    const pageData = await response.json();
    expect(pageData.title).toBe('Test Landing Page');
    expect(pageData.pageType).toBe('landing');
  });
});
