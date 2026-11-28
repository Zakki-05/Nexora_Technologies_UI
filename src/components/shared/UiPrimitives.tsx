'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

export function formatINR(amount: number | string | null | undefined): string {
  const num = Number(amount ?? 0);
  if (Number.isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDateStr(val: string | null | undefined): string {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return val;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'blue',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet';
}) {
  const colorMap = {
    blue: 'bg-blue-500/10 text-[#2563EB] dark:text-[#60A5FA]',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  } as const;

  return (
    <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{title}</p>
        <p className="font-mono text-2xl font-extrabold tabular-nums text-[var(--text-primary)] mt-1.5">{value}</p>
        {subtitle && <p className="text-xs text-[var(--text-secondary)] mt-1">{subtitle}</p>}
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  const styles =
    s === 'ACTIVE' || s === 'APPROVED' || s === 'PRESENT' || s === 'PAID'
      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      : s === 'PENDING' || s === 'LATE' || s === 'HALF_DAY'
      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${styles}`}>
      {s}
    </span>
  );
}

export function PanelSpinner() {
  return (
    <div className="py-16 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-[#2563EB]/20 border-t-[#2563EB] animate-spin" />
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">{title}</h1>
        {subtitle && <p className="text-sm text-[var(--text-secondary)] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}
