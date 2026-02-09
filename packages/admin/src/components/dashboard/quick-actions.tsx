import * as React from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export interface QuickActionsProps {
  onCreatePage: () => void;
  onUploadMedia: () => void;
  className?: string;
}

export function QuickActions({
  onCreatePage,
  onUploadMedia,
  className,
}: QuickActionsProps) {
  return (
    <div className={cn('space-y-3', className)} data-testid="quick-actions">
      <h2 className="text-lg font-semibold">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onCreatePage}
          aria-label="Create New Page"
          data-testid="quick-action-create-page"
        >
          Create New Page
        </Button>
        <Button
          variant="outline"
          onClick={onUploadMedia}
          aria-label="Upload Media"
          data-testid="quick-action-upload-media"
        >
          Upload Media
        </Button>
      </div>
    </div>
  );
}
