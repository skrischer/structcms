import { test, expect } from '@playwright/test';
import { resetOnly, BASE_URL } from './helpers';
import path from 'path';

test.describe('Upload Media', () => {
  test.beforeEach(async () => {
    await resetOnly();
  });

  test('should upload an image and verify it appears', async ({ page }) => {
    await page.goto('/media');

    const fileInput = page.locator('input[type="file"]');
    
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');
    
    await fileInput.setInputFiles(testImagePath);

    await page.waitForTimeout(2000);

    const response = await fetch(`${BASE_URL}/api/cms/media`);
    expect(response.ok).toBe(true);
    const mediaList = await response.json();
    
    expect(mediaList.length).toBeGreaterThan(0);
    const uploadedImage = mediaList.find((m: { filename: string }) => m.filename.includes('test-image'));
    expect(uploadedImage).toBeDefined();
  });
});
