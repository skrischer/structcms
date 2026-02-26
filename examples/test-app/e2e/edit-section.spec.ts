import path from 'node:path';
import { expect, test } from '@playwright/test';
import { BASE_URL, resetAndSeed } from './helpers';

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

  test('should open ImagePicker media browser dialog and select an image', async ({ page }) => {
    // First upload a media item so the MediaBrowser has something to show
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');
    await page.goto('/admin/media');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    // Wait for upload to complete and image to appear in grid
    await expect(async () => {
      const mediaResponse = await fetch(`${BASE_URL}/api/cms/media`);
      const mediaItems = await mediaResponse.json();
      expect(mediaItems.length).toBeGreaterThan(0);
    }).toPass({ timeout: 10000 });

    // Get the uploaded media URL for later verification
    const mediaResponse = await fetch(`${BASE_URL}/api/cms/media`);
    const mediaItems: Array<{ id: string; url: string }> = await mediaResponse.json();
    // biome-ignore lint/style/noNonNullAssertion: Test ensures media was uploaded
    const uploadedItem = mediaItems[0]!;

    // Navigate to edit page with hero section
    await page.goto('/admin/pages/home');

    // Find the ImagePicker "Browse Media" button inside the section editor
    const browseButton = page.locator('[data-testid="browse-button"]').first();
    await expect(browseButton).toBeVisible({ timeout: 10000 });

    // Click Browse Media — should open built-in dialog
    await browseButton.click();

    // Verify dialog opened with MediaBrowser
    const dialogOverlay = page.locator('[data-testid="dialog-overlay"]');
    await expect(dialogOverlay).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="dialog-content"]')).toBeVisible();
    await expect(page.locator('[data-testid="media-browser"]')).toBeVisible();

    // Select the uploaded media item
    const mediaSelect = page.locator(`[data-testid="media-select-${uploadedItem.id}"]`);
    await expect(mediaSelect).toBeVisible({ timeout: 10000 });
    await mediaSelect.click();

    // Dialog should close after selection
    await expect(dialogOverlay).not.toBeVisible();

    // Image preview should now be visible in the ImagePicker
    await expect(page.locator('[data-testid="image-preview"]').first()).toBeVisible();
  });
});
