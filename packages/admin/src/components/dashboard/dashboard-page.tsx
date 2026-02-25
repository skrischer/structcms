'use client';
import { cn } from '../../lib/utils';
import type { PageSummary } from '../content/page-list';
import { ErrorBoundary } from '../ui/error-boundary';
import { KpiCards } from './kpi-cards';
import { QuickActions } from './quick-actions';
import { RecentPages } from './recent-pages';

export interface DashboardPageProps {
  onSelectPage: (page: PageSummary) => void;
  onCreatePage: () => void;
  onUploadMedia: () => void;
  className?: string;
}

/**
 * Main dashboard page composing KPI cards, recent pages, and quick actions.
 * This is the default admin entry point.
 *
 * @example
 * ```tsx
 * <AdminProvider registry={registry} apiBaseUrl="/api/cms">
 *   <DashboardPage
 *     onSelectPage={(page) => router.push(`/admin/pages/${page.id}`)}
 *     onCreatePage={() => router.push('/admin/pages/new')}
 *     onUploadMedia={() => router.push('/admin/media')}
 *   />
 * </AdminProvider>
 * ```
 */
function DashboardPage({
  onSelectPage,
  onCreatePage,
  onUploadMedia,
  className,
}: DashboardPageProps) {
  return (
    <div className={cn('space-y-6', className)} data-testid="dashboard-page">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <ErrorBoundary>
        <KpiCards />
      </ErrorBoundary>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ErrorBoundary>
            <RecentPages onSelectPage={onSelectPage} />
          </ErrorBoundary>
        </div>

        <div>
          <ErrorBoundary>
            <QuickActions onCreatePage={onCreatePage} onUploadMedia={onUploadMedia} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

DashboardPage.displayName = 'DashboardPage';

export { DashboardPage };
