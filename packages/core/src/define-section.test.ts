import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { defineSection } from './define-section';

describe('defineSection', () => {
  it('should create a section definition with name and schema', () => {
    const HeroSection = defineSection({
      name: 'hero',
      fields: {
        title: z.string().min(1),
        subtitle: z.string().optional(),
      },
    });

    expect(HeroSection.name).toBe('hero');
    expect(HeroSection.schema).toBeDefined();
  });

  it('should validate data against the schema', () => {
    const HeroSection = defineSection({
      name: 'hero',
      fields: {
        title: z.string().min(1),
        subtitle: z.string().optional(),
      },
    });

    const validData = { title: 'Hello World' };
    const result = HeroSection.schema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Hello World');
      expect(result.data.subtitle).toBeUndefined();
    }
  });

  it('should reject invalid data', () => {
    const HeroSection = defineSection({
      name: 'hero',
      fields: {
        title: z.string().min(1),
      },
    });

    const invalidData = { title: '' };
    const result = HeroSection.schema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('should handle complex nested schemas', () => {
    const CardSection = defineSection({
      name: 'card',
      fields: {
        title: z.string(),
        cta: z
          .object({
            label: z.string(),
            href: z.string().url(),
          })
          .optional(),
      },
    });

    const validData = {
      title: 'Card Title',
      cta: {
        label: 'Click me',
        href: 'https://example.com',
      },
    };

    const result = CardSection.schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should infer correct TypeScript types', () => {
    const TestSection = defineSection({
      name: 'test',
      fields: {
        requiredString: z.string(),
        optionalNumber: z.number().optional(),
        nestedObject: z.object({
          nested: z.boolean(),
        }),
      },
    });

    type TestType = typeof TestSection._type;

    const testData: TestType = {
      requiredString: 'hello',
      nestedObject: { nested: true },
    };

    const result = TestSection.schema.safeParse(testData);
    expect(result.success).toBe(true);
  });
});
