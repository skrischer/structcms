import { test, expect } from '@playwright/test';
import { resetAndSeed, BASE_URL } from './helpers';

test.describe('Navigation Editor', () => {
  test.beforeEach(async () => {
    await resetAndSeed();
  });

  test('should display and edit navigation', async ({ page }) => {
    await page.goto('/admin/navigation');

    await expect(page.locator('text=Navigation: main')).toBeVisible();

    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=About')).toBeVisible();
    await expect(page.locator('text=Blog')).toBeVisible();

    await page.click('text=Save Navigation');

    const response = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(response.ok).toBe(true);
    const navData = await response.json();
    
    expect(navData.items.length).toBeGreaterThan(0);
    expect(navData.items[0].label).toBe('Home');
  });
});
