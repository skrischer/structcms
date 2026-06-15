'use client';

import { Search } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';
import type { BreadcrumbItem } from '../ui/breadcrumb';
import { Breadcrumb } from '../ui/breadcrumb';

import { Input } from '../ui/input';

export interface HeaderBarProps {
  breadcrumbItems?: BreadcrumbItem[];
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  onToggleSidebar?: () => void;
  userInitials?: string;
  className?: string;
}

function HeaderBar({
  breadcrumbItems,
  onSearch,
  searchPlaceholder = 'Search...',
  onToggleSidebar,
  userInitials,
  className,
}: HeaderBarProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <header
      className={cn(
        'flex h-14 items-center justify-between border-b border-[var(--admin-gray-200)] bg-[var(--admin-surface-header)] px-5',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {breadcrumbItems && breadcrumbItems.length > 0 && <Breadcrumb items={breadcrumbItems} />}
      </div>

      <div className="flex items-center gap-2">
        {onSearch && (
          <div className="relative hidden sm:block">
            <Search
              size={16}
              strokeWidth={1.5}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--admin-gray-600)] pointer-events-none"
            />
            <Input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="h-8 w-48 pl-8 text-[13px]"
            />
          </div>
        )}

        {userInitials && (
          <div className="flex size-8 items-center justify-center rounded-full bg-[var(--admin-primary-100)] text-[13px] font-semibold text-[var(--admin-primary-700)]">
            {userInitials}
          </div>
        )}
      </div>
    </header>
  );
}

HeaderBar.displayName = 'HeaderBar';

export { HeaderBar };
