'use client';

import * as React from 'react';
import { useApiClient } from '../../hooks/use-api-client';
import { cn } from '../../lib/utils';
import type { PageSummary } from '../content/page-list';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

export interface RecentPagesProps {
  onSelectPage: (page: PageSummary) => void;
  className?: string;
}

function formatTimestamp(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Displays a list of recently updated pages (max 10, sorted by updatedAt DESC).
 *
 * @example
 * ```tsx
 * <AdminProvider registry={registry} apiBaseUrl="/api/cms">
 *   <RecentPages onSelectPage={(page) => router.push(`/admin/pages/${page.id}`)} />
 * </AdminProvider>
 * ```
 */
function RecentPages({ onSelectPage, className }: RecentPagesProps) {
  const api = useApiClient();
  const [pages, setPages] = React.useState<PageSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const fetchPages = React.useCallback(
    async (signal?: { cancelled: boolean }) => {
      setLoading(true);
      setError(false);

      const result = await api.get<PageSummary[]>('/pages');

      if (signal?.cancelled) return;

      if (result.error) {
        setError(true);
        setLoading(false);
        return;
      }

      const allPages = result.data ?? [];
      const sorted = [...allPages].sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });

      setPages(sorted.slice(0, 10));
      setLoading(false);
    },
    [api]
  );

  React.useEffect(() => {
    const signal = { cancelled: false };
    void fetchPages(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [fetchPages]);

  return (
    <div className={cn('space-y-3', className)} data-testid="recent-pages">
      <h2 className="text-lg font-semibold">Recent Pages</h2>

      {loading && (
        <div className="space-y-2" data-testid="recent-pages-loading">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div data-testid="recent-pages-error">
          <p className="text-sm text-destructive">Unable to load recent pages</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => void fetchPages()}
            data-testid="recent-pages-retry"
          >
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && pages.length === 0 && (
        <p className="text-sm text-muted-foreground py-4" data-testid="recent-pages-empty">
          No pages yet.
        </p>
      )}

      {!loading && !error && pages.length > 0 && (
        <div className="rounded-md border border-input" data-testid="recent-pages-list">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between border-b border-input last:border-0 px-3 py-2 hover:bg-muted/30 cursor-pointer"
              onClick={() => onSelectPage(page)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectPage(page);
                }
              }}
              data-testid={`recent-page-${page.id}`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{page.title}</p>
                <p className="text-xs text-muted-foreground truncate">{page.slug}</p>
              </div>
              {page.updatedAt && (
                <span className="ml-4 text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimestamp(page.updatedAt)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

RecentPages.displayName = 'RecentPages';

export { RecentPages };
