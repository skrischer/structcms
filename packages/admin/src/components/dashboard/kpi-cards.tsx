"use client";

import { FileText, Image, Navigation2 } from "lucide-react";
import * as React from "react";
import { useApiClient } from "../../hooks/use-api-client";
import { cn } from "../../lib/utils";
import { ErrorAlert } from "../ui/error-alert";
import { Skeleton } from "../ui/skeleton";

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
  const [pages, setPages] = React.useState<KpiState>({
    value: null,
    loading: true,
    error: null,
  });
  const [media, setMedia] = React.useState<KpiState>({
    value: null,
    loading: true,
    error: null,
  });
  const [navigation, setNavigation] = React.useState<KpiState>({
    value: null,
    loading: true,
    error: null,
  });

  const fetchPages = React.useCallback(
    async (signal?: { cancelled: boolean }) => {
      setPages({ value: null, loading: true, error: null });
      const result = await api.get<unknown[]>("/pages");
      if (signal?.cancelled) return;
      if (result.error) {
        setPages({ value: null, loading: false, error: result.error.message });
      } else {
        setPages({
          value: result.data?.length ?? 0,
          loading: false,
          error: null,
        });
      }
    },
    [api],
  );

  const fetchMedia = React.useCallback(
    async (signal?: { cancelled: boolean }) => {
      setMedia({ value: null, loading: true, error: null });
      const result = await api.get<unknown[]>("/media");
      if (signal?.cancelled) return;
      if (result.error) {
        setMedia({ value: null, loading: false, error: result.error.message });
      } else {
        setMedia({
          value: result.data?.length ?? 0,
          loading: false,
          error: null,
        });
      }
    },
    [api],
  );

  const fetchNavigation = React.useCallback(
    async (signal?: { cancelled: boolean }) => {
      setNavigation({ value: null, loading: true, error: null });
      const result = await api.get<unknown[]>("/navigation");
      if (signal?.cancelled) return;
      if (result.error) {
        setNavigation({
          value: null,
          loading: false,
          error: result.error.message,
        });
      } else {
        setNavigation({
          value: result.data?.length ?? 0,
          loading: false,
          error: null,
        });
      }
    },
    [api],
  );

  React.useEffect(() => {
    const signal = { cancelled: false };

    void Promise.allSettled([
      fetchPages(signal),
      fetchMedia(signal),
      fetchNavigation(signal),
    ]);

    return () => {
      signal.cancelled = true;
    };
  }, [fetchPages, fetchMedia, fetchNavigation]);

  const kpis = [
    {
      label: "Pages",
      state: pages,
      onRetry: () => void fetchPages(),
      testId: "kpi-pages",
      icon: (
        <FileText
          size={20}
          strokeWidth={1.5}
          className="text-[var(--admin-gray-400)]"
        />
      ),
    },
    {
      label: "Media Files",
      state: media,
      onRetry: () => void fetchMedia(),
      testId: "kpi-media",
      icon: (
        <Image
          size={20}
          strokeWidth={1.5}
          className="text-[var(--admin-gray-400)]"
        />
      ),
    },
    {
      label: "Navigation Sets",
      state: navigation,
      onRetry: () => void fetchNavigation(),
      testId: "kpi-navigation",
      icon: (
        <Navigation2
          size={20}
          strokeWidth={1.5}
          className="text-[var(--admin-gray-400)]"
        />
      ),
    },
  ];

  return (
    <div
      className={cn("grid grid-cols-1 sm:grid-cols-3 gap-5", className)}
      data-testid="kpi-cards"
    >
      {kpis.map((kpi) => (
        <div
          key={kpi.testId}
          className="rounded-lg border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)] p-5"
          style={{ boxShadow: "var(--admin-shadow-xs)" }}
          data-testid={kpi.testId}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] text-[var(--admin-gray-500)]">
              {kpi.label}
            </span>
            {kpi.icon}
          </div>

          {kpi.state.loading && (
            <Skeleton
              className="h-9 w-20"
              data-testid={`${kpi.testId}-skeleton`}
            />
          )}

          {!kpi.state.loading && kpi.state.error && (
            <ErrorAlert
              onRetry={kpi.onRetry}
              data-testid={`${kpi.testId}-error`}
            >
              Error loading
            </ErrorAlert>
          )}

          {!kpi.state.loading &&
            !kpi.state.error &&
            kpi.state.value !== null && (
              <p
                className="text-[30px] font-bold leading-none text-[var(--admin-gray-900)]"
                data-testid={`${kpi.testId}-value`}
              >
                {kpi.state.value}
              </p>
            )}
        </div>
      ))}
    </div>
  );
}

KpiCards.displayName = "KpiCards";

export { KpiCards };
