import * as React from 'react';
import { cn } from '../../lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
  error?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, optional, error, ...props }, ref) => (
    // biome-ignore lint/a11y/noLabelWithoutControl: Generic label component, control association handled by consumers
    <label
      ref={ref}
      className={cn(
        'text-[13px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        error ? 'text-[#B91C1C]' : 'text-[#334155]',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-[#EF4444] ml-0.5">*</span>}
      {optional && (
        <span className="text-[11px] text-[#94A3B8] font-normal ml-1.5">(optional)</span>
      )}
    </label>
  )
);
Label.displayName = 'Label';

export { Label };
