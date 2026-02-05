import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  defineNavigation,
  defaultNavigationItemSchema,
  type NavigationItem,
} from './define-navigation';
import { createRegistry } from './registry';
import { defineSection } from './define-section';

describe('defineNavigation', () => {
  it('should create a navigation definition with default schema', () => {
    const MainNav = defineNavigation({ name: 'main' });

    expect(MainNav.name).toBe('main');
    expect(MainNav.schema).toBeDefined();
  });

  it('should create a navigation definition with custom schema', () => {
    const customSchema = z.object({
      label: z.string(),
      href: z.string(),
      icon: z.string().optional(),
    });

    const FooterNav = defineNavigation({
      name: 'footer',
      schema: customSchema,
    });

    expect(FooterNav.name).toBe('footer');
    expect(FooterNav.schema).toBe(customSchema);
  });
});

describe('defaultNavigationItemSchema', () => {
  it('should validate simple navigation items', () => {
    const item: NavigationItem = {
      label: 'Home',
      href: '/',
    };

    const result = defaultNavigationItemSchema.safeParse(item);
    expect(result.success).toBe(true);
  });

  it('should validate navigation items with children', () => {
    const item: NavigationItem = {
      label: 'Products',
      href: '/products',
      children: [
        { label: 'Category A', href: '/products/a' },
        { label: 'Category B', href: '/products/b' },
      ],
    };

    const result = defaultNavigationItemSchema.safeParse(item);
    expect(result.success).toBe(true);
  });

  it('should validate deeply nested navigation', () => {
    const item: NavigationItem = {
      label: 'Level 1',
      href: '/l1',
      children: [
        {
          label: 'Level 2',
          href: '/l1/l2',
          children: [{ label: 'Level 3', href: '/l1/l2/l3' }],
        },
      ],
    };

    const result = defaultNavigationItemSchema.safeParse(item);
    expect(result.success).toBe(true);
  });

  it('should reject invalid navigation items', () => {
    const invalidItem = {
      label: 'Missing href',
    };

    const result = defaultNavigationItemSchema.safeParse(invalidItem);
    expect(result.success).toBe(false);
  });
});

describe('registry navigation support', () => {
  const HeroSection = defineSection({
    name: 'hero',
    fields: { title: z.string() },
  });

  it('should register and retrieve navigation', () => {
    const MainNav = defineNavigation({ name: 'main' });
    const FooterNav = defineNavigation({ name: 'footer' });

    const registry = createRegistry({
      sections: [HeroSection],
      navigations: [MainNav, FooterNav],
    });

    const main = registry.getNavigation('main');
    expect(main).toBeDefined();
    expect(main?.name).toBe('main');
  });

  it('should return undefined for non-existent navigation', () => {
    const registry = createRegistry({
      sections: [HeroSection],
    });

    expect(registry.getNavigation('non-existent')).toBeUndefined();
  });

  it('should return all registered navigations', () => {
    const MainNav = defineNavigation({ name: 'main' });
    const FooterNav = defineNavigation({ name: 'footer' });

    const registry = createRegistry({
      sections: [HeroSection],
      navigations: [MainNav, FooterNav],
    });

    const navigations = registry.getAllNavigations();
    expect(navigations).toHaveLength(2);
    expect(navigations.map((n) => n.name)).toContain('main');
    expect(navigations.map((n) => n.name)).toContain('footer');
  });

  it('should return empty array when no navigations registered', () => {
    const registry = createRegistry({
      sections: [HeroSection],
    });

    expect(registry.getAllNavigations()).toEqual([]);
  });
});
