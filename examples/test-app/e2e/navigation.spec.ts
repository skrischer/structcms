import { expect, test } from '@playwright/test';
import { BASE_URL, resetAndSeed } from './helpers';

test.describe('Navigation Editor', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await resetAndSeed();
  });

  test.afterAll(async () => {
    await resetAndSeed();
  });

  test('should display and edit navigation', async ({ page }) => {
    await page.goto('/admin/navigation');

    await expect(page.locator('text=Navigation: main')).toBeVisible();

    // NavigationEditor renders labels as input values, not text content
    await expect(page.locator('[data-testid="nav-item-label-0"]')).toHaveValue('Home');
    await expect(page.locator('[data-testid="nav-item-label-1"]')).toHaveValue('About');
    await expect(page.locator('[data-testid="nav-item-label-2"]')).toHaveValue('Blog');

    // Use data-testid to avoid ambiguity with NavigationPage's own save button
    await page.locator('[data-testid="nav-save"]').click();

    const response = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(response.ok).toBe(true);
    const navData = await response.json();

    expect(navData.items.length).toBeGreaterThan(0);
    expect(navData.items[0].label).toBe('Home');
  });
});
