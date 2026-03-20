import {
  createRegistry,
  definePageType,
  defineSection,
  fields,
  visibleWhen,
} from "@structcms/core";
import { buttonFields } from "./modules";

export const HeroSection = defineSection({
  name: "hero",
  fields: {
    title: fields.string().min(1),
    subtitle: fields.text().optional(),
    image: fields.image().optional(),
    layout: fields.select({ options: ["left", "center", "right"] as const }),
    centered: fields.boolean(),
  },
});

export const ContentSection = defineSection({
  name: "content",
  fields: {
    body: fields.richtext({
      allowedBlocks: [
        "bold",
        "italic",
        "heading2",
        "heading3",
        "link",
        "bulletList",
      ],
    }),
  },
});

export const CtaSection = defineSection({
  name: "cta",
  fields: {
    heading: fields.string().min(1),
    description: fields.text().optional(),
    buttonText: fields.string(),
    buttonUrl: fields.url(),
    buttonStyle: fields.select({
      options: ["primary", "secondary", "outline", "ghost"] as const,
    }),
    openInNewTab: fields.boolean(),
    attachment: visibleWhen(fields.file().optional(), "buttonStyle", [
      "primary",
      "secondary",
    ]),
  },
});

export const ShowcaseSection = defineSection({
  name: "showcase",
  fields: {
    // Content
    title: fields.string().min(1),
    subtitle: fields.string().optional(),
    summary: fields.text().optional(),
    body: fields.richtext({
      allowedBlocks: [
        "bold",
        "italic",
        "heading2",
        "heading3",
        "link",
        "bulletList",
      ],
    }),
    // Media
    image: fields.image().optional(),
    grid: fields
      .array(
        fields.object({
          title: fields.string(),
          image: fields.image(),
        }),
      )
      .optional(),
    attachment: fields.file().optional(),
    // Appearance
    layout: fields.select({ options: ["default", "cards", "grid"] as const }),
    theme: fields.select({ options: ["light", "dark", "auto"] as const }),
    showCaption: visibleWhen(fields.boolean(), "layout", ["cards", "grid"]),
    // Call to Action
    externalUrl: fields.url().optional(),
    showButton: fields.boolean(),
    button: visibleWhen(buttonFields().optional(), "showButton", true),
    // Metadata
    tags: fields.array(fields.string()).optional(),
    author: fields
      .object({
        name: fields.string(),
        role: fields.string().optional(),
      })
      .optional(),
  },
  descriptions: {
    title: "Main heading for the showcase section",
    subtitle: "Short tagline displayed below the title",
    summary: "Brief summary shown as introductory text",
    body: "Full rich text content block",
    image: "Hero or featured image",
    grid: "Collection of titled image cards",
    attachment: "Downloadable file (PDF, document, etc.)",
    layout: "Controls how the section content is arranged",
    theme: "Color scheme for this section",
    showCaption: "Display captions below grid/card items",
    externalUrl: "Link to an external resource",
    showButton: "Toggle the call-to-action button",
    button: "Configure the CTA button appearance and link",
    tags: "Keywords for categorization",
    author: "Attribution information",
  },
  groups: [
    {
      name: "Content",
      description: "Primary text content for the section",
      fields: ["title", "subtitle", "summary", "body"],
    },
    {
      name: "Media",
      description: "Images, grid items, and file attachments",
      fields: ["image", "grid", "attachment"],
    },
    {
      name: "Appearance",
      description: "Layout and visual settings",
      fields: ["layout", "theme", "showCaption"],
    },
    {
      name: "Call to Action",
      description: "Links and button configuration",
      fields: ["externalUrl", "showButton", "button"],
    },
    {
      name: "Metadata",
      fields: ["tags", "author"],
    },
  ],
});

export const LandingPage = definePageType({
  name: "landing",
  allowedSections: ["hero", "content", "cta", "showcase"],
});

export const BlogPage = definePageType({
  name: "blog",
  allowedSections: ["content"],
});

export const registry = createRegistry({
  sections: [HeroSection, ContentSection, CtaSection, ShowcaseSection],
  pageTypes: [LandingPage, BlogPage],
});
