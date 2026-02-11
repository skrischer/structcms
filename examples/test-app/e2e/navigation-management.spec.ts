import { test, expect } from '@playwright/test';
import { resetAndSeed, BASE_URL } from './helpers';

test.describe('NavigationEditor Item Management', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await resetAndSeed();
  });

  test.afterAll(async () => {
    await resetAndSeed();
  });

  test('should add a navigation item', async ({ page }) => {
    await page.goto('/admin/navigation');

    // Wait for navigation editor to load with seeded items
    await expect(page.locator('[data-testid="nav-item-label-0"]')).toHaveValue('Home');

    // Get current item count before adding
    const response = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(response.ok).toBe(true);
    const initialNavData = await response.json();
    const initialCount = initialNavData.items.length;

    // Add a new item
    await page.locator('[data-testid="nav-add-item"]').click();

    // New empty item should appear at the end
    const newIndex = initialCount;
    const newLabel = page.locator(`[data-testid="nav-item-label-${newIndex}"]`);
    const newHref = page.locator(`[data-testid="nav-item-href-${newIndex}"]`);
    await expect(newLabel).toBeVisible();
    await expect(newLabel).toHaveValue('');

    // Fill in the new item
    await newLabel.fill('Docs');
    await newHref.fill('/docs');

    // Save and wait for PUT request to complete
    const [saveResponse] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/cms/navigation/main') && resp.request().method() === 'PUT'),
      page.locator('[data-testid="nav-save"]').click(),
    ]);
    expect(saveResponse.ok()).toBe(true);

    // Verify via API
    const finalResponse = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(finalResponse.ok).toBe(true);
    const finalNavData = await finalResponse.json();

    expect(finalNavData.items).toHaveLength(initialCount + 1);
    expect(finalNavData.items[newIndex].label).toBe('Docs');
    expect(finalNavData.items[newIndex].href).toBe('/docs');
  });

  test('should remove a navigation item', async ({ page }) => {
    await page.goto('/admin/navigation');

    // Wait for items to load
    await expect(page.locator('[data-testid="nav-item-label-0"]')).toHaveValue('Home');

    // Get current navigation state
    const initialResponse = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(initialResponse.ok).toBe(true);
    const initialNavData = await initialResponse.json();
    const initialCount = initialNavData.items.length;

    // Find Blog item index (it might not be at index 2 if previous tests modified it)
    const blogIndex = initialNavData.items.findIndex((item: { label: string }) => item.label === 'Blog');
    expect(blogIndex).toBeGreaterThanOrEqual(0);

    // Remove Blog
    await page.locator(`[data-testid="nav-item-remove-${blogIndex}"]`).click();

    // Last item index should be gone (items shifted up)
    await expect(page.locator(`[data-testid="nav-item-label-${initialCount - 1}"]`)).not.toBeVisible();

    // Save and wait for PUT request to complete
    const [saveResponse] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/cms/navigation/main') && resp.request().method() === 'PUT'),
      page.locator('[data-testid="nav-save"]').click(),
    ]);
    expect(saveResponse.ok()).toBe(true);

    // Verify via API
    const finalResponse = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(finalResponse.ok).toBe(true);
    const finalNavData = await finalResponse.json();

    expect(finalNavData.items).toHaveLength(initialCount - 1);
    expect(finalNavData.items.find((i: { label: string }) => i.label === 'Blog')).toBeUndefined();
  });

  test('should edit a navigation item', async ({ page }) => {
    await page.goto('/admin/navigation');

    // Wait for items to load
    const homeLabel = page.locator('[data-testid="nav-item-label-0"]');
    await expect(homeLabel).toHaveValue('Home');

    // Change Home label to "Homepage"
    await homeLabel.clear();
    await homeLabel.fill('Homepage');

    // Change Home href to /home
    const homeHref = page.locator('[data-testid="nav-item-href-0"]');
    await homeHref.clear();
    await homeHref.fill('/home');

    // Save and wait for PUT request to complete
    const [saveResponse] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/cms/navigation/main') && resp.request().method() === 'PUT'),
      page.locator('[data-testid="nav-save"]').click(),
    ]);
    expect(saveResponse.ok()).toBe(true);

    // Verify via API
    const response = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(response.ok).toBe(true);
    const navData = await response.json();

    expect(navData.items[0].label).toBe('Homepage');
    expect(navData.items[0].href).toBe('/home');
  });

  test('should add a child item', async ({ page }) => {
    await page.goto('/admin/navigation');

    // Get current state to find first item without children
    const initialResponse = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(initialResponse.ok).toBe(true);
    const initialNavData = await initialResponse.json();
    const targetIndex = initialNavData.items.findIndex((item: { children?: unknown[] }) => !item.children || item.children.length === 0);
    expect(targetIndex).toBeGreaterThanOrEqual(0);

    // Wait for items to load
    await expect(page.locator(`[data-testid="nav-item-label-${targetIndex}"]`)).toBeVisible();

    // Add child to the target item
    await page.locator(`[data-testid="nav-add-child-${targetIndex}"]`).click();

    // New child should appear
    const childLabel = page.locator(`[data-testid="nav-child-label-${targetIndex}-0"]`);
    const childHref = page.locator(`[data-testid="nav-child-href-${targetIndex}-0"]`);
    await expect(childLabel).toBeVisible();
    await expect(childLabel).toHaveValue('');

    // Fill in the child
    await childLabel.fill('Getting Started');
    await childHref.fill('/getting-started');

    // Save and wait for PUT request to complete
    const [saveResponse] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/cms/navigation/main') && resp.request().method() === 'PUT'),
      page.locator('[data-testid="nav-save"]').click(),
    ]);
    expect(saveResponse.ok()).toBe(true);

    // Verify via API
    const response = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(response.ok).toBe(true);
    const navData = await response.json();

    expect(navData.items[targetIndex].children).toHaveLength(1);
    expect(navData.items[targetIndex].children[0].label).toBe('Getting Started');
    expect(navData.items[targetIndex].children[0].href).toBe('/getting-started');
  });

  test('should remove a child item', async ({ page }) => {
    await page.goto('/admin/navigation');

    // Get current state to find an item with multiple children
    const initialResponse = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(initialResponse.ok).toBe(true);
    const initialNavData = await initialResponse.json();
    const parentIndex = initialNavData.items.findIndex((item: { children?: unknown[] }) => item.children && item.children.length >= 2);
    expect(parentIndex).toBeGreaterThanOrEqual(0);
    const initialChildCount = initialNavData.items[parentIndex].children.length;
    const firstChildLabel = initialNavData.items[parentIndex].children[0].label;
    const secondChildLabel = initialNavData.items[parentIndex].children[1].label;

    // Wait for children to load
    await expect(page.locator(`[data-testid="nav-child-label-${parentIndex}-0"]`)).toHaveValue(firstChildLabel);
    await expect(page.locator(`[data-testid="nav-child-label-${parentIndex}-1"]`)).toHaveValue(secondChildLabel);

    // Remove first child
    await page.locator(`[data-testid="nav-child-remove-${parentIndex}-0"]`).click();

    // Second child should now be at index 0
    await expect(page.locator(`[data-testid="nav-child-label-${parentIndex}-0"]`)).toHaveValue(secondChildLabel);
    await expect(page.locator(`[data-testid="nav-child-label-${parentIndex}-${initialChildCount - 1}"]`)).not.toBeVisible();

    // Save and wait for PUT request to complete
    const [saveResponse] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/cms/navigation/main') && resp.request().method() === 'PUT'),
      page.locator('[data-testid="nav-save"]').click(),
    ]);
    expect(saveResponse.ok()).toBe(true);

    // Verify via API
    const response = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(response.ok).toBe(true);
    const navData = await response.json();

    expect(navData.items[parentIndex].children).toHaveLength(initialChildCount - 1);
    expect(navData.items[parentIndex].children[0].label).toBe(secondChildLabel);
  });
});
