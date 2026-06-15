import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FieldMessage } from '../ui/field-message';

export interface ArrayFieldProps<T> {
  label: string;
  value: T[];
  onChange: (value: T[]) => void;
  renderItem: (item: T, index: number, onChange: (item: T) => void) => React.ReactNode;
  createDefaultItem: () => T;
  error?: string;
  description?: string;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

interface ItemWithKey<T> {
  key: string;
  item: T;
}

/**
 * Component for array fields with add/remove/reorder functionality.
 *
 * @example
 * ```tsx
 * <ArrayField
 *   label="Links"
 *   value={links}
 *   onChange={setLinks}
 *   createDefaultItem={() => ({ label: '', href: '' })}
 *   renderItem={(item, index, onChange) => (
 *     <div>
 *       <input value={item.label} onChange={e => onChange({ ...item, label: e.target.value })} />
 *       <input value={item.href} onChange={e => onChange({ ...item, href: e.target.value })} />
 *     </div>
 *   )}
 * />
 * ```
 */
function ArrayFieldInner<T>(
  {
    label,
    value,
    onChange,
    renderItem,
    createDefaultItem,
    error,
    description,
    required,
    className,
    id,
    name,
  }: ArrayFieldProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const generatedId = React.useId();
  const inputId = id ?? name ?? generatedId;
  const keyCounterRef = React.useRef(0);
  const prevItemsRef = React.useRef<ItemWithKey<T>[]>([]);

  // Generate stable keys for items
  const itemsWithKeys = React.useMemo(() => {
    const newItemsWithKeys = value.map((item, idx) => {
      const existing = prevItemsRef.current[idx];
      // If item at same position exists and hasn't changed reference, reuse key
      if (existing && existing.item === item) {
        return existing;
      }
      // Try to find the item elsewhere (moved)
      const found = prevItemsRef.current.find((x) => x.item === item);
      if (found) {
        return found;
      }
      // New item, generate key
      const key = `item-${keyCounterRef.current++}`;
      return { key, item };
    });

    prevItemsRef.current = newItemsWithKeys;
    return newItemsWithKeys;
  }, [value]);

  const handleAdd = () => {
    onChange([...value, createDefaultItem()]);
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newValue = [...value];
    const a = newValue[index];
    const b = newValue[index - 1];
    if (a === undefined || b === undefined) return;
    newValue[index] = b;
    newValue[index - 1] = a;
    onChange(newValue);
  };

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return;
    const newValue = [...value];
    const a = newValue[index];
    const b = newValue[index + 1];
    if (a === undefined || b === undefined) return;
    newValue[index] = b;
    newValue[index + 1] = a;
    onChange(newValue);
  };

  const handleItemChange = (index: number, item: T) => {
    const newValue = [...value];
    newValue[index] = item;
    onChange(newValue);
  };

  return (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)} data-testid="array-field">
      <div
        className={cn(
          'rounded-lg border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)] shadow-xs',
          error && 'border-[var(--admin-error-500)]'
        )}
      >
        {/* Header bar */}
        <div className="flex justify-between items-center py-3 px-4 border-b border-[var(--admin-gray-200)]">
          <span
            className={cn(
              'text-[16px] font-semibold text-[var(--admin-gray-900)]',
              required && "after:content-['*'] after:ml-0.5 after:text-[var(--admin-error-500)]"
            )}
          >
            {label}
          </span>
          <Badge data-testid="item-count">
            {value.length} {value.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        {/* Item rows */}
        {value.length === 0 ? (
          <p className="text-sm text-[var(--admin-gray-500)] text-center py-4">No items yet</p>
        ) : (
          <div>
            {itemsWithKeys.map(({ key, item }, index) => (
              <div
                key={key}
                className={cn(
                  'flex gap-2 items-start py-2.5 px-4',
                  index < value.length - 1 && 'border-b border-[var(--admin-gray-200)]'
                )}
                data-testid={`array-item-${index}`}
              >
                <div className="flex-1">
                  {renderItem(item, index, (newItem) => handleItemChange(index, newItem))}
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    aria-label="Move up"
                    data-testid={`move-up-${index}`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === value.length - 1}
                    aria-label="Move down"
                    data-testid={`move-down-${index}`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(index)}
                    aria-label="Remove"
                    data-testid={`remove-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add-item footer */}
        <div className="border-t border-[var(--admin-gray-200)]">
          <Button
            type="button"
            variant="ghost"
            onClick={handleAdd}
            id={inputId}
            data-testid="add-item"
            className="flex justify-center w-full py-2.5"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
      </div>
      {description && !error && <FieldMessage id={`${inputId}-desc`}>{description}</FieldMessage>}
      {error && (
        <FieldMessage id={`${inputId}-error`} variant="error">
          {error}
        </FieldMessage>
      )}
    </div>
  );
}

const ArrayField = React.forwardRef(ArrayFieldInner) as <T>(
  props: ArrayFieldProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

export { ArrayField };
