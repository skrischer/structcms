"use client";

import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Checkbox } from "../ui/checkbox";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T | ((row: T) => string);
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string, direction: "asc" | "desc") => void;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  className?: string;
}

function getRowKey<T extends Record<string, unknown>>(
  row: T,
  rowKey: keyof T | ((row: T) => string),
): string {
  if (typeof rowKey === "function") {
    return rowKey(row);
  }
  return String(row[rowKey]);
}

function DataTableInner<T extends Record<string, unknown>>(
  {
    columns,
    data,
    rowKey,
    selectable,
    selectedRows,
    onSelectionChange,
    sortColumn,
    sortDirection,
    onSort,
    onRowClick,
    emptyState,
    className,
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLTableElement>,
) {
  const allKeys = React.useMemo(
    () => data.map((row) => getRowKey(row, rowKey)),
    [data, rowKey],
  );

  const selectedCount = selectedRows?.size ?? 0;
  const allSelected = data.length > 0 && selectedCount === data.length;
  const someSelected = selectedCount > 0 && selectedCount < data.length;

  function handleSelectAll() {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(allKeys));
    }
  }

  function handleSelectRow(key: string) {
    if (!onSelectionChange || !selectedRows) return;
    const next = new Set(selectedRows);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    onSelectionChange(next);
  }

  function handleSort(columnKey: string) {
    if (!onSort) return;
    const nextDirection: "asc" | "desc" =
      sortColumn === columnKey && sortDirection === "asc" ? "desc" : "asc";
    onSort(columnKey, nextDirection);
  }

  function renderSortIcon(columnKey: string) {
    if (sortColumn === columnKey) {
      return sortDirection === "asc" ? (
        <ChevronUp className="w-4 h-4 text-[var(--admin-primary-600)]" />
      ) : (
        <ChevronDown className="w-4 h-4 text-[var(--admin-primary-600)]" />
      );
    }
    return <ArrowUpDown className="w-4 h-4 text-[var(--admin-gray-400)]" />;
  }

  function renderCellValue(column: Column<T>, row: T): React.ReactNode {
    const value: unknown = row[column.key];
    if (column.render) {
      return column.render(value, row);
    }
    if (value == null) return "";
    return String(value);
  }

  return (
    <div className={cn("w-full overflow-auto", className)}>
      <table ref={ref} className="w-full border-collapse">
        <thead>
          <tr className="bg-[var(--admin-gray-50)] border-b border-[var(--admin-gray-200)]">
            {selectable && (
              <th className="w-[52px] px-4">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 text-left text-[13px] tracking-[0.01em] font-medium text-[var(--admin-gray-600)] h-[44px]"
                style={column.width ? { width: column.width } : undefined}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 cursor-pointer select-none"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.header}
                    {renderSortIcon(column.key)}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="h-[200px] text-center align-middle"
              >
                {emptyState ?? (
                  <span className="text-[14px] text-[var(--admin-gray-400)]">
                    No data
                  </span>
                )}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const key = getRowKey(row, rowKey);
              const isSelected = selectedRows?.has(key) ?? false;

              return (
                <tr
                  key={key}
                  className={cn(
                    "h-[52px] border-b border-[var(--admin-gray-100)] transition-colors",
                    isSelected
                      ? "bg-[var(--admin-primary-50)]"
                      : "hover:bg-[var(--admin-gray-50)]",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onRowClick?.(row);
                  }}
                >
                  {selectable && (
                    <td className="w-[52px] px-4">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(key)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 text-[14px] text-[var(--admin-gray-800)]",
                        column.key === "slug" &&
                          "font-[JetBrains_Mono,monospace]",
                      )}
                    >
                      {renderCellValue(column, row)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

const DataTable = React.forwardRef(DataTableInner) as <
  T extends Record<string, unknown>,
>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLTableElement> },
) => React.ReactElement;

(DataTable as React.FC).displayName = "DataTable";

export { DataTable };
