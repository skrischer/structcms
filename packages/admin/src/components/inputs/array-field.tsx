import * as React from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

export interface ArrayFieldProps<T> {
  label: string;
  value: T[];
  onChange: (value: T[]) => void;
  renderItem: (item: T, index: number, onChange: (item: T) => void) => React.ReactNode;
  createDefaultItem: () => T;
  error?: string;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
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
    required,
    className,
    id,
    name,
  }: ArrayFieldProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const inputId = id || name || React.useId();

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
    const temp = newValue[index] as T;
    newValue[index] = newValue[index - 1] as T;
    newValue[index - 1] = temp;
    onChange(newValue);
  };

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return;
    const newValue = [...value];
    const temp = newValue[index] as T;
    newValue[index] = newValue[index + 1] as T;
    newValue[index + 1] = temp;
    onChange(newValue);
  };

  const handleItemChange = (index: number, item: T) => {
    const newValue = [...value];
    newValue[index] = item;
    onChange(newValue);
  };

  return (
    <div ref={ref} className={cn('space-y-2', className)}>
      <Label htmlFor={inputId}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div
        className={cn(
          'rounded-md border border-input bg-background p-4',
          error && 'border-destructive'
        )}
      >
        {value.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items yet
          </p>
        ) : (
          <div className="space-y-3">
            {value.map((item, index) => (
              <div
                key={index}
                className="flex gap-2 items-start p-3 rounded-md border border-input bg-muted/50"
                data-testid={`array-item-${index}`}
              >
                <div className="flex-1">
                  {renderItem(item, index, (newItem) =>
                    handleItemChange(index, newItem)
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move up"
                    data-testid={`move-up-${index}`}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === value.length - 1}
                    title="Move down"
                    data-testid={`move-down-${index}`}
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(index)}
                    title="Remove"
                    data-testid={`remove-${index}`}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleAdd}
            id={inputId}
            data-testid="add-item"
          >
            Add Item
          </Button>
        </div>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

const ArrayField = React.forwardRef(ArrayFieldInner) as <T>(
  props: ArrayFieldProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

export { ArrayField };
