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
        'rounded-lg p-2 text-center sm:p-3 sm:text-lg',
        variant === 'error' && 'bg-red-500 text-white',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
