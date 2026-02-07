import Link from 'next/link';
import type { NavigationItem } from '@structcms/core';

function NavItem({ item }: { item: NavigationItem }) {
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <li>
        <Link
          href={item.href}
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
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
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        {item.label}
      </Link>
      <ul className="absolute left-0 top-full hidden min-w-40 rounded-md bg-white py-1 shadow-lg group-hover:block">
        {item.children!.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function Navigation({ items }: { items: NavigationItem[] }) {
  return (
    <nav>
      <ul className="flex items-center gap-1">
        {items.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </ul>
    </nav>
  );
}
