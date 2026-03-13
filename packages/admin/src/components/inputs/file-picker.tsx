import * as React from 'react';
import { cn } from '../../lib/utils';
import { MediaBrowser, type MediaItem } from '../media/media-browser';
import { Button } from '../ui/button';
import { Dialog } from '../ui/dialog';
import { Label } from '../ui/label';

export interface FilePickerProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onBrowse?: () => void;
  error?: string;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

/**
 * Extracts the filename from a URL or path string.
 */
function extractFilename(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split('/').pop() ?? url;
  } catch {
    return url.split('/').pop() ?? url;
  }
}

/**
 * Component for file/document fields that opens MediaBrowser for selection.
 *
 * @example
 * ```tsx
 * <FilePicker
 *   label="Download File"
 *   value={fileUrl}
 *   onChange={setFileUrl}
 *   required
 *   error={errors.file?.message}
 * />
 * ```
 */
function FilePicker({
  label,
  value,
  onChange,
  onBrowse,
  error,
  required,
  className,
  id,
  name,
}: FilePickerProps) {
  const inputId = id || name || React.useId();
  const [mediaBrowserOpen, setMediaBrowserOpen] = React.useState(false);

  const handleClear = () => {
    onChange?.('');
  };

  const handleBrowse = onBrowse ?? (() => setMediaBrowserOpen(true));

  const handleMediaSelect = (item: MediaItem) => {
    onChange?.(item.url);
    setMediaBrowserOpen(false);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={inputId}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div
        className={cn(
          'rounded-md border border-input bg-background p-4',
          error && 'border-destructive'
        )}
      >
        {value ? (
          <div className="space-y-3">
            <p className="text-sm text-foreground truncate" data-testid="file-name">
              {extractFilename(value)}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleBrowse}>
                Change
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                data-testid="clear-button"
              >
                Clear
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-4 text-sm text-muted-foreground">No file selected</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleBrowse}
              id={inputId}
              data-testid="browse-button"
            >
              Browse Files
            </Button>
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
      {!onBrowse && (
        <Dialog
          open={mediaBrowserOpen}
          onClose={() => setMediaBrowserOpen(false)}
          title="Select File"
        >
          <MediaBrowser onSelect={handleMediaSelect} category="document" />
        </Dialog>
      )}
    </div>
  );
}

FilePicker.displayName = 'FilePicker';

export { FilePicker };
