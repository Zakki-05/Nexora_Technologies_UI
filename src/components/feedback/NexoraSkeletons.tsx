'use client';

import React from 'react';

export function SkeletonPulse({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/70 ${className}`}
      aria-hidden="true"
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-8 w-56" />
        <SkeletonPulse className="h-9 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <SkeletonPulse key={n} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonPulse className="h-72 lg:col-span-2 rounded-2xl" />
        <SkeletonPulse className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2.5" aria-busy="true" aria-label="Loading table">
      <SkeletonPulse className="h-10 w-full rounded-xl" />
      {Array.from({ length: rows }).map((_, idx) => (
        <SkeletonPulse key={idx} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function Scene3DSkeleton() {
  return (
    <div
      className="w-full h-full min-h-[320px] rounded-3xl border border-[var(--border)] bg-[var(--surface)]/60 flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="w-24 h-24 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
    </div>
  );
}
