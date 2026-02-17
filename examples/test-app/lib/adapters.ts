import { createSupabaseAdapters } from '@structcms/api/supabase';

const { storageAdapter, mediaAdapter } = createSupabaseAdapters();

export { storageAdapter, mediaAdapter };
