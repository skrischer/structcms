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
  onViewAllPages?: () => void;
  onEditNavigation?: () => void;
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
  onViewAllPages,
  onEditNavigation,
  className,
}: DashboardPageProps) {
  return (
    <div
      className={cn('max-w-[1100px] mx-auto w-full flex flex-col gap-6', className)}
      data-testid="dashboard-page"
    >
      <ErrorBoundary>
        <KpiCards />
      </ErrorBoundary>

      <ErrorBoundary>
        <RecentPages onSelectPage={onSelectPage} onViewAll={onViewAllPages} />
      </ErrorBoundary>

      <ErrorBoundary>
        <QuickActions
          onCreatePage={onCreatePage}
          onUploadMedia={onUploadMedia}
          onEditNavigation={onEditNavigation}
        />
      </ErrorBoundary>
    </div>
  );
}

DashboardPage.displayName = 'DashboardPage';

export { DashboardPage };
