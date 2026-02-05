import { SupabaseClient } from '@supabase/supabase-js';
import type {
  MediaAdapter,
  MediaFile,
  UploadMediaInput,
  MediaFilter,
} from './types';

/**
 * Database row type for media (snake_case)
 */
interface MediaRow {
  id: string;
  filename: string;
  storage_path: string;
  mime_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}

/**
 * Media adapter error with additional context
 */
export class MediaError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: string
  ) {
    super(message);
    this.name = 'MediaError';
  }
}

/**
 * Configuration for creating a Supabase media adapter
 */
export interface SupabaseMediaAdapterConfig {
  client: SupabaseClient;
  bucketName?: string;
}

/**
 * Supabase implementation of the MediaAdapter interface
 */
export class SupabaseMediaAdapter implements MediaAdapter {
  private client: SupabaseClient;
  private bucketName: string;

  constructor(config: SupabaseMediaAdapterConfig) {
    this.client = config.client;
    this.bucketName = config.bucketName ?? 'media';
  }

  /**
   * Generates a unique storage path for a file
   */
  private generateStoragePath(filename: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${timestamp}-${randomSuffix}-${sanitizedFilename}`;
  }

  /**
   * Constructs the public URL for a stored file
   */
  private getPublicUrl(storagePath: string): string {
    const { data } = this.client.storage
      .from(this.bucketName)
      .getPublicUrl(storagePath);
    return data.publicUrl;
  }

  /**
   * Maps a database row to MediaFile
   */
  private mapRowToMediaFile(row: MediaRow): MediaFile {
    return {
      id: row.id,
      filename: row.filename,
      url: this.getPublicUrl(row.storage_path),
      mimeType: row.mime_type,
      size: row.size,
      createdAt: new Date(row.created_at),
    };
  }

  async upload(input: UploadMediaInput): Promise<MediaFile> {
    const storagePath = this.generateStoragePath(input.filename);

    // Upload file to Supabase Storage
    const { error: uploadError } = await this.client.storage
      .from(this.bucketName)
      .upload(storagePath, input.data, {
        contentType: input.mimeType,
        upsert: false,
      });

    if (uploadError) {
      throw new MediaError(
        `Failed to upload file: ${uploadError.message}`,
        'UPLOAD_FAILED',
        uploadError.message
      );
    }

    // Create database record
    const { data, error: dbError } = await this.client
      .from('media')
      .insert({
        filename: input.filename,
        storage_path: storagePath,
        mime_type: input.mimeType,
        size: input.size,
      })
      .select()
      .single();

    if (dbError) {
      // Cleanup: delete uploaded file if DB insert fails
      await this.client.storage.from(this.bucketName).remove([storagePath]);
      throw new MediaError(
        `Failed to create media record: ${dbError.message}`,
        dbError.code,
        dbError.details
      );
    }

    return this.mapRowToMediaFile(data as MediaRow);
  }

  async getMedia(id: string): Promise<MediaFile | null> {
    const { data, error } = await this.client
      .from('media')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new MediaError(error.message, error.code, error.details);
    }

    return this.mapRowToMediaFile(data as MediaRow);
  }

  async listMedia(filter?: MediaFilter): Promise<MediaFile[]> {
    let query = this.client.from('media').select('*');

    if (filter?.mimeType) {
      query = query.eq('mime_type', filter.mimeType);
    }

    query = query.order('created_at', { ascending: false });

    if (filter?.limit) {
      query = query.limit(filter.limit);
    }

    if (filter?.offset) {
      query = query.range(
        filter.offset,
        filter.offset + (filter.limit ?? 100) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      throw new MediaError(error.message, error.code, error.details);
    }

    return (data as MediaRow[]).map((row) => this.mapRowToMediaFile(row));
  }

  async deleteMedia(id: string): Promise<void> {
    // First get the media record to find the storage path
    const { data: mediaRecord, error: fetchError } = await this.client
      .from('media')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw new MediaError(`Media not found: ${id}`, 'NOT_FOUND');
      }
      throw new MediaError(fetchError.message, fetchError.code, fetchError.details);
    }

    const storagePath = (mediaRecord as { storage_path: string }).storage_path;

    // Delete from storage
    const { error: storageError } = await this.client.storage
      .from(this.bucketName)
      .remove([storagePath]);

    if (storageError) {
      throw new MediaError(
        `Failed to delete file from storage: ${storageError.message}`,
        'STORAGE_DELETE_FAILED',
        storageError.message
      );
    }

    // Delete database record
    const { error: dbError } = await this.client
      .from('media')
      .delete()
      .eq('id', id);

    if (dbError) {
      throw new MediaError(dbError.message, dbError.code, dbError.details);
    }
  }
}

/**
 * Creates a media adapter using Supabase
 */
export function createMediaAdapter(
  config: SupabaseMediaAdapterConfig
): MediaAdapter {
  return new SupabaseMediaAdapter(config);
}
