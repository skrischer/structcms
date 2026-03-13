import { createRegistry, definePageType, defineSection, fields, visibleWhen } from '@structcms/core';

export const HeroSection = defineSection({
  name: 'hero',
  fields: {
    title: fields.string().min(1),
    subtitle: fields.text().optional(),
    image: fields.image().optional(),
    layout: fields.select({ options: ['left', 'center', 'right'] as const }),
    centered: fields.boolean(),
  },
});

export const ContentSection = defineSection({
  name: 'content',
  fields: {
    body: fields.richtext({
      allowedBlocks: ['bold', 'italic', 'heading2', 'heading3', 'link', 'bulletList'],
    }),
  },
});

export const CtaSection = defineSection({
  name: 'cta',
  fields: {
    heading: fields.string().min(1),
    description: fields.text().optional(),
    buttonText: fields.string(),
    buttonUrl: fields.url(),
    buttonStyle: fields.select({
      options: ['primary', 'secondary', 'outline', 'ghost'] as const,
    }),
    openInNewTab: fields.boolean(),
    attachment: visibleWhen(
      fields.file().optional(),
      'buttonStyle',
      ['primary', 'secondary'],
    ),
  },
});

export const LandingPage = definePageType({
  name: 'landing',
  allowedSections: ['hero', 'content', 'cta'],
});

export const BlogPage = definePageType({
  name: 'blog',
  allowedSections: ['content'],
});

export const registry = createRegistry({
  sections: [HeroSection, ContentSection, CtaSection],
  pageTypes: [LandingPage, BlogPage],
});
