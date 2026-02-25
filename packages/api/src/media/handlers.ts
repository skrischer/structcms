import type { MediaAdapter, MediaFile, MediaFilter, UploadMediaInput } from './types';
import { ALLOWED_MIME_TYPES } from './types';

/**
 * Error thrown when media validation fails
 */
export class MediaValidationError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'MediaValidationError';
  }
}

/**
 * Validates that the MIME type is allowed
 */
function validateMimeType(mimeType: string): void {
  const allowed = ALLOWED_MIME_TYPES as readonly string[];
  if (!allowed.includes(mimeType)) {
    throw new MediaValidationError(
      `Invalid file type: ${mimeType}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      'INVALID_MIME_TYPE'
    );
  }
}

/**
 * Handler for uploading a media file
 * Validates the file type and delegates to the adapter
 */
export async function handleUploadMedia(
  adapter: MediaAdapter,
  input: UploadMediaInput
): Promise<MediaFile> {
  validateMimeType(input.mimeType);
  return adapter.upload(input);
}

/**
 * Handler for retrieving a media file by ID
 */
export async function handleGetMedia(adapter: MediaAdapter, id: string): Promise<MediaFile | null> {
  return adapter.getMedia(id);
}

/**
 * Handler for listing media files with optional filtering
 */
export async function handleListMedia(
  adapter: MediaAdapter,
  filter?: MediaFilter
): Promise<MediaFile[]> {
  return adapter.listMedia(filter);
}

/**
 * Handler for deleting a media file
 */
export async function handleDeleteMedia(adapter: MediaAdapter, id: string): Promise<void> {
  return adapter.deleteMedia(id);
}
