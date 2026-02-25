import type { CreateNavigationInput, CreatePageInput, NavigationItem } from '@structcms/api';

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
    slug: 'blog',
    pageType: 'blog',
    title: 'Blog',
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
  {
    slug: 'about/team',
    pageType: 'landing',
    title: 'Our Team',
    sections: [
      {
        id: 'hero-4',
        type: 'hero',
        data: {
          title: 'Our Team',
          subtitle: 'The people behind StructCMS.',
        },
      },
      {
        id: 'content-4',
        type: 'content',
        data: {
          body: '<p>StructCMS is built by a passionate team of developers who believe in code-first content management.</p>',
        },
      },
    ],
  },
  {
    slug: 'about/contact',
    pageType: 'landing',
    title: 'Contact',
    sections: [
      {
        id: 'hero-5',
        type: 'hero',
        data: {
          title: 'Contact Us',
          subtitle: 'Get in touch with the StructCMS team.',
        },
      },
      {
        id: 'content-5',
        type: 'content',
        data: {
          body: '<p>Have questions or feedback? We would love to hear from you. Reach out via GitHub Issues or Discussions.</p>',
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
