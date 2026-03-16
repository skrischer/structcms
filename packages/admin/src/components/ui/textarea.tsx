import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[96px] w-full rounded-md border bg-white px-3 py-2 text-[14px] leading-[18px] text-[#1E293B] placeholder:text-[#94A3B8] transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[#F8FAFC]',
          error
            ? 'border-[#EF4444] ring-[3px] ring-[rgba(239,68,68,0.15)] focus-visible:border-[#EF4444] focus-visible:ring-[rgba(239,68,68,0.15)]'
            : 'border-[#E2E8F0] focus-visible:border-[#3B82F6] focus-visible:ring-[3px] focus-visible:ring-[rgba(59,130,246,0.15)]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
