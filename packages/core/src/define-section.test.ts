import { describe, it, expect, expectTypeOf } from 'vitest';
import { z } from 'zod';
import { defineSection } from './define-section';
import type { InferSectionData } from './types';

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

    type TestType = InferSectionData<typeof TestSection>;

    const testData: TestType = {
      requiredString: 'hello',
      nestedObject: { nested: true },
    };

    const result = TestSection.schema.safeParse(testData);
    expect(result.success).toBe(true);
  });
});

describe('Type Inference', () => {
  it('should infer types via z.infer<typeof section.schema>', () => {
    const HeroSection = defineSection({
      name: 'hero',
      fields: {
        title: z.string(),
        subtitle: z.string().optional(),
      },
    });

    type HeroData = z.infer<typeof HeroSection.schema>;

    expectTypeOf<HeroData>().toEqualTypeOf<{
      title: string;
      subtitle?: string | undefined;
    }>();
  });

  it('should type optional fields as T | undefined', () => {
    const Section = defineSection({
      name: 'test',
      fields: {
        required: z.string(),
        optional: z.string().optional(),
        nullable: z.string().nullable(),
        optionalNullable: z.string().optional().nullable(),
      },
    });

    type Data = z.infer<typeof Section.schema>;

    expectTypeOf<Data['required']>().toEqualTypeOf<string>();
    expectTypeOf<Data['optional']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Data['nullable']>().toEqualTypeOf<string | null>();
    expectTypeOf<Data['optionalNullable']>().toEqualTypeOf<
      string | null | undefined
    >();
  });

  it('should preserve nested object type structure', () => {
    const Section = defineSection({
      name: 'nested',
      fields: {
        cta: z.object({
          label: z.string(),
          href: z.string(),
          external: z.boolean().optional(),
        }),
        items: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
          })
        ),
      },
    });

    type Data = z.infer<typeof Section.schema>;

    expectTypeOf<Data['cta']>().toEqualTypeOf<{
      label: string;
      href: string;
      external?: boolean | undefined;
    }>();

    expectTypeOf<Data['items']>().toEqualTypeOf<
      Array<{ id: number; name: string }>
    >();
  });

  it('should work with InferSectionData utility type', () => {
    const HeroSection = defineSection({
      name: 'hero',
      fields: {
        title: z.string(),
        image: z.string().url(),
      },
    });

    type HeroData = InferSectionData<typeof HeroSection>;

    expectTypeOf<HeroData>().toEqualTypeOf<{
      title: string;
      image: string;
    }>();
  });
});
