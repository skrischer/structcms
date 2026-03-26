import { List, Plus, Upload } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export interface QuickActionsProps {
  onCreatePage: () => void;
  onUploadMedia: () => void;
  onEditNavigation?: () => void;
  className?: string;
}

export function QuickActions({
  onCreatePage,
  onUploadMedia,
  onEditNavigation,
  className,
}: QuickActionsProps) {
  return (
    <div className={cn("space-y-4", className)} data-testid="quick-actions">
      <h2 className="text-[20px] font-semibold text-[var(--admin-gray-900)]">
        Quick Actions
      </h2>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onCreatePage}
          aria-label="Create New Page"
          data-testid="quick-action-create-page"
        >
          <Plus size={16} strokeWidth={2} />
          New Page
        </Button>
        <Button
          variant="secondary"
          onClick={onUploadMedia}
          aria-label="Upload Media"
          data-testid="quick-action-upload-media"
        >
          <Upload size={16} strokeWidth={2} />
          Upload Media
        </Button>
        {onEditNavigation && (
          <Button
            variant="secondary"
            onClick={onEditNavigation}
            aria-label="Edit Navigation"
            data-testid="quick-action-edit-navigation"
          >
            <List size={16} strokeWidth={2} />
            Edit Navigation
          </Button>
        )}
      </div>
    </div>
  );
}
