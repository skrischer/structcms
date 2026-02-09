import { test, expect } from '@playwright/test';
import { resetAndSeed, BASE_URL } from './helpers';

interface PageResponse {
  id: string;
  slug: string;
  title: string;
  pageType: string;
  sections: Array<{ type: string; data: Record<string, unknown> }>;
}

test.describe('PageEditor Section Management', () => {
  test.beforeEach(async () => {
    await resetAndSeed();
  });

  test('should add a section', async ({ page }) => {
    await page.goto('/admin/pages/home');

    // Wait for page editor to load with seeded sections (hero + content)
    await expect(page.locator('[data-testid="page-section-0"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="page-section-1"]')).toBeVisible();

    // Select "content" in type dropdown and click Add Section
    await page.locator('[data-testid="section-type-select"]').selectOption('content');
    await page.locator('[data-testid="add-section"]').click();

    // New section should appear at index 2
    await expect(page.locator('[data-testid="page-section-2"]')).toBeVisible();

    // Save
    await page.locator('[data-testid="save-page"]').click();

    // Wait for redirect to page list
    await page.waitForURL('/admin/pages');

    // Verify via API
    const response = await fetch(`${BASE_URL}/api/cms/pages/home`);
    expect(response.ok).toBe(true);
    const pageData: PageResponse = await response.json();

    expect(pageData.sections).toHaveLength(3);
    expect(pageData.sections[2]!.type).toBe('content');
  });

  test('should remove a section', async ({ page }) => {
    await page.goto('/admin/pages/home');

    // Wait for both sections to load
    await expect(page.locator('[data-testid="page-section-0"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="page-section-1"]')).toBeVisible();

    // Remove content section (index 1)
    await page.locator('[data-testid="section-remove-1"]').click();

    // Only hero section should remain
    await expect(page.locator('[data-testid="page-section-0"]')).toBeVisible();
    await expect(page.locator('[data-testid="page-section-1"]')).not.toBeVisible();

    // Save
    await page.locator('[data-testid="save-page"]').click();
    await page.waitForURL('/admin/pages');

    // Verify via API
    const response = await fetch(`${BASE_URL}/api/cms/pages/home`);
    expect(response.ok).toBe(true);
    const pageData: PageResponse = await response.json();

    expect(pageData.sections).toHaveLength(1);
    expect(pageData.sections[0]!.type).toBe('hero');
  });

  test('should move a section up', async ({ page }) => {
    await page.goto('/admin/pages/home');

    // Wait for sections to load — hero (0), content (1)
    await expect(page.locator('[data-testid="page-section-0"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="page-section-1"]')).toBeVisible();

    // Move content (index 1) up — should swap with hero
    await page.locator('[data-testid="section-move-up-1"]').click();

    // Save
    await page.locator('[data-testid="save-page"]').click();
    await page.waitForURL('/admin/pages');

    // Verify via API — content should now be first, hero second
    const response = await fetch(`${BASE_URL}/api/cms/pages/home`);
    expect(response.ok).toBe(true);
    const pageData: PageResponse = await response.json();

    expect(pageData.sections).toHaveLength(2);
    expect(pageData.sections[0]!.type).toBe('content');
    expect(pageData.sections[1]!.type).toBe('hero');
  });

  test('should move a section down', async ({ page }) => {
    await page.goto('/admin/pages/home');

    // Wait for sections to load — hero (0), content (1)
    await expect(page.locator('[data-testid="page-section-0"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="page-section-1"]')).toBeVisible();

    // Move hero (index 0) down — should swap with content
    await page.locator('[data-testid="section-move-down-0"]').click();

    // Save
    await page.locator('[data-testid="save-page"]').click();
    await page.waitForURL('/admin/pages');

    // Verify via API — content should now be first, hero second
    const response = await fetch(`${BASE_URL}/api/cms/pages/home`);
    expect(response.ok).toBe(true);
    const pageData: PageResponse = await response.json();

    expect(pageData.sections).toHaveLength(2);
    expect(pageData.sections[0]!.type).toBe('content');
    expect(pageData.sections[1]!.type).toBe('hero');
  });

  test('should show appropriate form fields for section type', async ({ page }) => {
    await page.goto('/admin/pages/home');

    // Wait for page editor to load
    await expect(page.locator('[data-testid="page-section-0"]')).toBeVisible({ timeout: 10000 });

    // Verify section type select has both options
    const typeSelect = page.locator('[data-testid="section-type-select"]');
    await expect(typeSelect.locator('option')).toHaveCount(2);
    await expect(typeSelect.locator('option[value="hero"]')).toBeAttached();
    await expect(typeSelect.locator('option[value="content"]')).toBeAttached();

    // Add a hero section
    await typeSelect.selectOption('hero');
    await page.locator('[data-testid="add-section"]').click();

    // New hero section at index 2 should have hero-specific fields
    const newSection = page.locator('[data-testid="page-section-2"]');
    await expect(newSection).toBeVisible();

    // Hero has: title (string input), subtitle (textarea), image (image picker)
    await expect(newSection.locator('input[name="title"]')).toBeVisible();
    await expect(newSection.locator('textarea[name="subtitle"]')).toBeVisible();
  });
});
