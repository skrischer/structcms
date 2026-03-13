import { z } from 'zod';

/**
 * Maximum file size: 50MB
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Schema for page sections
 */
const PageSectionSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.record(z.unknown()),
});

/**
 * Schema for creating a new page
 */
export const CreatePageSchema = z.object({
  title: z.string().max(200, 'Title must not exceed 200 characters'),
  pageType: z.string(),
  slug: z.string().max(200, 'Slug must not exceed 200 characters').optional(),
  sections: z.array(PageSectionSchema).optional(),
});

/**
 * Schema for updating an existing page
 */
export const UpdatePageSchema = CreatePageSchema.partial();

/**
 * Schema for navigation items (recursive)
 */
const NavigationItemSchema: z.ZodType = z.lazy(() =>
  z.object({
    label: z.string(),
    href: z.string(),
    children: z.array(NavigationItemSchema).optional(),
  })
);

/**
 * Schema for creating a new navigation
 */
export const CreateNavigationSchema = z.object({
  name: z.string().max(100, 'Name must not exceed 100 characters'),
  items: z.array(NavigationItemSchema),
});

/**
 * Schema for updating an existing navigation
 */
export const UpdateNavigationSchema = CreateNavigationSchema.partial();

/**
 * Schema for sign in
 */
export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Schema for media upload
 */
export const MediaUploadSchema = z.object({
  filename: z.string().max(255, 'Filename must not exceed 255 characters'),
  mimeType: z.string(),
  size: z.number().max(MAX_FILE_SIZE, `File size must not exceed ${MAX_FILE_SIZE / 1024 / 1024}MB`),
  data: z.instanceof(ArrayBuffer),
});

/**
 * Type exports for TypeScript
 */
export type CreatePageInput = z.infer<typeof CreatePageSchema>;
export type UpdatePageInput = z.infer<typeof UpdatePageSchema>;
export type CreateNavigationInput = z.infer<typeof CreateNavigationSchema>;
export type UpdateNavigationInput = z.infer<typeof UpdateNavigationSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type MediaUploadInput = z.infer<typeof MediaUploadSchema>;
