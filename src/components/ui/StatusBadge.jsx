import React from 'react';

export const StatusBadge = ({ status, size = 'sm', className = '' }) => {
  const norm = String(status || '').toUpperCase().trim();

  const getStyle = (s) => {
    switch (s) {
      case 'ACTIVE':
      case 'APPROVED':
      case 'PRESENT':
      case 'PAID':
      case 'REGULAR':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'PENDING':
      case 'HALF_DAY':
      case 'ON_LEAVE':
      case 'TEA_BREAK':
      case 'LUNCH_BREAK':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'INACTIVE':
      case 'REJECTED':
      case 'ABSENT':
      case 'UNPAID':
      case 'TERMINATED':
      case 'CANCELLED':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30';
      case 'SUPER_ADMIN':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30';
      case 'ADMIN':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
      case 'EMPLOYEE':
        return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30';
    }
  };

  const sizeClass = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full border ${getStyle(
        norm
      )} ${sizeClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 fill-current opacity-80" />
      {norm.replace(/_/g, ' ')}
    </span>
  );
};
