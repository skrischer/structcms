import { createRegistry, definePageType, defineSection, fields } from '@structcms/core';

export const HeroSection = defineSection({
  name: 'hero',
  fields: {
    title: fields.string().min(1),
    subtitle: fields.text().optional(),
    image: fields.image().optional(),
  },
});

export const ContentSection = defineSection({
  name: 'content',
  fields: {
    body: fields.richtext(),
  },
});

export const LandingPage = definePageType({
  name: 'landing',
  allowedSections: ['hero', 'content'],
});

export const BlogPage = definePageType({
  name: 'blog',
  allowedSections: ['content'],
});

export const registry = createRegistry({
  sections: [HeroSection, ContentSection],
  pageTypes: [LandingPage, BlogPage],
});
