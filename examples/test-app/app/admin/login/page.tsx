'use client';

import { LoginForm } from '@structcms/admin';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin');
  };

  return (
    <div
      data-structcms-admin
      className="min-h-screen flex items-center justify-center bg-[var(--admin-surface-page)]"
    >
      <div
        className="max-w-[400px] w-full rounded-[var(--admin-radius-xl)] bg-[var(--admin-surface-card)] border border-[var(--admin-border-default)] p-8"
        style={{ boxShadow: 'var(--admin-shadow-lg)' }}
      >
        <div className="text-center mb-6">
          <h2 className="text-[24px] font-semibold text-[var(--admin-gray-900)] tracking-[-0.01em]">
            Sign in to StructCMS
          </h2>
          <p className="mt-2 text-[14px] text-[var(--admin-gray-500)]">
            Enter your credentials to access the admin panel
          </p>
        </div>
        <LoginForm onSuccess={handleSuccess} />
        <p className="text-[12px] text-[var(--admin-gray-400)] text-center mt-6">
          Powered by StructCMS
        </p>
      </div>
    </div>
  );
}
