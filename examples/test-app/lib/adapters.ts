import { createClient } from '@supabase/supabase-js';
import { createStorageAdapter, createMediaAdapter } from '@structcms/api';

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL environment variable is required');
}

if (!process.env.SUPABASE_SECRET_KEY) {
  throw new Error('SUPABASE_SECRET_KEY environment variable is required');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export const storageAdapter = createStorageAdapter({ client: supabase });
export const mediaAdapter = createMediaAdapter({ client: supabase, bucketName: 'media' });
