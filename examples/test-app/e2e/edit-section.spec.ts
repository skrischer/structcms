import { test, expect } from '@playwright/test';
import { resetAndSeed, BASE_URL } from './helpers';

test.describe('Edit Section', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await resetAndSeed();
  });

  test.afterAll(async () => {
    await resetAndSeed();
  });

  test('should edit hero section title', async ({ page }) => {
    await page.goto('/admin/pages/home');

    // Scope to section-editor to avoid matching the page-level title input
    const titleInput = page.locator('[data-testid="section-editor"] input[name="title"]').first();
    await expect(titleInput).toBeVisible();

    await titleInput.fill('Updated Hero Title');

    await page.locator('[data-testid="save-page"]').click();

    await page.waitForURL('/admin/pages');

    const response = await fetch(`${BASE_URL}/api/cms/pages/home`);
    expect(response.ok).toBe(true);
    const pageData = await response.json();

    const heroSection = pageData.sections.find((s: { type: string }) => s.type === 'hero');
    expect(heroSection).toBeDefined();
    expect(heroSection.data.title).toBe('Updated Hero Title');
  });
});
