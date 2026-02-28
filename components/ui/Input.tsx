import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-[var(--radius-md)] border bg-[var(--background-muted)] px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-[var(--destructive)] focus:ring-[var(--destructive)]/20 focus:border-[var(--destructive)]',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
