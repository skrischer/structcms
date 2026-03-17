'use client';

import type { NavigationItem } from '@structcms/core';
import { ChevronRight, GripVertical, Plus, Save, Trash2 } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export interface NavigationEditorProps {
  items: NavigationItem[];
  onSave: (items: NavigationItem[]) => void;
  saving?: boolean;
  className?: string;
}

interface ItemWithKey {
  key: string;
  item: NavigationItem;
  childrenKeys: string[];
}

/**
 * Editor for navigation items with nested structure support (one level).
 *
 * @example
 * ```tsx
 * <NavigationEditor
 *   items={navigation.items}
 *   onSave={(items) => saveNavigation({ ...navigation, items })}
 * />
 * ```
 */
function NavigationEditor({
  items: initialItems,
  onSave,
  saving,
  className,
}: NavigationEditorProps) {
  const [items, setItems] = React.useState<NavigationItem[]>(initialItems);
  const keyCounterRef = React.useRef(0);

  // Stable keys: assigned once per index position, grow as items are added
  const keysRef = React.useRef<string[]>([]);
  const childKeysRef = React.useRef<string[][]>([]);

  // Ensure we have enough keys for current items
  while (keysRef.current.length < items.length) {
    keysRef.current.push(`nav-item-${keyCounterRef.current++}`);
    childKeysRef.current.push([]);
  }
  for (let i = 0; i < items.length; i++) {
    const childCount = items[i]?.children?.length ?? 0;
    const existing = childKeysRef.current[i] ?? [];
    while (existing.length < childCount) {
      existing.push(`child-${keyCounterRef.current++}`);
    }
    childKeysRef.current[i] = existing;
  }

  const itemsWithKeys = items.map((item, idx) => ({
    key: keysRef.current[idx] as string,
    item,
    childrenKeys: childKeysRef.current[idx] ?? [],
  }));

  const handleAddItem = () => {
    setItems([...items, { label: '', href: '', children: [] }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    keysRef.current.splice(index, 1);
    childKeysRef.current.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: 'label' | 'href', value: string) => {
    const newItems = [...items];
    const item = newItems[index];
    if (item) {
      newItems[index] = { ...item, [field]: value };
    }
    setItems(newItems);
  };

  const handleAddChild = (parentIndex: number) => {
    const newItems = [...items];
    const parent = newItems[parentIndex];
    if (parent) {
      newItems[parentIndex] = {
        ...parent,
        children: [...(parent.children ?? []), { label: '', href: '' }],
      };
    }
    setItems(newItems);
  };

  const handleRemoveChild = (parentIndex: number, childIndex: number) => {
    const newItems = [...items];
    const parent = newItems[parentIndex];
    if (parent?.children) {
      const newChildren = [...parent.children];
      newChildren.splice(childIndex, 1);
      newItems[parentIndex] = { ...parent, children: newChildren };
    }
    setItems(newItems);
  };

  const handleChildChange = (
    parentIndex: number,
    childIndex: number,
    field: 'label' | 'href',
    value: string
  ) => {
    const newItems = [...items];
    const parent = newItems[parentIndex];
    if (parent?.children) {
      const newChildren = [...parent.children];
      const child = newChildren[childIndex];
      if (child) {
        newChildren[childIndex] = { ...child, [field]: value };
        newItems[parentIndex] = { ...parent, children: newChildren };
      }
    }
    setItems(newItems);
  };

  const handleSave = () => {
    onSave(items);
  };

  const totalChildren = items.reduce((sum, item) => sum + (item.children?.length ?? 0), 0);
  const totalCount = items.length + totalChildren;

  return (
    <div className={cn('flex flex-col gap-6', className)} data-testid="navigation-editor">
      {/* Page header */}
      <div>
        <h2 className="text-[24px] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--admin-gray-900)]">
          Navigation
        </h2>
        <p className="text-[14px] text-[var(--admin-gray-500)] mt-1">
          Manage navigation items and their hierarchy.
        </p>
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div
          className="flex flex-col items-center justify-center py-16 rounded-lg border border-[var(--admin-border-default)] bg-[var(--admin-surface-card)] shadow-[var(--admin-shadow-xs)]"
          data-testid="empty-state"
        >
          <GripVertical size={32} className="text-[var(--admin-gray-300)] mb-3" strokeWidth={1.5} />
          <p className="text-[14px] font-medium text-[var(--admin-gray-700)]">
            No navigation items
          </p>
          <p className="text-[13px] text-[var(--admin-gray-500)] mt-1 mb-4">
            Add your first navigation item to get started.
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddItem}
            data-testid="nav-add-item"
          >
            <Plus size={16} strokeWidth={2} />
            Add Item
          </Button>
        </div>
      ) : (
        /* Navigation items card */
        <div className="rounded-lg border border-[var(--admin-border-default)] bg-[var(--admin-surface-card)] overflow-hidden shadow-[var(--admin-shadow-xs)]">
          {/* Card header */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-[var(--admin-border-default)]">
            <span className="text-[13px] font-medium text-[var(--admin-gray-700)]">
              Navigation Items
            </span>
            <Badge size="sm">
              {totalCount} {totalCount === 1 ? 'item' : 'items'}
            </Badge>
          </div>

          {/* Items list */}
          <div>
            {itemsWithKeys.map(({ key, item, childrenKeys }, index) => (
              <div key={key} data-testid={`nav-item-${index}`}>
                {/* Parent item row */}
                <div className="flex items-center py-2.5 px-4 gap-3 border-b border-[var(--admin-border-subtle)]">
                  <GripVertical
                    size={16}
                    className="text-[var(--admin-gray-300)] shrink-0"
                    strokeWidth={2}
                  />

                  {/* Fields: Label + URL side by side */}
                  <div className="flex-1 flex gap-3">
                    <div className="flex-1 flex flex-col gap-1">
                      <Label className="text-[11px]">Label</Label>
                      <Input
                        placeholder="Label"
                        value={item.label}
                        onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                        data-testid={`nav-item-label-${index}`}
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <Label className="text-[11px]">URL</Label>
                      <Input
                        placeholder="/about"
                        value={item.href}
                        onChange={(e) => handleItemChange(index, 'href', e.target.value)}
                        data-testid={`nav-item-href-${index}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddChild(index)}
                      data-testid={`nav-add-child-${index}`}
                      className="text-[var(--admin-gray-500)]"
                    >
                      <Plus size={14} strokeWidth={2} />
                      <span className="hidden sm:inline">Add Child</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      title="Remove item"
                      data-testid={`nav-item-remove-${index}`}
                    >
                      <Trash2
                        size={14}
                        strokeWidth={1.5}
                        className="text-[var(--admin-gray-400)]"
                      />
                    </Button>
                  </div>
                </div>

                {/* Children */}
                {(item.children ?? []).length > 0 && (
                  <div className="ml-8 border-l-2 border-l-[var(--admin-primary-200)]">
                    {(item.children ?? []).map((child, childIndex) => (
                      <div
                        key={childrenKeys[childIndex] ?? `child-${childIndex}`}
                        className="flex items-center py-2 px-3 gap-3 border-b border-[var(--admin-border-subtle)]"
                        data-testid={`nav-child-${index}-${childIndex}`}
                      >
                        <ChevronRight
                          size={14}
                          className="text-[var(--admin-gray-300)] shrink-0"
                          strokeWidth={2}
                        />

                        <div className="flex-1 flex gap-3">
                          <div className="flex-1 flex flex-col gap-1">
                            <Label className="text-[11px]">Label</Label>
                            <Input
                              placeholder="Label"
                              value={child.label}
                              onChange={(e) =>
                                handleChildChange(index, childIndex, 'label', e.target.value)
                              }
                              data-testid={`nav-child-label-${index}-${childIndex}`}
                            />
                          </div>
                          <div className="flex-1 flex flex-col gap-1">
                            <Label className="text-[11px]">URL</Label>
                            <Input
                              placeholder="/about/team"
                              value={child.href}
                              onChange={(e) =>
                                handleChildChange(index, childIndex, 'href', e.target.value)
                              }
                              data-testid={`nav-child-href-${index}-${childIndex}`}
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveChild(index, childIndex)}
                          title="Remove child"
                          data-testid={`nav-child-remove-${index}-${childIndex}`}
                        >
                          <Trash2
                            size={14}
                            strokeWidth={1.5}
                            className="text-[var(--admin-gray-400)]"
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Item button at bottom of card */}
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 w-full p-2.5 hover:bg-[var(--admin-gray-50)] transition-colors"
            onClick={handleAddItem}
            data-testid="nav-add-item"
          >
            <Plus size={16} className="text-[var(--admin-primary-600)]" strokeWidth={2} />
            <span className="text-[13px] font-medium text-[var(--admin-primary-600)]">
              Add Item
            </span>
          </button>

          {/* Footer with save */}
          <div className="flex items-center justify-between py-4 px-4 border-t border-[var(--admin-border-default)] bg-[var(--admin-gray-50)]">
            <span className="text-[13px] text-[var(--admin-gray-500)]">
              {totalCount} {totalCount === 1 ? 'item' : 'items'} total
            </span>
            <Button type="button" onClick={handleSave} disabled={saving} data-testid="nav-save">
              <Save size={16} strokeWidth={2} />
              {saving ? 'Saving...' : 'Save Navigation'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

NavigationEditor.displayName = 'NavigationEditor';

export { NavigationEditor };
