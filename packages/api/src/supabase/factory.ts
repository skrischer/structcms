import { createClient } from '@supabase/supabase-js';
import { createAuthAdapter } from '../auth';
import type { AuthAdapter } from '../auth';
import { createMediaAdapter } from '../media';
import type { MediaAdapter } from '../media';
import { createStorageAdapter } from '../storage';
import type { StorageAdapter } from '../storage';

export interface SupabaseAdapterFactoryStorageConfig {
  bucket?: string;
}

export interface SupabaseAdapterFactoryConfig {
  url?: string;
  key?: string;
  storage?: SupabaseAdapterFactoryStorageConfig;
}

export interface SupabaseAdapters {
  storageAdapter: StorageAdapter;
  mediaAdapter: MediaAdapter;
  authAdapter: AuthAdapter;
}

interface ProcessLike {
  env: Record<string, string | undefined>;
}

function readEnv(name: string): string | undefined {
  const processLike = (globalThis as typeof globalThis & { process?: ProcessLike }).process;
  return processLike?.env[name];
}

function resolveRequiredConfig(
  explicitValue: string | undefined,
  envName: 'SUPABASE_URL' | 'SUPABASE_SECRET_KEY'
): string {
  const explicit = explicitValue?.trim();
  if (explicit) {
    return explicit;
  }

  const fromEnv = readEnv(envName)?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  throw new Error(
    `Missing Supabase configuration: provide ${envName} in factory config or environment variable`
  );
}

function resolveBucketName(config: SupabaseAdapterFactoryConfig): string {
  const explicitBucket = config.storage?.bucket?.trim();
  if (explicitBucket) {
    return explicitBucket;
  }

  const envBucket = readEnv('SUPABASE_STORAGE_BUCKET')?.trim();
  if (envBucket) {
    return envBucket;
  }

  return 'media';
}

export function createSupabaseAdapters(
  config: SupabaseAdapterFactoryConfig = {}
): SupabaseAdapters {
  const url = resolveRequiredConfig(config.url, 'SUPABASE_URL');
  const key = resolveRequiredConfig(config.key, 'SUPABASE_SECRET_KEY');
  const bucketName = resolveBucketName(config);

  const client = createClient(url, key);

  return {
    storageAdapter: createStorageAdapter({ client }),
    mediaAdapter: createMediaAdapter({ client, bucketName }),
    authAdapter: createAuthAdapter({ client }),
  };
}
