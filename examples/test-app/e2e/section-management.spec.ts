import { expect, test } from '@playwright/test';
import { BASE_URL, resetAndSeed } from './helpers';

interface PageResponse {
  id: string;
  slug: string;
  title: string;
  pageType: string;
  sections: Array<{ type: string; data: Record<string, unknown> }>;
}

test.describe('PageEditor Section Management', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await resetAndSeed();
  });

  test.afterAll(async () => {
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
    expect(pageData.sections[2]?.type).toBe('content');
  });

  test('should remove a section', async ({ page }) => {
    await page.goto('/admin/pages/home');

    // Get current page state (cumulative: previous test added a section)
    const initialResponse = await fetch(`${BASE_URL}/api/cms/pages/home`);
    expect(initialResponse.ok).toBe(true);
    const initialPageData: PageResponse = await initialResponse.json();
    const initialCount = initialPageData.sections.length;

    // Wait for all sections to load
    await expect(page.locator('[data-testid="page-section-0"]')).toBeVisible({ timeout: 10000 });

    // Remove the last section
    const removeIndex = initialCount - 1;
    await page.locator(`[data-testid="section-remove-${removeIndex}"]`).click();

    // Removed section should be gone
    await expect(page.locator(`[data-testid="page-section-${removeIndex}"]`)).not.toBeVisible();

    // Save
    await page.locator('[data-testid="save-page"]').click();
    await page.waitForURL('/admin/pages');

    // Verify via API
    const finalResponse = await fetch(`${BASE_URL}/api/cms/pages/home`);
    expect(finalResponse.ok).toBe(true);
    const finalPageData: PageResponse = await finalResponse.json();

    expect(finalPageData.sections).toHaveLength(initialCount - 1);
  });

  test('should move a section up', async ({ page }) => {
    await page.goto('/admin/pages/home');

    // Wait for sections to load
    await expect(page.locator('[data-testid="page-section-0"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="page-section-1"]')).toBeVisible();

    // Get current page state
    const initialResponse = await fetch(`${BASE_URL}/api/cms/pages/home`);
    expect(initialResponse.ok).toBe(true);
    const initialPageData: PageResponse = await initialResponse.json();
    const sectionCount = initialPageData.sections.length;
    const firstType = initialPageData.sections[0]?.type;
    const secondType = initialPageData.sections[1]?.type;

    // Move section at index 1 up — should swap with index 0
    await page.locator('[data-testid="section-move-up-1"]').click();

    // Save
    await page.locator('[data-testid="save-page"]').click();
    await page.waitForURL('/admin/pages');

    // Verify via API — sections should be swapped
    const finalResponse = await fetch(`${BASE_URL}/api/cms/pages/home`);
    expect(finalResponse.ok).toBe(true);
    const finalPageData: PageResponse = await finalResponse.json();

    expect(finalPageData.sections).toHaveLength(sectionCount);
    expect(finalPageData.sections[0]?.type).toBe(secondType);
    expect(finalPageData.sections[1]?.type).toBe(firstType);
  });

  test('should move a section down', async ({ page }) => {
    await page.goto('/admin/pages/home');

    // Wait for sections to load
    await expect(page.locator('[data-testid="page-section-0"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="page-section-1"]')).toBeVisible();

    // Get current page state
    const initialResponse = await fetch(`${BASE_URL}/api/cms/pages/home`);
    expect(initialResponse.ok).toBe(true);
    const initialPageData: PageResponse = await initialResponse.json();
    const sectionCount = initialPageData.sections.length;
    const firstType = initialPageData.sections[0]?.type;
    const secondType = initialPageData.sections[1]?.type;

    // Move section at index 0 down — should swap with index 1
    await page.locator('[data-testid="section-move-down-0"]').click();

    // Save
    await page.locator('[data-testid="save-page"]').click();
    await page.waitForURL('/admin/pages');

    // Verify via API — sections should be swapped
    const finalResponse = await fetch(`${BASE_URL}/api/cms/pages/home`);
    expect(finalResponse.ok).toBe(true);
    const finalPageData: PageResponse = await finalResponse.json();

    expect(finalPageData.sections).toHaveLength(sectionCount);
    expect(finalPageData.sections[0]?.type).toBe(secondType);
    expect(finalPageData.sections[1]?.type).toBe(firstType);
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

    // New hero section should appear at the end
    const initialResponse = await fetch(`${BASE_URL}/api/cms/pages/home`);
    const initialPageData: PageResponse = await initialResponse.json();
    const newSectionIndex = initialPageData.sections.length;
    const newSection = page.locator(`[data-testid="page-section-${newSectionIndex}"]`);
    await expect(newSection).toBeVisible();

    // Hero has: title (string input), subtitle (textarea), image (image picker)
    await expect(newSection.locator('input[name="title"]')).toBeVisible();
    await expect(newSection.locator('textarea[name="subtitle"]')).toBeVisible();
  });
});
