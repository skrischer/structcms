import { test, expect } from '@playwright/test';
import { resetAndSeed, BASE_URL } from './helpers';

test.describe('Edit Section', () => {
  test.beforeEach(async () => {
    await resetAndSeed();
  });

  test('should edit hero section title', async ({ page }) => {
    await page.goto('/pages/home');

    await page.waitForSelector('input[value="Welcome to StructCMS"]');

    await page.fill('input[value="Welcome to StructCMS"]', 'Updated Hero Title');

    await page.click('text=Save Page');

    await page.waitForURL('/pages');

    const response = await fetch(`${BASE_URL}/api/cms/pages/home`);
    expect(response.ok).toBe(true);
    const pageData = await response.json();
    
    const heroSection = pageData.sections.find((s: { type: string }) => s.type === 'hero');
    expect(heroSection).toBeDefined();
    expect(heroSection.data.title).toBe('Updated Hero Title');
  });
});
