'use client';

import * as React from 'react';
import { type NavigationItem } from '@structcms/core';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export interface NavigationEditorProps {
  items: NavigationItem[];
  onSave: (items: NavigationItem[]) => void;
  className?: string;
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
  className,
}: NavigationEditorProps) {
  const [items, setItems] = React.useState<NavigationItem[]>(initialItems);

  const handleAddItem = () => {
    setItems([...items, { label: '', href: '', children: [] }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (
    index: number,
    field: 'label' | 'href',
    value: string
  ) => {
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

  return (
    <div className={cn('space-y-4', className)} data-testid="navigation-editor">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Navigation</h2>
      </div>

      {items.length === 0 ? (
        <p
          className="text-sm text-muted-foreground text-center py-8"
          data-testid="empty-state"
        >
          No navigation items yet.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-md border border-input bg-background p-4 space-y-3"
              data-testid={`nav-item-${index}`}
            >
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) =>
                      handleItemChange(index, 'label', e.target.value)
                    }
                    data-testid={`nav-item-label-${index}`}
                  />
                  <Input
                    placeholder="URL (e.g. /about)"
                    value={item.href}
                    onChange={(e) =>
                      handleItemChange(index, 'href', e.target.value)
                    }
                    data-testid={`nav-item-href-${index}`}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  title="Remove item"
                  data-testid={`nav-item-remove-${index}`}
                >
                  ✕
                </Button>
              </div>

              {/* Children */}
              {(item.children ?? []).length > 0 && (
                <div className="ml-6 space-y-2">
                  {(item.children ?? []).map((child, childIndex) => (
                    <div
                      key={childIndex}
                      className="flex gap-2 items-start rounded-md border border-input bg-muted/30 p-3"
                      data-testid={`nav-child-${index}-${childIndex}`}
                    >
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Label"
                          value={child.label}
                          onChange={(e) =>
                            handleChildChange(
                              index,
                              childIndex,
                              'label',
                              e.target.value
                            )
                          }
                          data-testid={`nav-child-label-${index}-${childIndex}`}
                        />
                        <Input
                          placeholder="URL"
                          value={child.href}
                          onChange={(e) =>
                            handleChildChange(
                              index,
                              childIndex,
                              'href',
                              e.target.value
                            )
                          }
                          data-testid={`nav-child-href-${index}-${childIndex}`}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveChild(index, childIndex)}
                        title="Remove child"
                        data-testid={`nav-child-remove-${index}-${childIndex}`}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddChild(index)}
                data-testid={`nav-add-child-${index}`}
              >
                Add Child
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 border-t border-input pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddItem}
          data-testid="nav-add-item"
        >
          Add Item
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          data-testid="nav-save"
        >
          Save Navigation
        </Button>
      </div>
    </div>
  );
}

NavigationEditor.displayName = 'NavigationEditor';

export { NavigationEditor };
