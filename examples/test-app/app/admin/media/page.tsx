'use client';

import { MediaBrowser } from '@structcms/admin';

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Media Library</h1>
      <MediaBrowser />
    </div>
  );
}
