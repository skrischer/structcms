import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSupabaseAdapters } from './factory';

const {
  createClientMock,
  createStorageAdapterMock,
  createMediaAdapterMock,
  createAuthAdapterMock,
} = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  createStorageAdapterMock: vi.fn(),
  createMediaAdapterMock: vi.fn(),
  createAuthAdapterMock: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}));

vi.mock('../storage', () => ({
  createStorageAdapter: createStorageAdapterMock,
}));

vi.mock('../media', () => ({
  createMediaAdapter: createMediaAdapterMock,
}));

vi.mock('../auth', () => ({
  createAuthAdapter: createAuthAdapterMock,
}));

describe('createSupabaseAdapters', () => {
  beforeEach(() => {
    createClientMock.mockReset();
    createStorageAdapterMock.mockReset();
    createMediaAdapterMock.mockReset();
    createAuthAdapterMock.mockReset();

    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;
    delete process.env.SUPABASE_STORAGE_BUCKET;
  });

  it('uses explicit config values when provided', () => {
    const client = { name: 'supabase-client' };
    const storageAdapter = { kind: 'storage-adapter' };
    const mediaAdapter = { kind: 'media-adapter' };
    const authAdapter = { kind: 'auth-adapter' };

    createClientMock.mockReturnValue(client);
    createStorageAdapterMock.mockReturnValue(storageAdapter);
    createMediaAdapterMock.mockReturnValue(mediaAdapter);
    createAuthAdapterMock.mockReturnValue(authAdapter);

    const result = createSupabaseAdapters({
      url: 'https://explicit.supabase.co',
      key: 'explicit-key',
      storage: { bucket: 'explicit-bucket' },
    });

    expect(createClientMock).toHaveBeenCalledWith(
      'https://explicit.supabase.co',
      'explicit-key'
    );
    expect(createStorageAdapterMock).toHaveBeenCalledWith({ client });
    expect(createMediaAdapterMock).toHaveBeenCalledWith({
      client,
      bucketName: 'explicit-bucket',
    });
    expect(createAuthAdapterMock).toHaveBeenCalledWith({ client });
    expect(result).toEqual({ storageAdapter, mediaAdapter, authAdapter });
  });

  it('uses environment defaults when explicit config is not provided', () => {
    process.env.SUPABASE_URL = 'https://env.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'env-secret-key';
    process.env.SUPABASE_STORAGE_BUCKET = 'env-bucket';

    const client = { name: 'supabase-client-from-env' };
    const storageAdapter = { kind: 'storage-adapter-from-env' };
    const mediaAdapter = { kind: 'media-adapter-from-env' };
    const authAdapter = { kind: 'auth-adapter-from-env' };

    createClientMock.mockReturnValue(client);
    createStorageAdapterMock.mockReturnValue(storageAdapter);
    createMediaAdapterMock.mockReturnValue(mediaAdapter);
    createAuthAdapterMock.mockReturnValue(authAdapter);

    const result = createSupabaseAdapters();

    expect(createClientMock).toHaveBeenCalledWith(
      'https://env.supabase.co',
      'env-secret-key'
    );
    expect(createStorageAdapterMock).toHaveBeenCalledWith({ client });
    expect(createMediaAdapterMock).toHaveBeenCalledWith({
      client,
      bucketName: 'env-bucket',
    });
    expect(createAuthAdapterMock).toHaveBeenCalledWith({ client });
    expect(result).toEqual({ storageAdapter, mediaAdapter, authAdapter });
  });
});
