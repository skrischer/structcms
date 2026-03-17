'use client';

import { Pencil, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useApiClient } from '../../hooks/use-api-client';
import { cn } from '../../lib/utils';
import type { PageSummary } from '../content/page-list';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog } from '../ui/dialog';
import { Skeleton } from '../ui/skeleton';

export interface RecentPagesProps {
  onSelectPage: (page: PageSummary) => void;
  onViewAll?: () => void;
  className?: string;
}

type SortField = 'title' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

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

function sortPages(
  pages: PageSummary[],
  field: SortField,
  direction: SortDirection
): PageSummary[] {
  return [...pages].sort((a, b) => {
    let cmp = 0;
    if (field === 'title') {
      cmp = a.title.localeCompare(b.title);
    } else {
      const dateA = a.meta?.updatedAt ? new Date(a.meta.updatedAt).getTime() : 0;
      const dateB = b.meta?.updatedAt ? new Date(b.meta.updatedAt).getTime() : 0;
      cmp = dateA - dateB;
    }
    return direction === 'asc' ? cmp : -cmp;
  });
}

function SortIcon({
  field,
  activeField,
  direction,
}: {
  field: SortField;
  activeField: SortField;
  direction: SortDirection;
}) {
  if (field !== activeField) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--admin-gray-400)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m7 9 5-5 5 5" />
        <path d="m7 15 5 5 5-5" />
      </svg>
    );
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--admin-primary-600)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === 'asc' ? 'm7 9 5-5 5 5' : 'm7 15 5 5 5-5'} />
    </svg>
  );
}

function RecentPages({ onSelectPage, onViewAll, className }: RecentPagesProps) {
  const api = useApiClient();
  const [rawPages, setRawPages] = React.useState<PageSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [sortField, setSortField] = React.useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [pageToDelete, setPageToDelete] = React.useState<PageSummary | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const pages = React.useMemo(
    () => sortPages(rawPages, sortField, sortDirection),
    [rawPages, sortField, sortDirection]
  );

  const allSelected = pages.length > 0 && selectedIds.size === pages.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < pages.length;

  const handleToggleAll = React.useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pages.map((p) => p.id)));
    }
  }, [allSelected, pages]);

  const handleToggleRow = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSort = React.useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection(field === 'title' ? 'asc' : 'desc');
      }
    },
    [sortField]
  );

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
      setRawPages(allPages.slice(0, 10));
      setSelectedIds(new Set());
      setLoading(false);
    },
    [api]
  );

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!pageToDelete) return;
    setDeleting(true);
    const result = await api.delete(`/pages/id/${pageToDelete.id}`);
    setDeleting(false);
    if (!result.error) {
      setPageToDelete(null);
      void fetchPages();
    }
  }, [pageToDelete, api, fetchPages]);

  React.useEffect(() => {
    const signal = { cancelled: false };
    void fetchPages(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [fetchPages]);

  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)]',
        className
      )}
      style={{ boxShadow: 'var(--admin-shadow-xs)' }}
      data-testid="recent-pages"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--admin-gray-200)]">
        <h2 className="text-[18px] font-semibold text-[var(--admin-gray-900)]">Recent Pages</h2>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-[14px] font-medium text-[var(--admin-primary-600)] hover:underline"
            data-testid="recent-pages-view-all"
          >
            View All
          </button>
        )}
      </div>

      {loading && (
        <div className="p-5 space-y-3" data-testid="recent-pages-loading">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Loading skeletons
            <Skeleton key={i} className="h-[52px] w-full" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="p-5" data-testid="recent-pages-error">
          <p className="text-sm text-[var(--admin-error-700)]">Unable to load recent pages</p>
          <Button
            type="button"
            variant="secondary"
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
        <p
          className="text-[14px] text-[var(--admin-gray-500)] py-12 text-center"
          data-testid="recent-pages-empty"
        >
          No pages yet.
        </p>
      )}

      {!loading && !error && pages.length > 0 && (
        <div className="overflow-x-auto" data-testid="recent-pages-list">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--admin-gray-50)] border-b border-[var(--admin-gray-200)]">
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={handleToggleAll}
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    type="button"
                    onClick={() => handleSort('title')}
                    className="inline-flex items-center gap-1 text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)] hover:text-[var(--admin-gray-800)] transition-colors"
                  >
                    Title
                    <SortIcon field="title" activeField={sortField} direction={sortDirection} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)]">
                  Slug
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    type="button"
                    onClick={() => handleSort('updatedAt')}
                    className="inline-flex items-center gap-1 text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)] hover:text-[var(--admin-gray-800)] transition-colors"
                  >
                    Last Modified
                    <SortIcon field="updatedAt" activeField={sortField} direction={sortDirection} />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className={cn(
                    'border-b border-[var(--admin-gray-100)] last:border-b-0 hover:bg-[var(--admin-gray-50)]',
                    selectedIds.has(page.id) && 'bg-[var(--admin-primary-50)]'
                  )}
                  data-testid={`recent-page-${page.id}`}
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedIds.has(page.id)}
                      onChange={() => handleToggleRow(page.id)}
                    />
                  </td>
                  <td className="px-4 py-3 text-[14px] font-medium text-[var(--admin-gray-800)]">
                    {page.title}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="default" size="sm">
                      {page.pageType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--admin-gray-500)] font-[JetBrains_Mono,monospace]">
                    {page.slug}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--admin-gray-500)]">
                    {page.meta?.updatedAt ? formatTimestamp(page.meta.updatedAt) : ''}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSelectPage(page)}
                        aria-label={`Edit ${page.title}`}
                      >
                        <Pencil
                          size={16}
                          strokeWidth={1.5}
                          className="text-[var(--admin-gray-500)]"
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPageToDelete(page)}
                        aria-label={`Delete ${page.title}`}
                      >
                        <Trash2
                          size={16}
                          strokeWidth={1.5}
                          className="text-[var(--admin-gray-500)]"
                        />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={pageToDelete !== null}
        onClose={() => setPageToDelete(null)}
        title="Delete Page"
        className="max-w-sm"
      >
        <p className="text-[14px] text-[var(--admin-gray-600)]">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-[var(--admin-gray-900)]">{pageToDelete?.title}</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPageToDelete(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => void handleDeleteConfirm()}
            disabled={deleting}
            data-testid="confirm-delete-page"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

RecentPages.displayName = 'RecentPages';

export { RecentPages };
