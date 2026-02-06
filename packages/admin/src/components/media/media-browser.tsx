'use client';

import * as React from 'react';
import { useApiClient } from '../../hooks/use-api-client';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType?: string;
  createdAt?: string;
}

export interface MediaBrowserProps {
  onSelect?: (item: MediaItem) => void;
  className?: string;
  pageSize?: number;
}

/**
 * Browse, upload, and select media files.
 *
 * @example
 * ```tsx
 * <AdminProvider registry={registry} apiBaseUrl="/api/cms">
 *   <MediaBrowser onSelect={(item) => setImageUrl(item.url)} />
 * </AdminProvider>
 * ```
 */
function MediaBrowser({
  onSelect,
  className,
  pageSize = 12,
}: MediaBrowserProps) {
  const api = useApiClient();
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchMedia = React.useCallback(
    async (pageNum: number, append: boolean) => {
      setLoading(true);
      setError(null);

      const result = await api.get<MediaItem[]>(
        `/media?limit=${pageSize}&offset=${pageNum * pageSize}`
      );

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      const newItems = result.data ?? [];
      setItems((prev) => (append ? [...prev, ...newItems] : newItems));
      setHasMore(newItems.length >= pageSize);
      setLoading(false);
    },
    [api, pageSize]
  );

  React.useEffect(() => {
    void fetchMedia(0, false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    void fetchMedia(nextPage, true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${api.get.toString().includes('baseUrl') ? '' : ''}/media`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        setError('Upload failed');
        setLoading(false);
        return;
      }

      // Refresh the list
      setPage(0);
      await fetchMedia(0, false);
    } catch {
      setError('Upload failed');
      setLoading(false);
    }

    // Reset file input
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
  };

  return (
    <div className={cn('space-y-4', className)} data-testid="media-browser">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Media</h2>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void handleUpload(e)}
            data-testid="file-input"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            data-testid="upload-button"
          >
            Upload
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive" data-testid="error">
          {error}
        </p>
      )}

      {!loading && items.length === 0 && !error && (
        <p
          className="text-sm text-muted-foreground text-center py-8"
          data-testid="empty-state"
        >
          No media files yet. Upload your first file.
        </p>
      )}

      {items.length > 0 && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          data-testid="media-grid"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-md border border-input bg-background overflow-hidden"
              data-testid={`media-item-${item.id}`}
            >
              <button
                type="button"
                className="w-full aspect-square bg-muted flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => onSelect?.(item)}
                data-testid={`media-select-${item.id}`}
              >
                <img
                  src={item.url}
                  alt={item.filename}
                  className="h-full w-full object-cover"
                />
              </button>
              <div className="p-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate flex-1">
                  {item.filename}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => void handleDelete(item)}
                  title="Delete"
                  data-testid={`media-delete-${item.id}`}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <p className="text-sm text-muted-foreground" data-testid="loading">
          Loading media...
        </p>
      )}

      {hasMore && !loading && (
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleLoadMore}
            data-testid="load-more"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

MediaBrowser.displayName = 'MediaBrowser';

export { MediaBrowser };
