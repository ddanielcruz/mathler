import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/tailwind';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'error';
}

export function Alert({ children, className, variant = 'error', ...props }: AlertProps) {
  return (
    <div
      data-testid="alert"
      className={cn(
        'rounded-lg px-2 py-1 text-center sm:px-4 sm:py-3 sm:text-lg',
        variant === 'error' && 'bg-red-500 text-white',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
