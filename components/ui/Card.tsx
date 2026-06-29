'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
}

export function Card({ children, className, variant = 'light' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-shadow',
        variant === 'light'
          ? 'bg-white shadow-sm border border-gray-100 hover:shadow-md'
          : 'bg-navy-900 text-white shadow-lg',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
  variant?: 'light' | 'dark';
  color?: string;
}

export function StatCard({ title, value, icon, description, variant = 'dark', color }: StatCardProps) {
  return (
    <Card variant={variant}>
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              'text-sm font-medium mb-1',
              variant === 'dark' ? 'text-sky-300' : 'text-gray-500',
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              'text-3xl font-extrabold',
              variant === 'dark' ? 'text-white' : (color ?? 'text-navy-900'),
            )}
          >
            {value}
          </p>
          {description && (
            <p
              className={cn(
                'text-xs mt-1',
                variant === 'dark' ? 'text-sky-400' : 'text-gray-400',
              )}
            >
              {description}
            </p>
          )}
        </div>
        <div
          className={cn(
            'text-3xl p-3 rounded-xl',
            variant === 'dark' ? 'bg-white/10' : 'bg-gold-100',
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
