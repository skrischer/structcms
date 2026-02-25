import { createSupabaseAdapters } from '@structcms/api/supabase';

let _adapters: ReturnType<typeof createSupabaseAdapters> | null = null;

function getAdapters() {
  if (!_adapters) {
    _adapters = createSupabaseAdapters();
  }
  return _adapters;
}

export function getStorageAdapter() {
  return getAdapters().storageAdapter;
}

export function getMediaAdapter() {
  return getAdapters().mediaAdapter;
}

export function getAuthAdapter() {
  return getAdapters().authAdapter;
}

// Re-export for backward compat (lazy via getter)
export const storageAdapter = new Proxy({} as ReturnType<typeof createSupabaseAdapters>['storageAdapter'], {
  get: (_target, prop, receiver) => Reflect.get(getAdapters().storageAdapter, prop, receiver),
});

export const mediaAdapter = new Proxy({} as ReturnType<typeof createSupabaseAdapters>['mediaAdapter'], {
  get: (_target, prop, receiver) => Reflect.get(getAdapters().mediaAdapter, prop, receiver),
});

export const authAdapter = new Proxy({} as ReturnType<typeof createSupabaseAdapters>['authAdapter'], {
  get: (_target, prop, receiver) => Reflect.get(getAdapters().authAdapter, prop, receiver),
});
