'use client';

import * as React from 'react';
import { useAdmin } from '../../hooks/use-admin';
import { useApiClient } from '../../hooks/use-api-client';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface KpiState {
  value: number | null;
  loading: boolean;
  error: string | null;
}

export interface KpiCardsProps {
  className?: string;
}

/**
 * Dashboard KPI cards displaying content metrics.
 *
 * Fetches pages, media, and navigation counts from the API in parallel.
 * Sections count is derived synchronously from the registry.
 *
 * @example
 * ```tsx
 * <AdminProvider registry={registry} apiBaseUrl="/api/cms">
 *   <KpiCards />
 * </AdminProvider>
 * ```
 */
function KpiCards({ className }: KpiCardsProps) {
  const api = useApiClient();
  const { registry } = useAdmin();

  const [pages, setPages] = React.useState<KpiState>({ value: null, loading: true, error: null });
  const [media, setMedia] = React.useState<KpiState>({ value: null, loading: true, error: null });
  const [navigation, setNavigation] = React.useState<KpiState>({
    value: null,
    loading: true,
    error: null,
  });

  const sectionsCount = registry.getAllSections().length;

  const fetchPages = React.useCallback(
    async (signal?: { cancelled: boolean }) => {
      setPages({ value: null, loading: true, error: null });
      const result = await api.get<unknown[]>('/pages');
      if (signal?.cancelled) return;
      if (result.error) {
        setPages({ value: null, loading: false, error: result.error.message });
      } else {
        setPages({ value: result.data?.length ?? 0, loading: false, error: null });
      }
    },
    [api]
  );

  const fetchMedia = React.useCallback(
    async (signal?: { cancelled: boolean }) => {
      setMedia({ value: null, loading: true, error: null });
      const result = await api.get<unknown[]>('/media');
      if (signal?.cancelled) return;
      if (result.error) {
        setMedia({ value: null, loading: false, error: result.error.message });
      } else {
        setMedia({ value: result.data?.length ?? 0, loading: false, error: null });
      }
    },
    [api]
  );

  const fetchNavigation = React.useCallback(
    async (signal?: { cancelled: boolean }) => {
      setNavigation({ value: null, loading: true, error: null });
      const result = await api.get<unknown[]>('/navigation');
      if (signal?.cancelled) return;
      if (result.error) {
        setNavigation({ value: null, loading: false, error: result.error.message });
      } else {
        setNavigation({ value: result.data?.length ?? 0, loading: false, error: null });
      }
    },
    [api]
  );

  React.useEffect(() => {
    const signal = { cancelled: false };

    void Promise.allSettled([fetchPages(signal), fetchMedia(signal), fetchNavigation(signal)]);

    return () => {
      signal.cancelled = true;
    };
  }, [fetchPages, fetchMedia, fetchNavigation]);

  const kpis = [
    { label: 'Pages', state: pages, onRetry: () => void fetchPages(), testId: 'kpi-pages' },
    { label: 'Media Files', state: media, onRetry: () => void fetchMedia(), testId: 'kpi-media' },
    {
      label: 'Navigation Sets',
      state: navigation,
      onRetry: () => void fetchNavigation(),
      testId: 'kpi-navigation',
    },
    {
      label: 'Sections',
      state: { value: sectionsCount, loading: false, error: null } as KpiState,
      onRetry: undefined,
      testId: 'kpi-sections',
    },
  ];

  return (
    <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-4', className)} data-testid="kpi-cards">
      {kpis.map((kpi) => (
        <div
          key={kpi.testId}
          className="rounded-lg border border-input bg-background p-4"
          data-testid={kpi.testId}
        >
          <p className="text-sm text-muted-foreground">{kpi.label}</p>

          {kpi.state.loading && (
            <Skeleton className="mt-2 h-8 w-16" data-testid={`${kpi.testId}-skeleton`} />
          )}

          {!kpi.state.loading && kpi.state.error && (
            <div className="mt-1">
              <p className="text-sm text-destructive" data-testid={`${kpi.testId}-error`}>
                Error loading
              </p>
              {kpi.onRetry && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={kpi.onRetry}
                  data-testid={`${kpi.testId}-retry`}
                >
                  Retry
                </Button>
              )}
            </div>
          )}

          {!kpi.state.loading && !kpi.state.error && kpi.state.value !== null && (
            <p className="mt-1 text-2xl font-bold" data-testid={`${kpi.testId}-value`}>
              {kpi.state.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

KpiCards.displayName = 'KpiCards';

export { KpiCards };
