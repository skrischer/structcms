"use client";

import { Trash2 } from "lucide-react";
import * as React from "react";
import { useApiClient } from "../../hooks/use-api-client";
import { cn } from "../../lib/utils";
import {
  type PageSummary,
  type SortDirection,
  type SortField,
  SortIcon,
  formatTimestamp,
  getUpdatedAt,
  sortPages,
} from "../content/page-list";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { ErrorAlert } from "../ui/error-alert";
import { Skeleton } from "../ui/skeleton";

export interface RecentPagesProps {
  onSelectPage: (page: PageSummary) => void;
  onViewAll?: () => void;
  className?: string;
}

function RecentPages({ onSelectPage, onViewAll, className }: RecentPagesProps) {
  const api = useApiClient();
  const [rawPages, setRawPages] = React.useState<PageSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [sortField, setSortField] = React.useState<SortField>("updatedAt");
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>("desc");
  const [pageToDelete, setPageToDelete] = React.useState<PageSummary | null>(
    null,
  );
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const pages = React.useMemo(
    () => sortPages(rawPages, sortField, sortDirection),
    [rawPages, sortField, sortDirection],
  );

  const handleSort = React.useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection(field === "title" ? "asc" : "desc");
      }
    },
    [sortField],
  );

  const fetchPages = React.useCallback(
    async (signal?: { cancelled: boolean }) => {
      setLoading(true);
      setError(false);

      const result = await api.get<PageSummary[]>("/pages");

      if (signal?.cancelled) return;

      if (result.error) {
        setError(true);
        setLoading(false);
        return;
      }

      const allPages = result.data ?? [];
      setRawPages(allPages.slice(0, 10));
      setLoading(false);
    },
    [api],
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

  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)]",
        className,
      )}
      style={{ boxShadow: "var(--admin-shadow-xs)" }}
      data-testid="recent-pages"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--admin-gray-200)]">
        <h2 className="text-[18px] font-semibold text-[var(--admin-gray-900)]">
          Recent Pages
        </h2>
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
        <ErrorAlert
          onRetry={() => void fetchPages()}
          className="p-5"
          data-testid="recent-pages-error"
        >
          Unable to load recent pages
        </ErrorAlert>
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
                <th className="px-4 py-3 text-left">
                  <button
                    type="button"
                    onClick={() => handleSort("title")}
                    className="inline-flex items-center gap-1 text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)] hover:text-[var(--admin-gray-800)] transition-colors"
                  >
                    Title
                    <SortIcon
                      field="title"
                      activeField={sortField}
                      direction={sortDirection}
                    />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)]">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)]">
                  Slug
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    type="button"
                    onClick={() => handleSort("updatedAt")}
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
                <th className="px-4 py-3 text-right text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b border-[var(--admin-gray-100)] last:border-b-0 hover:bg-[var(--admin-gray-50)] cursor-pointer"
                  data-testid={`recent-page-${page.id}`}
                  onClick={() => onSelectPage(page)}
                  role="link"
                >
                  <td className="px-4 py-3 text-[14px] font-medium text-[var(--admin-primary-600)] hover:text-[var(--admin-primary-700)]">
                    {page.title}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="default" size="sm">
                      {page.pageType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--admin-gray-500)] font-[JetBrains_Mono,monospace]">
                    /{page.slug}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--admin-gray-500)]">
                    {getUpdatedAt(page)
                      ? formatTimestamp(getUpdatedAt(page) as string)
                      : ""}
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
      )}

      <Dialog
        open={pageToDelete !== null}
        onClose={() => setPageToDelete(null)}
        title="Delete Page"
        className="max-w-sm"
      >
        <p className="text-[14px] text-[var(--admin-gray-600)]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[var(--admin-gray-900)]">
            {pageToDelete?.title}
          </span>
          ? This action cannot be undone.
        </p>
        {deleteError && (
          <p className="text-[13px] text-[var(--admin-error-600)] mt-2">
            {deleteError}
          </p>
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
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

RecentPages.displayName = "RecentPages";

export { RecentPages };
