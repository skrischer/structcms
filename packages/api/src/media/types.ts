/**
 * Allowed MIME types for media uploads
 */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

/**
 * Represents a media file stored in the CMS
 */
export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: Date;
}

/**
 * Input for uploading a media file
 * data accepts ArrayBuffer for platform-agnostic binary data
 */
export interface UploadMediaInput {
  filename: string;
  mimeType: string;
  size: number;
  data: ArrayBuffer | Uint8Array;
}

/**
 * Filter options for listing media files
 */
export interface MediaFilter {
  limit?: number;
  offset?: number;
  mimeType?: string;
}

/**
 * Media adapter interface for file storage operations.
 * This interface is Supabase-agnostic to allow future portability.
 */
export interface MediaAdapter {
  /**
   * Upload a media file
   */
  upload(input: UploadMediaInput): Promise<MediaFile>;

  /**
   * Get a media file by ID
   */
  getMedia(id: string): Promise<MediaFile | null>;

  /**
   * List media files with optional filtering and pagination
   */
  listMedia(filter?: MediaFilter): Promise<MediaFile[]>;

  /**
   * Delete a media file by ID
   */
  deleteMedia(id: string): Promise<void>;
}
