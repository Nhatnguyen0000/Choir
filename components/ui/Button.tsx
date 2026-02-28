import * as React from 'react';
import { cn } from '../../lib/utils';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold transition-colors transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 min-h-[var(--touch-min,44px)]';

const variantClasses = {
  default:
    'bg-[var(--primary)] text-white shadow-[0_2px_12px_-4px_rgba(232,93,4,0.45)] hover:opacity-95 hover:shadow-[0_4px_16px_-4px_rgba(232,93,4,0.5)] hover:-translate-y-px active:translate-y-0 rounded-[14px]',
  secondary:
    'bg-[var(--background-muted)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--background-elevated)] hover:border-[var(--border-strong)] rounded-[14px]',
  ghost: 'hover:bg-[var(--background-muted)] rounded-[14px]',
  destructive: 'bg-[var(--destructive)] text-white hover:opacity-90 rounded-[14px]',
  link: 'underline-offset-4 hover:underline',
} as const;

const sizeClasses = {
  sm: 'h-9 rounded-[12px] px-3 text-sm',
  md: 'h-11 rounded-[14px] px-4 text-sm',
  lg: 'h-12 rounded-[16px] px-6 text-base',
  icon: 'h-11 w-11 rounded-[14px]',
} as const;

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function getButtonClasses(variant: ButtonVariant = 'default', size: ButtonSize = 'md', className?: string) {
  return cn(base, variantClasses[variant], sizeClasses[size], className);
}

/** For use outside Button component (e.g. className={buttonVariants({ variant: 'secondary' })}). */
export function buttonVariants(opts?: { variant?: ButtonVariant; size?: ButtonSize; className?: string }) {
  return getButtonClasses(opts?.variant ?? 'default', opts?.size ?? 'md', opts?.className);
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        className={getButtonClasses(variant, size, className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
