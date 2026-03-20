import { Image } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';
import type { MediaItem } from '../../types/media';
import { MediaBrowser } from '../media/media-browser';
import { Button } from '../ui/button';
import { Dialog } from '../ui/dialog';
import { FieldMessage } from '../ui/field-message';
import { Label } from '../ui/label';

export interface ImagePickerProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onBrowse?: () => void;
  error?: string;
  description?: string;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

function ImagePicker({
  label,
  value,
  onChange,
  onBrowse,
  error,
  description,
  required,
  className,
  id,
  name,
}: ImagePickerProps) {
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
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <div
        className={cn(
          'rounded-md border border-input bg-background p-4',
          error && 'border-[var(--admin-error-500)]'
        )}
      >
        {value ? (
          <div className="space-y-3">
            <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-md bg-muted">
              <img
                src={value}
                alt="Preview"
                className="h-full w-full object-cover"
                data-testid="image-preview"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={handleBrowse}>
                Change
              </Button>
              <Button
                type="button"
                variant="secondary"
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
            <Image size={32} strokeWidth={1.5} className="mb-4 text-muted-foreground" />
            <p className="mb-4 text-sm text-muted-foreground">No image selected</p>
            <Button
              type="button"
              variant="secondary"
              onClick={handleBrowse}
              id={inputId}
              data-testid="browse-button"
            >
              Browse Media
            </Button>
          </div>
        )}
      </div>
      {description && !error && <FieldMessage id={`${inputId}-desc`}>{description}</FieldMessage>}
      {error && (
        <FieldMessage id={`${inputId}-error`} variant="error">
          {error}
        </FieldMessage>
      )}
      {!onBrowse && (
        <Dialog
          open={mediaBrowserOpen}
          onClose={() => setMediaBrowserOpen(false)}
          title="Select Media"
        >
          <MediaBrowser onSelect={handleMediaSelect} category="image" />
        </Dialog>
      )}
    </div>
  );
}

ImagePicker.displayName = 'ImagePicker';

export { ImagePicker };
