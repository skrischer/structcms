'use client';

import { Check, File, Filter, Search, Trash2, Upload } from 'lucide-react';
import * as React from 'react';
import { useApiClient } from '../../hooks/use-api-client';
import { cn } from '../../lib/utils';
import type { MediaItem } from '../../types/media';
import { Button } from '../ui/button';
import { Dialog } from '../ui/dialog';
import { Pagination } from '../ui/pagination';
import { Skeleton } from '../ui/skeleton';

export type { MediaItem };

export interface MediaBrowserProps {
  onSelect?: (item: MediaItem) => void;
  className?: string;
  pageSize?: number;
  category?: 'image' | 'document';
}

/**
 * Returns true if the given MIME type is an image type.
 */
function isImageMimeType(mimeType?: string): boolean {
  return !!mimeType && mimeType.startsWith('image/');
}

/**
 * Returns the accept attribute value for the file input based on category.
 */
function getAcceptAttribute(category?: 'image' | 'document'): string | undefined {
  if (category === 'image') return 'image/*';
  if (category === 'document') return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf';
  return undefined;
}

/**
 * Returns a text-based icon label for non-image file types.
 */
function getDocumentIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const iconMap: Record<string, string> = {
    pdf: 'PDF',
    doc: 'DOC',
    docx: 'DOC',
    xls: 'XLS',
    xlsx: 'XLS',
    ppt: 'PPT',
    pptx: 'PPT',
    txt: 'TXT',
    csv: 'CSV',
    rtf: 'RTF',
  };
  return iconMap[ext] ?? 'FILE';
}

function isImage(item: MediaItem, category?: 'image' | 'document'): boolean {
  return isImageMimeType(item.mimeType) || (!item.mimeType && !category) || category === 'image';
}

function MediaBrowser({ onSelect, className, pageSize = 12, category }: MediaBrowserProps) {
  const api = useApiClient();
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>(category ?? '');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = React.useState<MediaItem | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchMedia = React.useCallback(
    async (pageNum: number) => {
      setLoading(true);
      setError(null);

      const filterCategory = categoryFilter || category;
      let url = `/media?limit=${pageSize}&offset=${pageNum * pageSize}`;
      if (filterCategory) {
        url += `&category=${filterCategory}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const result = await api.get<MediaItem[]>(url);

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      const newItems = result.data ?? [];
      setItems(newItems);
      // Estimate total: if we got a full page, there might be more
      if (newItems.length >= pageSize) {
        setTotalCount((prev) => Math.max(prev, (pageNum + 2) * pageSize));
      } else {
        setTotalCount(pageNum * pageSize + newItems.length);
      }
      setLoading(false);
    },
    [api, pageSize, category, categoryFilter, search]
  );

  // Reset to page 0 when filters change
  const prevCategoryRef = React.useRef(categoryFilter);
  const prevSearchRef = React.useRef(search);

  React.useEffect(() => {
    const filtersChanged =
      prevCategoryRef.current !== categoryFilter || prevSearchRef.current !== search;
    prevCategoryRef.current = categoryFilter;
    prevSearchRef.current = search;

    if (filtersChanged) {
      setPage(0);
    }

    void fetchMedia(filtersChanged ? 0 : page);
  }, [fetchMedia, categoryFilter, search, page]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);

    const result = await api.upload<MediaItem>('/media', formData);

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      setPage(0);
      await fetchMedia(0);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (item: MediaItem) => {
    const result = await api.delete(`/media/${item.id}`);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setItemToDelete(null);
  };

  const handleSelect = (item: MediaItem) => {
    setSelectedId(item.id);
    onSelect?.(item);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1);
  };

  return (
    <div
      className={cn('max-w-[1100px] mx-auto w-full flex flex-col gap-6', className)}
      data-testid="media-browser"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--admin-gray-900)]">
            Media
          </h1>
          <p className="text-[14px] leading-[1.5] text-[var(--admin-gray-500)]">
            Manage your media files and assets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-gray-400)] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-60 rounded-md border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)] pl-9 pr-3 text-[14px] text-[var(--admin-gray-800)] placeholder:text-[var(--admin-gray-400)] focus-visible:outline-none focus-visible:border-[var(--admin-primary-500)] focus-visible:ring-[3px] focus-visible:shadow-[var(--admin-shadow-ring)]"
              data-testid="search-input"
            />
          </div>

          {/* Category filter */}
          {!category && (
            <div className="relative">
              <Filter
                size={16}
                strokeWidth={2}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-gray-600)] pointer-events-none"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 appearance-none rounded-md border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)] pl-9 pr-8 text-[14px] font-medium text-[var(--admin-gray-700)] focus-visible:outline-none focus-visible:border-[var(--admin-primary-500)] focus-visible:ring-[3px] focus-visible:shadow-[var(--admin-shadow-ring)]"
                data-testid="category-filter"
              >
                <option value="">All Types</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
              </select>
            </div>
          )}

          {/* Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptAttribute(
              category || (categoryFilter as 'image' | 'document') || undefined
            )}
            className="hidden"
            onChange={(e) => void handleUpload(e)}
            data-testid="file-input"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            data-testid="upload-button"
          >
            <Upload size={16} strokeWidth={2} />
            Upload
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-[var(--admin-error-700)]" data-testid="error">
          {error}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
          data-testid="loading"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Loading skeletons
            <Skeleton key={i} shape="rect" className="aspect-square w-full" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && !error && (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-testid="empty-state"
        >
          {/* Upload zone as empty state */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full max-w-[480px] rounded-lg gap-2 bg-[var(--admin-gray-50)] border-2 border-dashed border-[var(--admin-gray-300)] p-8 cursor-pointer hover:border-[var(--admin-primary-400)] hover:bg-[var(--admin-primary-50)] transition-colors"
          >
            <div className="flex items-center justify-center rounded-full bg-[var(--admin-gray-100)] shrink-0 size-10">
              <Upload size={20} className="text-[var(--admin-gray-500)]" strokeWidth={1.5} />
            </div>
            <span className="text-[14px] font-medium text-[var(--admin-gray-700)]">
              Drop files here or click to browse
            </span>
            <span className="text-[12px] text-[var(--admin-gray-400)]">
              PNG, JPG, SVG, WebP up to 10MB
            </span>
          </button>
          <p className="text-[14px] text-[var(--admin-gray-500)] mt-4">
            No media files yet. Upload your first file.
          </p>
        </div>
      )}

      {/* Media grid */}
      {!loading && items.length > 0 && (
        <>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
            data-testid="media-grid"
          >
            {items.map((item) => {
              const isSelected = selectedId === item.id;
              const isHovered = hoveredId === item.id;

              return (
                <div
                  key={item.id}
                  className={cn(
                    'group relative rounded-lg overflow-hidden cursor-pointer transition-all',
                    isSelected
                      ? 'border-2 border-[var(--admin-primary-500)] shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
                      : 'border border-[var(--admin-border-default)]'
                  )}
                  data-testid={`media-item-${item.id}`}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <button
                    type="button"
                    className="w-full aspect-square bg-[var(--admin-gray-50)] flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => handleSelect(item)}
                    data-testid={`media-select-${item.id}`}
                  >
                    {isImage(item, category) ? (
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <File
                          size={28}
                          strokeWidth={1.5}
                          className="text-[var(--admin-gray-400)]"
                        />
                        <span
                          className="text-[11px] font-bold text-[var(--admin-gray-500)]"
                          data-testid={`media-icon-${item.id}`}
                        >
                          {getDocumentIcon(item.filename)}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 flex items-center justify-center rounded-full bg-[var(--admin-primary-600)] size-5">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div
                    className={cn(
                      'absolute bottom-0 inset-x-0 flex items-center justify-between bg-[rgba(15,23,42,0.7)] p-2 transition-opacity',
                      isHovered ? 'opacity-100' : 'opacity-0'
                    )}
                  >
                    <span className="text-[11px] text-white truncate flex-1">{item.filename}</span>
                    <button
                      type="button"
                      className="shrink-0 ml-1 hover:text-[var(--admin-error-300)] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemToDelete(item);
                      }}
                      title="Delete"
                      data-testid={`media-delete-${item.id}`}
                    >
                      <Trash2 size={14} className="text-white" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page + 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              variant="compact"
            />
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        title="Delete Media"
      >
        <div className="flex flex-col gap-4">
          <p className="text-[14px] text-[var(--admin-gray-600)]">
            Are you sure you want to delete{' '}
            <span className="font-medium text-[var(--admin-gray-800)]">
              {itemToDelete?.filename}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setItemToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (itemToDelete) {
                  void handleDelete(itemToDelete);
                }
              }}
              data-testid="confirm-delete"
            >
              <Trash2 size={16} strokeWidth={2} />
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

MediaBrowser.displayName = 'MediaBrowser';

export { MediaBrowser, isImageMimeType };
