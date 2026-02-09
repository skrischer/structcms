import { test, expect } from '@playwright/test';
import { resetAndSeed, BASE_URL } from './helpers';

test.describe('NavigationEditor Item Management', () => {
  test.beforeEach(async () => {
    await resetAndSeed();
  });

  test('should add a navigation item', async ({ page }) => {
    await page.goto('/admin/navigation');

    // Wait for navigation editor to load with seeded items
    await expect(page.locator('[data-testid="nav-item-label-0"]')).toHaveValue('Home');

    // Seed has 3 items (Home, About, Blog) — add a 4th
    await page.locator('[data-testid="nav-add-item"]').click();

    // New empty item should appear at index 3
    const newLabel = page.locator('[data-testid="nav-item-label-3"]');
    const newHref = page.locator('[data-testid="nav-item-href-3"]');
    await expect(newLabel).toBeVisible();
    await expect(newLabel).toHaveValue('');

    // Fill in the new item
    await newLabel.fill('Docs');
    await newHref.fill('/docs');

    // Save
    await page.locator('[data-testid="nav-save"]').click();

    // Verify via API
    const response = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(response.ok).toBe(true);
    const navData = await response.json();

    expect(navData.items).toHaveLength(4);
    expect(navData.items[3].label).toBe('Docs');
    expect(navData.items[3].href).toBe('/docs');
  });

  test('should remove a navigation item', async ({ page }) => {
    await page.goto('/admin/navigation');

    // Wait for items to load
    await expect(page.locator('[data-testid="nav-item-label-2"]')).toHaveValue('Blog');

    // Remove Blog (index 2)
    await page.locator('[data-testid="nav-item-remove-2"]').click();

    // Blog row should be gone — only 2 items remain
    await expect(page.locator('[data-testid="nav-item-label-2"]')).not.toBeVisible();

    // Save
    await page.locator('[data-testid="nav-save"]').click();

    // Verify via API
    const response = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(response.ok).toBe(true);
    const navData = await response.json();

    expect(navData.items).toHaveLength(2);
    expect(navData.items.find((i: { label: string }) => i.label === 'Blog')).toBeUndefined();
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

    // Save
    await page.locator('[data-testid="nav-save"]').click();

    // Verify via API
    const response = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(response.ok).toBe(true);
    const navData = await response.json();

    expect(navData.items[0].label).toBe('Homepage');
    expect(navData.items[0].href).toBe('/home');
  });

  test('should add a child item', async ({ page }) => {
    await page.goto('/admin/navigation');

    // Wait for items to load
    await expect(page.locator('[data-testid="nav-item-label-0"]')).toHaveValue('Home');

    // Add child to Home (index 0) — Home initially has no children
    await page.locator('[data-testid="nav-add-child-0"]').click();

    // New child should appear
    const childLabel = page.locator('[data-testid="nav-child-label-0-0"]');
    const childHref = page.locator('[data-testid="nav-child-href-0-0"]');
    await expect(childLabel).toBeVisible();
    await expect(childLabel).toHaveValue('');

    // Fill in the child
    await childLabel.fill('Getting Started');
    await childHref.fill('/getting-started');

    // Save
    await page.locator('[data-testid="nav-save"]').click();

    // Verify via API
    const response = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(response.ok).toBe(true);
    const navData = await response.json();

    expect(navData.items[0].children).toHaveLength(1);
    expect(navData.items[0].children[0].label).toBe('Getting Started');
    expect(navData.items[0].children[0].href).toBe('/getting-started');
  });

  test('should remove a child item', async ({ page }) => {
    await page.goto('/admin/navigation');

    // Wait for items to load — About (index 1) has 2 children: Our Team, Contact
    await expect(page.locator('[data-testid="nav-child-label-1-0"]')).toHaveValue('Our Team');
    await expect(page.locator('[data-testid="nav-child-label-1-1"]')).toHaveValue('Contact');

    // Remove first child (Our Team)
    await page.locator('[data-testid="nav-child-remove-1-0"]').click();

    // Only Contact should remain (now at index 0)
    await expect(page.locator('[data-testid="nav-child-label-1-0"]')).toHaveValue('Contact');
    await expect(page.locator('[data-testid="nav-child-label-1-1"]')).not.toBeVisible();

    // Save
    await page.locator('[data-testid="nav-save"]').click();

    // Verify via API
    const response = await fetch(`${BASE_URL}/api/cms/navigation/main`);
    expect(response.ok).toBe(true);
    const navData = await response.json();

    expect(navData.items[1].children).toHaveLength(1);
    expect(navData.items[1].children[0].label).toBe('Contact');
  });
});
