import * as React from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

export interface ImagePickerProps {
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
 * Component for image fields that opens MediaBrowser for selection.
 *
 * @example
 * ```tsx
 * <ImagePicker
 *   label="Hero Image"
 *   value={imageUrl}
 *   onChange={setImageUrl}
 *   onBrowse={() => setMediaBrowserOpen(true)}
 *   required
 *   error={errors.image?.message}
 * />
 * ```
 */
function ImagePicker({
  label,
  value,
  onChange,
  onBrowse,
  error,
  required,
  className,
  id,
  name,
}: ImagePickerProps) {
  const inputId = id || name || React.useId();

  const handleClear = () => {
    onChange?.('');
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
            <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-md bg-muted">
              <img
                src={value}
                alt="Selected image"
                className="h-full w-full object-cover"
                data-testid="image-preview"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onBrowse}
              >
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
            <div className="mb-4 text-4xl text-muted-foreground">🖼️</div>
            <p className="mb-4 text-sm text-muted-foreground">
              No image selected
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={onBrowse}
              id={inputId}
              data-testid="browse-button"
            >
              Browse Media
            </Button>
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

ImagePicker.displayName = 'ImagePicker';

export { ImagePicker };
