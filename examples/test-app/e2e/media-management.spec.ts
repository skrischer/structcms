import path from 'node:path';
import { expect, test } from '@playwright/test';
import { BASE_URL, resetAndSeed, resetOnly } from './helpers';

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType?: string;
  createdAt?: string;
}

test.describe('MediaBrowser Grid and Delete', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await resetOnly();
  });

  test.afterAll(async () => {
    await resetAndSeed();
  });

  test('should show empty state when no media exists', async ({ page }) => {
    await page.goto('/admin/media');

    const emptyState = page.locator('[data-testid="empty-state"]');
    await expect(emptyState).toBeVisible({ timeout: 10000 });
    await expect(emptyState).toContainText('No media files yet');
  });

  test('should display uploaded image in grid', async ({ page }) => {
    await page.goto('/admin/media');

    // Wait for initial load to complete (empty state or grid)
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible({ timeout: 10000 });

    // Upload test image
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');
    await page.locator('[data-testid="file-input"]').setInputFiles(testImagePath);

    // Wait for grid to appear after upload
    const grid = page.locator('[data-testid="media-grid"]');
    await expect(grid).toBeVisible({ timeout: 10000 });

    // Verify a media item appears in the grid
    const mediaItems = grid.locator('[data-testid^="media-item-"]');
    await expect(mediaItems).toHaveCount(1);

    // Verify the image thumbnail is visible
    await expect(mediaItems.first().locator('img')).toBeVisible();

    // Verify filename is displayed
    await expect(mediaItems.first()).toContainText('test-image');

    // Verify via API
    const response = await fetch(`${BASE_URL}/api/cms/media`);
    expect(response.ok).toBe(true);
    const mediaList: MediaItem[] = await response.json();
    expect(mediaList.length).toBe(1);
    expect(mediaList[0]?.filename).toContain('test-image');
  });

  test('should delete media item', async ({ page }) => {
    // First upload an image via API for faster setup
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');
    const fs = await import('node:fs');
    const fileBuffer = fs.readFileSync(testImagePath);
    const blob = new Blob([fileBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', blob, 'delete-test-image.png');

    const uploadResponse = await fetch(`${BASE_URL}/api/cms/media`, {
      method: 'POST',
      body: formData,
    });
    expect(uploadResponse.ok).toBe(true);

    await page.goto('/admin/media');

    // Wait for grid to load with the uploaded image
    const grid = page.locator('[data-testid="media-grid"]');
    await expect(grid).toBeVisible({ timeout: 10000 });

    // Get all media items and find our delete test image
    const mediaItems = grid.locator('[data-testid^="media-item-"]');
    const itemCount = await mediaItems.count();
    expect(itemCount).toBeGreaterThan(0);

    // Find the delete test image item
    const deleteTestItem = grid
      .locator('[data-testid^="media-item-"]')
      .filter({ hasText: 'delete-test-image' })
      .first();
    await expect(deleteTestItem).toBeVisible();

    // Get the delete button for our specific item
    const deleteButton = deleteTestItem.locator('[data-testid^="media-delete-"]');
    await deleteButton.click();

    // Item should disappear from grid (optimistic UI update)
    await expect(deleteTestItem).not.toBeVisible();

    // Verify via API that media was actually deleted
    const response = await fetch(`${BASE_URL}/api/cms/media`);
    expect(response.ok).toBe(true);
    const mediaList: MediaItem[] = await response.json();
    expect(
      mediaList.find((item: MediaItem) => item.filename.includes('delete-test-image'))
    ).toBeUndefined();
  });

  test('should display select button for each media item', async ({ page }) => {
    // Upload an image via API
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');
    const fs = await import('node:fs');
    const fileBuffer = fs.readFileSync(testImagePath);
    const blob = new Blob([fileBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', blob, 'test-image.png');

    await fetch(`${BASE_URL}/api/cms/media`, {
      method: 'POST',
      body: formData,
    });

    await page.goto('/admin/media');

    // Wait for grid
    const grid = page.locator('[data-testid="media-grid"]');
    await expect(grid).toBeVisible({ timeout: 10000 });

    // Verify select button exists
    const selectButton = grid.locator('[data-testid^="media-select-"]').first();
    await expect(selectButton).toBeVisible();

    // Verify it's clickable (no onSelect handler in test-app, but button should exist)
    await expect(selectButton).toBeEnabled();
  });

  test('should show load more button when many items exist', async ({ page }) => {
    // Upload 13 images via API to exceed default pageSize of 12
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');
    const fs = await import('node:fs');
    const fileBuffer = fs.readFileSync(testImagePath);

    const uploadPromises = [];
    for (let i = 0; i < 13; i++) {
      const blob = new Blob([fileBuffer], { type: 'image/png' });
      const formData = new FormData();
      formData.append('file', blob, `test-image-${i}.png`);
      uploadPromises.push(
        fetch(`${BASE_URL}/api/cms/media`, {
          method: 'POST',
          body: formData,
        })
      );
    }
    await Promise.all(uploadPromises);

    await page.goto('/admin/media');

    // Wait for grid to load
    const grid = page.locator('[data-testid="media-grid"]');
    await expect(grid).toBeVisible({ timeout: 15000 });

    // Verify items are displayed
    const mediaItems = grid.locator('[data-testid^="media-item-"]');
    const count = await mediaItems.count();
    expect(count).toBeGreaterThanOrEqual(12);

    // Load more button should be visible since items >= pageSize
    await expect(page.locator('[data-testid="load-more"]')).toBeVisible();
  });
});
