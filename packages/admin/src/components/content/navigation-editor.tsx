"use client";

import type { NavigationItem } from "@structcms/core";
import { ChevronRight, GripVertical, Plus, Save, Trash2 } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export interface NavigationEditorProps {
  items: NavigationItem[];
  onSave: (items: NavigationItem[]) => void;
  saving?: boolean;
  className?: string;
}

type SelectedItem =
  | { type: "parent"; index: number }
  | { type: "child"; parentIndex: number; childIndex: number };

/**
 * Two-panel editor for navigation items with nested structure support (one level).
 * Left panel: tree display. Right panel: property editor for selected item.
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
  const [selectedItem, setSelectedItem] = React.useState<SelectedItem | null>(
    null,
  );
  const [editLabel, setEditLabel] = React.useState("");
  const [editHref, setEditHref] = React.useState("");

  const getSelectedItemData = (): NavigationItem | undefined => {
    if (!selectedItem) return undefined;
    if (selectedItem.type === "parent") return items[selectedItem.index];
    return items[selectedItem.parentIndex]?.children?.[selectedItem.childIndex];
  };

  const isDirty = (): boolean => {
    const current = getSelectedItemData();
    if (!current) return false;
    return current.label !== editLabel || current.href !== editHref;
  };

  const applyEdits = (source: NavigationItem[]): NavigationItem[] => {
    if (!selectedItem) return source;
    const newItems = [...source];
    if (selectedItem.type === "parent") {
      const item = newItems[selectedItem.index];
      if (item) {
        newItems[selectedItem.index] = {
          ...item,
          label: editLabel,
          href: editHref,
        };
      }
    } else {
      const parent = newItems[selectedItem.parentIndex];
      if (parent?.children) {
        const newChildren = [...parent.children];
        const child = newChildren[selectedItem.childIndex];
        if (child) {
          newChildren[selectedItem.childIndex] = {
            ...child,
            label: editLabel,
            href: editHref,
          };
          newItems[selectedItem.parentIndex] = {
            ...parent,
            children: newChildren,
          };
        }
      }
    }
    return newItems;
  };

  const handleAddItem = () => {
    setItems([...items, { label: "", href: "", children: [] }]);
  };

  const handleRemoveItem = (index: number) => {
    if (selectedItem) {
      if (selectedItem.type === "parent" && selectedItem.index === index) {
        setSelectedItem(null);
      } else if (selectedItem.type === "parent" && selectedItem.index > index) {
        setSelectedItem({ type: "parent", index: selectedItem.index - 1 });
      } else if (
        selectedItem.type === "child" &&
        selectedItem.parentIndex === index
      ) {
        setSelectedItem(null);
      } else if (
        selectedItem.type === "child" &&
        selectedItem.parentIndex > index
      ) {
        setSelectedItem({
          type: "child",
          parentIndex: selectedItem.parentIndex - 1,
          childIndex: selectedItem.childIndex,
        });
      }
    }
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleAddChild = (parentIndex: number) => {
    const newItems = [...items];
    const parent = newItems[parentIndex];
    if (parent) {
      newItems[parentIndex] = {
        ...parent,
        children: [...(parent.children ?? []), { label: "", href: "" }],
      };
    }
    setItems(newItems);
  };

  const handleRemoveChild = (parentIndex: number, childIndex: number) => {
    if (
      selectedItem?.type === "child" &&
      selectedItem.parentIndex === parentIndex
    ) {
      if (selectedItem.childIndex === childIndex) {
        setSelectedItem(null);
      } else if (selectedItem.childIndex > childIndex) {
        setSelectedItem({
          type: "child",
          parentIndex,
          childIndex: selectedItem.childIndex - 1,
        });
      }
    }
    const newItems = [...items];
    const parent = newItems[parentIndex];
    if (parent?.children) {
      const newChildren = [...parent.children];
      newChildren.splice(childIndex, 1);
      newItems[parentIndex] = { ...parent, children: newChildren };
    }
    setItems(newItems);
  };

  const handleSelectItem = (sel: SelectedItem) => {
    let currentItems = items;
    if (selectedItem && isDirty()) {
      currentItems = applyEdits(items);
      setItems(currentItems);
    }

    let item: NavigationItem | undefined;
    if (sel.type === "parent") {
      item = currentItems[sel.index];
    } else {
      item = currentItems[sel.parentIndex]?.children?.[sel.childIndex];
    }
    if (item) {
      setSelectedItem(sel);
      setEditLabel(item.label);
      setEditHref(item.href);
    }
  };

  const handleApply = () => {
    if (!selectedItem) return;
    setItems(applyEdits(items));
    setSelectedItem(null);
  };

  const handleCancel = () => {
    setSelectedItem(null);
  };

  const handleSave = () => {
    onSave(items);
  };

  const handleRowKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    sel: SelectedItem,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelectItem(sel);
    }
  };

  const isParentSelected = (index: number) =>
    selectedItem?.type === "parent" && selectedItem.index === index;

  const isChildSelected = (parentIndex: number, childIndex: number) =>
    selectedItem?.type === "child" &&
    selectedItem.parentIndex === parentIndex &&
    selectedItem.childIndex === childIndex;

  const totalChildren = items.reduce(
    (sum, item) => sum + (item.children?.length ?? 0),
    0,
  );
  const totalCount = items.length + totalChildren;

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      data-testid="navigation-editor"
    >
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
          <GripVertical
            size={32}
            className="text-[var(--admin-gray-300)] mb-3"
            strokeWidth={1.5}
          />
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
        <>
          {/* Two-panel layout */}
          <div className="flex gap-6">
            {/* Tree Panel */}
            <div className="flex-1 max-w-[580px]">
              <div className="rounded-lg border border-[var(--admin-border-default)] bg-[var(--admin-surface-card)] overflow-hidden shadow-[var(--admin-shadow-xs)]">
                {/* Card header */}
                <div className="flex items-center justify-between py-3 px-4 border-b border-[var(--admin-border-default)]">
                  <span className="text-[13px] font-medium text-[var(--admin-gray-700)]">
                    Navigation
                  </span>
                  <Badge size="sm">
                    {totalCount} {totalCount === 1 ? "item" : "items"}
                  </Badge>
                </div>

                {/* Items list */}
                <div>
                  {items.map((item, index) => (
                    <div key={index} data-testid={`nav-item-${index}`}>
                      {/* Parent item row */}
                      <div
                        role="button"
                        tabIndex={0}
                        className={cn(
                          "group flex items-center py-2.5 px-4 gap-3 border-b border-[var(--admin-border-subtle)] cursor-pointer",
                          isParentSelected(index) &&
                            "bg-[var(--admin-primary-50)] border-l-2 border-l-[var(--admin-primary-500)]",
                        )}
                        onClick={() =>
                          handleSelectItem({ type: "parent", index })
                        }
                        onKeyDown={(e) =>
                          handleRowKeyDown(e, { type: "parent", index })
                        }
                      >
                        <GripVertical
                          size={16}
                          className="text-[var(--admin-gray-300)] shrink-0"
                          strokeWidth={2}
                        />

                        <span
                          className="text-[14px] font-medium text-[var(--admin-gray-900)] truncate"
                          data-testid={`nav-item-label-${index}`}
                        >
                          {item.label || "Untitled"}
                        </span>
                        <span
                          className="text-[13px] text-[var(--admin-gray-500)] truncate"
                          data-testid={`nav-item-href-${index}`}
                        >
                          {item.href || "/"}
                        </span>

                        <div className="flex items-center gap-1 shrink-0 ml-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddChild(index);
                            }}
                            aria-label="Add child"
                            data-testid={`nav-add-child-${index}`}
                          >
                            <Plus
                              size={14}
                              strokeWidth={2}
                              className="text-[var(--admin-gray-400)]"
                            />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(index);
                            }}
                            aria-label="Remove item"
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
                              key={childIndex}
                              role="button"
                              tabIndex={0}
                              className={cn(
                                "group flex items-center py-2 px-3 gap-3 border-b border-[var(--admin-border-subtle)] cursor-pointer",
                                isChildSelected(index, childIndex) &&
                                  "bg-[var(--admin-primary-50)] border-l-2 border-l-[var(--admin-primary-500)]",
                              )}
                              data-testid={`nav-child-${index}-${childIndex}`}
                              onClick={() =>
                                handleSelectItem({
                                  type: "child",
                                  parentIndex: index,
                                  childIndex,
                                })
                              }
                              onKeyDown={(e) =>
                                handleRowKeyDown(e, {
                                  type: "child",
                                  parentIndex: index,
                                  childIndex,
                                })
                              }
                            >
                              <ChevronRight
                                size={14}
                                className="text-[var(--admin-gray-300)] shrink-0"
                                strokeWidth={2}
                              />

                              <span
                                className="text-[14px] font-medium text-[var(--admin-gray-900)] truncate"
                                data-testid={`nav-child-label-${index}-${childIndex}`}
                              >
                                {child.label || "Untitled"}
                              </span>
                              <span
                                className="text-[13px] text-[var(--admin-gray-500)] truncate"
                                data-testid={`nav-child-href-${index}-${childIndex}`}
                              >
                                {child.href || "/"}
                              </span>

                              <div className="flex items-center gap-1 shrink-0 ml-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveChild(index, childIndex);
                                  }}
                                  aria-label="Remove child"
                                  data-testid={`nav-child-remove-${index}-${childIndex}`}
                                >
                                  <Trash2
                                    size={14}
                                    strokeWidth={1.5}
                                    className="text-[var(--admin-gray-400)]"
                                  />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Item button */}
                <Button
                  type="button"
                  variant="ghost"
                  className="flex items-center justify-center gap-1.5 w-full rounded-none"
                  onClick={handleAddItem}
                  data-testid="nav-add-item"
                >
                  <Plus
                    size={16}
                    className="text-[var(--admin-primary-600)]"
                    strokeWidth={2}
                  />
                  <span className="text-[13px] font-medium text-[var(--admin-primary-600)]">
                    Add Item
                  </span>
                </Button>
              </div>
            </div>

            {/* Editor Panel */}
            {selectedItem && (
              <div
                className="flex-1 max-w-[480px]"
                data-testid="nav-editor-panel"
              >
                <div className="rounded-lg border border-[var(--admin-border-default)] bg-[var(--admin-surface-card)] overflow-hidden shadow-[var(--admin-shadow-xs)]">
                  {/* Card header */}
                  <div className="py-3 px-4 border-b border-[var(--admin-border-default)]">
                    <span className="text-[13px] font-medium text-[var(--admin-gray-700)]">
                      Properties
                    </span>
                  </div>

                  {/* Form */}
                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label>Label</Label>
                      <Input
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        placeholder="Label"
                        data-testid="nav-editor-label"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>URL</Label>
                      <Input
                        value={editHref}
                        onChange={(e) => setEditHref(e.target.value)}
                        placeholder="/about"
                        data-testid="nav-editor-href"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-2 py-3 px-4 border-t border-[var(--admin-border-default)]">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCancel}
                      data-testid="nav-editor-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleApply}
                      data-testid="nav-editor-apply"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save footer */}
          <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-[var(--admin-border-default)] bg-[var(--admin-gray-50)]">
            <span className="text-[13px] text-[var(--admin-gray-500)]">
              {totalCount} {totalCount === 1 ? "item" : "items"} total
            </span>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              data-testid="nav-save"
            >
              <Save size={16} strokeWidth={2} />
              {saving ? "Saving..." : "Save Navigation"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

NavigationEditor.displayName = "NavigationEditor";

export { NavigationEditor };
