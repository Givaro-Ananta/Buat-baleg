'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props },
    ref,
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-navy-900 hover:bg-navy-700 text-white rounded-xl focus:ring-navy-900 active:scale-[0.98]',
      outline:
        'border-2 border-gold-500 text-gold-500 bg-white hover:bg-gold-100 rounded-xl focus:ring-gold-500 active:scale-[0.98]',
      accent:
        'bg-gold-500 hover:bg-amber-600 text-white rounded-full focus:ring-gold-500 active:scale-[0.98]',
      ghost:
        'text-navy-900 hover:bg-gray-100 rounded-xl focus:ring-navy-900 active:scale-[0.98]',
      danger:
        'bg-red-600 hover:bg-red-700 text-white rounded-xl focus:ring-red-600 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
