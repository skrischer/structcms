'use client';

import { StructCMSAdminApp } from '@structcms/admin';
import { registry } from '@/lib/registry';

export default function AdminQuickstartPage() {
  return (
    <StructCMSAdminApp 
      registry={registry} 
      apiBaseUrl="/api/cms"
    />
  );
}
