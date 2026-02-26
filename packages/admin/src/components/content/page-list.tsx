'use client';

import * as React from 'react';
import { useAdmin } from '../../hooks/use-admin';
import { useApiClient } from '../../hooks/use-api-client';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export interface PageSummary {
  id: string;
  title: string;
  slug: string;
  pageType: string;
  updatedAt?: string;
}

export interface PageListProps {
  onSelectPage: (page: PageSummary) => void;
  onCreatePage: () => void;
  className?: string;
}

/**
 * List all pages with filter/search, link to edit each page.
 *
 * @example
 * ```tsx
 * <AdminProvider registry={registry} apiBaseUrl="/api/cms">
 *   <PageList
 *     onSelectPage={(page) => router.push(`/admin/pages/${page.id}`)}
 *     onCreatePage={() => router.push('/admin/pages/new')}
 *   />
 * </AdminProvider>
 * ```
 */
function PageList({ onSelectPage, onCreatePage, className }: PageListProps) {
  const api = useApiClient();
  const { registry } = useAdmin();
  const [pages, setPages] = React.useState<PageSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [pageTypeFilter, setPageTypeFilter] = React.useState('');

  const pageTypes = registry.getAllPageTypes();

  React.useEffect(() => {
    let cancelled = false;

    async function fetchPages() {
      setLoading(true);
      setError(null);

      const result = await api.get<PageSummary[]>('/pages');

      if (cancelled) return;

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      setPages(result.data ?? []);
      setLoading(false);
    }

    void fetchPages();

    return () => {
      cancelled = true;
    };
  }, [api]);

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

  return (
    <div className={cn('space-y-4', className)} data-testid="page-list">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pages</h2>
        <Button type="button" onClick={onCreatePage} data-testid="create-page">
          Create New Page
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search by title or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
          data-testid="search-input"
        />
        {pageTypes.length > 0 && (
          <select
            value={pageTypeFilter}
            onChange={(e) => setPageTypeFilter(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            data-testid="page-type-filter"
          >
            <option value="">All Types</option>
            {pageTypes.map((pt) => (
              <option key={pt.name} value={pt.name}>
                {pt.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground" data-testid="loading">
          Loading pages...
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive" data-testid="error">
          {error}
        </p>
      )}

      {!loading && !error && filteredPages.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8" data-testid="empty-state">
          {pages.length === 0
            ? 'No pages yet. Create your first page.'
            : 'No pages match your search.'}
        </p>
      )}

      {!loading && !error && filteredPages.length > 0 && (
        <div className="rounded-md border border-input" data-testid="page-table">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-input bg-muted/50">
                <th className="text-left p-3 font-medium">Title</th>
                <th className="text-left p-3 font-medium">Slug</th>
                <th className="text-left p-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b border-input last:border-0 hover:bg-muted/30 cursor-pointer"
                  onClick={() => onSelectPage(page)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPage(page);
                    }
                  }}
                  tabIndex={0}
                  data-testid={`page-row-${page.id}`}
                >
                  <td className="p-3">{page.title}</td>
                  <td className="p-3 text-muted-foreground">{page.slug}</td>
                  <td className="p-3 text-muted-foreground capitalize">{page.pageType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

PageList.displayName = 'PageList';

export { PageList };
