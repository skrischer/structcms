import { ChevronRight } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <ChevronRight
                size={14}
                strokeWidth={1.5}
                className="text-[var(--admin-gray-300)] shrink-0"
              />
            )}
            {isLast ? (
              <span className="text-[14px] leading-[18px] font-medium text-[var(--admin-gray-800)]">
                {item.icon}
                {item.label}
              </span>
            ) : item.href ? (
              <a
                href={item.href}
                className="text-[14px] leading-[18px] text-[var(--admin-primary-500)] hover:underline inline-flex items-center"
              >
                {item.icon}
                {item.label}
              </a>
            ) : (
              <span className="text-[14px] leading-[18px] text-[var(--admin-primary-500)] inline-flex items-center">
                {item.icon}
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
