'use client';

import { Filter, Plus, Search, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useAdmin } from '../../hooks/use-admin';
import { useApiClient } from '../../hooks/use-api-client';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog } from '../ui/dialog';
import { ErrorAlert } from '../ui/error-alert';
import { Pagination } from '../ui/pagination';
import { Skeleton } from '../ui/skeleton';

export interface PageSummary {
  id: string;
  title: string;
  slug: string;
  pageType: string;
  updatedAt?: string;
  meta?: {
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface PageListProps {
  onSelectPage: (page: PageSummary) => void;
  onCreatePage: () => void;
  className?: string;
}

export type SortField = 'title' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE_DEFAULT = 10;

export function formatTimestamp(dateString: string): string {
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

export function getUpdatedAt(page: PageSummary): string | undefined {
  return page.updatedAt ?? page.meta?.updatedAt;
}

export function sortPages(
  pages: PageSummary[],
  field: SortField,
  direction: SortDirection
): PageSummary[] {
  return [...pages].sort((a, b) => {
    let cmp = 0;
    if (field === 'title') {
      cmp = a.title.localeCompare(b.title);
    } else {
      const dateA = getUpdatedAt(a) ? new Date(getUpdatedAt(a) as string).getTime() : 0;
      const dateB = getUpdatedAt(b) ? new Date(getUpdatedAt(b) as string).getTime() : 0;
      cmp = dateA - dateB;
    }
    return direction === 'asc' ? cmp : -cmp;
  });
}

export function SortIcon({
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

function PageList({ onSelectPage, onCreatePage, className }: PageListProps) {
  const api = useApiClient();
  const { registry } = useAdmin();
  const [pages, setPages] = React.useState<PageSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [pageTypeFilter, setPageTypeFilter] = React.useState('');
  const [sortField, setSortField] = React.useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(ITEMS_PER_PAGE_DEFAULT);
  const [pageToDelete, setPageToDelete] = React.useState<PageSummary | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const pageTypes = registry.getAllPageTypes();

  const fetchPages = React.useCallback(
    async (signal?: { cancelled: boolean }) => {
      setLoading(true);
      setError(null);

      const result = await api.get<PageSummary[]>('/pages');

      if (signal?.cancelled) return;

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      setPages(result.data ?? []);
      setLoading(false);
    },
    [api]
  );

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!pageToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    const result = await api.delete(`/pages/id/${pageToDelete.id}`);
    setDeleting(false);
    if (result.error) {
      setDeleteError(result.error.message);
    } else {
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

  const filteredPages = React.useMemo(() => {
    let result = pages;

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (page) =>
          page.title.toLowerCase().includes(lowerSearch) ||
          page.slug.toLowerCase().includes(lowerSearch)
      );
    }

    if (pageTypeFilter) {
      result = result.filter((page) => page.pageType === pageTypeFilter);
    }

    return result;
  }, [pages, search, pageTypeFilter]);

  const sortedPages = React.useMemo(
    () => sortPages(filteredPages, sortField, sortDirection),
    [filteredPages, sortField, sortDirection]
  );

  const totalPages = Math.max(1, Math.ceil(sortedPages.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPages = sortedPages.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

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

  const handlePageChange = React.useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = React.useCallback((count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  }, []);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, pageTypeFilter]);

  return (
    <div
      className={cn('max-w-[1100px] mx-auto w-full flex flex-col gap-6', className)}
      data-testid="page-list"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--admin-gray-900)]">
            Pages
          </h1>
          <p className="text-[14px] leading-[1.5] text-[var(--admin-gray-500)]">
            Manage your website pages and content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-gray-400)] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-60 rounded-md border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)] pl-9 pr-3 text-[14px] text-[var(--admin-gray-800)] placeholder:text-[var(--admin-gray-400)] focus-visible:outline-none focus-visible:border-[var(--admin-primary-500)] focus-visible:ring-[3px] focus-visible:shadow-[var(--admin-shadow-ring)]"
              data-testid="search-input"
            />
          </div>
          {pageTypes.length > 0 && (
            <div className="relative">
              <Filter
                size={16}
                strokeWidth={2}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-gray-600)] pointer-events-none"
              />
              <select
                value={pageTypeFilter}
                onChange={(e) => setPageTypeFilter(e.target.value)}
                className="h-9 appearance-none rounded-md border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)] pl-9 pr-8 text-[14px] font-medium text-[var(--admin-gray-700)] focus-visible:outline-none focus-visible:border-[var(--admin-primary-500)] focus-visible:ring-[3px] focus-visible:shadow-[var(--admin-shadow-ring)]"
                data-testid="page-type-filter"
              >
                <option value="">All Types</option>
                {pageTypes.map((pt) => (
                  <option key={pt.name} value={pt.name}>
                    {pt.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Button type="button" onClick={onCreatePage} data-testid="create-page">
            <Plus size={16} strokeWidth={2} />
            New Page
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3" data-testid="loading">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Loading skeletons
            <Skeleton key={i} className="h-[52px] w-full" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && <ErrorAlert data-testid="error">{error}</ErrorAlert>}

      {/* Empty State */}
      {!loading && !error && filteredPages.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-testid="empty-state"
        >
          <p className="text-[14px] font-medium text-[var(--admin-gray-800)]">
            {pages.length === 0 ? 'No pages found' : 'No pages match your search.'}
          </p>
          {pages.length === 0 && (
            <p className="text-[14px] text-[var(--admin-gray-500)] mt-1">
              Get started by creating your first page.
            </p>
          )}
          {pages.length === 0 && (
            <Button type="button" className="mt-4" onClick={onCreatePage}>
              <Plus size={16} strokeWidth={2} />
              Create Page
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !error && filteredPages.length > 0 && (
        <>
          <div
            className="rounded-[var(--admin-radius-lg)] border border-[var(--admin-border-default)] bg-[var(--admin-surface-card)] overflow-hidden"
            style={{ boxShadow: 'var(--admin-shadow-xs)' }}
            data-testid="page-table"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--admin-gray-50)] border-b border-[var(--admin-gray-200)]">
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
                  <th className="w-[120px] px-4 py-3 text-left text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)]">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)]">
                    Slug
                  </th>
                  <th className="w-[140px] px-4 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort('updatedAt')}
                      className="inline-flex items-center gap-1 text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)] hover:text-[var(--admin-gray-800)] transition-colors"
                    >
                      Last Modified
                      <SortIcon
                        field="updatedAt"
                        activeField={sortField}
                        direction={sortDirection}
                      />
                    </button>
                  </th>
                  <th className="w-20 px-4 py-3 text-right text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPages.map((page) => (
                  <tr
                    key={page.id}
                    className="border-b border-[var(--admin-border-subtle)] last:border-b-0 hover:bg-[var(--admin-gray-50)] cursor-pointer"
                    data-testid={`page-row-${page.id}`}
                    onClick={() => onSelectPage(page)}
                  >
                    <td className="px-4 py-3 text-[14px] font-medium text-[var(--admin-gray-800)]">
                      <button
                        type="button"
                        className="cursor-pointer hover:text-[var(--admin-primary-600)] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPage(page);
                        }}
                      >
                        {page.title}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" size="sm">
                        {page.pageType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[var(--admin-gray-500)] font-mono">
                      /{page.slug}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[var(--admin-gray-500)]">
                      {getUpdatedAt(page) ? formatTimestamp(getUpdatedAt(page) as string) : ''}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPageToDelete(page);
                          }}
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

          {/* Pagination */}
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            variant="compact"
            itemsPerPage={itemsPerPage}
            totalItems={sortedPages.length}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
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
        {deleteError && (
          <p className="text-[13px] text-[var(--admin-error-600)] mt-2">{deleteError}</p>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setPageToDelete(null);
              setDeleteError(null);
            }}
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

PageList.displayName = 'PageList';

export { PageList };
