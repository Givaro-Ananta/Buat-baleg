'use client';

import { cn, getVerificationStatusColor, getTimeStatusColor } from '@/lib/utils';
import { TimeStatus, VerificationStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const icons: Record<VerificationStatus, string> = {
    'Draft': '✏️',
    'Belum Diperiksa': '⏳',
    Sesuai: '✅',
    'Perlu Revisi': '🔄',
  };

  return (
    <Badge className={getVerificationStatusColor(status)}>
      {icons[status]} {status}
    </Badge>
  );
}

export function TimeBadge({ status }: { status: TimeStatus }) {
  const icons: Record<TimeStatus, string> = {
    'Tepat Waktu': '✓',
    'Terlambat': '⚠',
    'Mohon Upload BAP': '📝',
  };

  return (
    <Badge className={getTimeStatusColor(status)}>
      {icons[status]} {status === 'Mohon Upload BAP' ? 'Mohon upload file BAP' : status}
    </Badge>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === 'Master Admin';
  return (
    <Badge
      className={
        isAdmin
          ? 'bg-navy-900 text-white border-navy-900'
          : 'bg-gold-100 text-amber-800 border-gold-500'
      }
    >
      {role}
    </Badge>
  );
}

export function StatusActiveBadge({ status }: { status: string }) {
  return (
    <Badge
      className={
        status === 'Aktif'
          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
          : 'text-gray-500 bg-gray-100 border-gray-200'
      }
    >
      {status === 'Aktif' ? '● Aktif' : '○ Nonaktif'}
    </Badge>
  );
}
