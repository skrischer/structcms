import type { CreatePageInput, CreateNavigationInput, NavigationItem } from '@structcms/api';

export const seedPages: CreatePageInput[] = [
  {
    slug: 'home',
    pageType: 'landing',
    title: 'Home',
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        data: {
          title: 'Welcome to StructCMS',
          subtitle: 'A code-first, installable headless CMS framework for developers.',
          image: '',
        },
      },
      {
        id: 'content-1',
        type: 'content',
        data: {
          body: '<p>StructCMS empowers developers to define content models in TypeScript and embed a full CMS experience directly into their projects.</p>',
        },
      },
    ],
  },
  {
    slug: 'about',
    pageType: 'landing',
    title: 'About Us',
    sections: [
      {
        id: 'hero-2',
        type: 'hero',
        data: {
          title: 'About StructCMS',
          subtitle: 'Built by developers, for developers.',
        },
      },
      {
        id: 'content-2',
        type: 'content',
        data: {
          body: '<p>We believe content management should be as flexible as your code. StructCMS brings the power of TypeScript schemas to content modeling.</p>',
        },
      },
    ],
  },
  {
    slug: 'blog-post-example',
    pageType: 'blog',
    title: 'Blog Post Example',
    sections: [
      {
        id: 'content-3',
        type: 'content',
        data: {
          body: '<h2>Getting Started with StructCMS</h2><p>This is an example blog post demonstrating the content section type. You can use rich text formatting including <strong>bold</strong>, <em>italic</em>, and more.</p><p>StructCMS supports multiple section types that you define in your registry.</p>',
        },
      },
    ],
  },
];

const mainNavigationItems: NavigationItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
    children: [
      {
        label: 'Our Team',
        href: '/about/team',
      },
      {
        label: 'Contact',
        href: '/about/contact',
      },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
  },
];

export const seedNavigations: CreateNavigationInput[] = [
  {
    name: 'main',
    items: mainNavigationItems,
  },
];
