import type { NavigationItem } from '@structcms/core';
import Link from 'next/link';

function NavItem({ item }: { item: NavigationItem }) {
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <li>
        <Link
          href={item.href}
          className="inline-flex rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/70 hover:text-secondary-foreground"
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li className="group relative">
      <Link
        href={item.href}
        className="inline-flex rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/70 hover:text-secondary-foreground"
      >
        {item.label}
      </Link>
      <div className="absolute left-0 top-full hidden pt-2 group-hover:block">
        <ul className="min-w-44 rounded-xl border border-border/80 bg-card/95 p-1.5 shadow-xl shadow-primary/10 backdrop-blur-sm">
          {item.children?.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/70 hover:text-secondary-foreground"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function Navigation({ items }: { items: NavigationItem[] }) {
  return (
    <nav>
      <ul className="flex flex-wrap items-center gap-1">
        {items.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </ul>
    </nav>
  );
}
