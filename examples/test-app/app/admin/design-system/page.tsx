'use client';

import { DesignSystemPage } from '@structcms/admin';

export default function DesignSystemRoute() {
  return (
    <div data-structcms-admin className="min-h-screen bg-[var(--admin-surface-page)] p-10">
      <DesignSystemPage />
    </div>
  );
}
