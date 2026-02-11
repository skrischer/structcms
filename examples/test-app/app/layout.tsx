import './globals.css';
import { handleGetNavigation } from '@structcms/api';
import { storageAdapter } from '@/lib/adapters';
import { Navigation } from '@/lib/components/navigation';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = await handleGetNavigation(storageAdapter, 'main');

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
