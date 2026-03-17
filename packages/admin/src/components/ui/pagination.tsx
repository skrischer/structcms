'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'standard' | 'compact';
  itemsPerPage?: number;
  totalItems?: number;
  onItemsPerPageChange?: (count: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
}

function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1];

  if (currentPage <= 3) {
    pages.push(2, 3, 4, 5, 'ellipsis-end', totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(
      'ellipsis-start',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    );
  } else {
    pages.push(
      'ellipsis-start',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'ellipsis-end',
      totalPages
    );
  }

  return pages;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'standard',
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
  className,
}: PaginationProps) {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const showItemsInfo = itemsPerPage != null && totalItems != null;
  const rangeStart = showItemsInfo ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const rangeEnd = showItemsInfo ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {showItemsInfo && (
        <div className="flex items-center gap-2 text-[13px] text-[var(--admin-gray-500)]">
          <span>Rows per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
            className="h-8 rounded-md border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)] px-2 text-[13px] text-[var(--admin-gray-700)] focus-visible:outline-none focus-visible:border-[var(--admin-primary-500)] focus-visible:ring-[3px] focus-visible:ring-[var(--admin-shadow-ring)]"
          >
            {itemsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="text-[var(--admin-gray-700)]">
            {rangeStart}-{rangeEnd} of {totalItems}
          </span>
        </div>
      )}

      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          className="w-8 px-0 shrink-0"
          disabled={isFirstPage}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </Button>

        {variant === 'standard' ? (
          getPageNumbers(currentPage, totalPages).map((page) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return (
                <span
                  key={page}
                  className="flex items-center justify-center w-8 text-[13px] text-[var(--admin-gray-400)] select-none"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <Button
                key={page}
                variant={isActive ? 'default' : 'secondary'}
                size="sm"
                className="w-8 px-0 shrink-0"
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </Button>
            );
          })
        ) : (
          <span className="px-2 text-[14px] text-[var(--admin-gray-700)]">
            Page {currentPage} of {totalPages}
          </span>
        )}

        <Button
          variant="secondary"
          size="sm"
          className="w-8 px-0 shrink-0"
          disabled={isLastPage}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
}

Pagination.displayName = 'Pagination';

export { Pagination };
